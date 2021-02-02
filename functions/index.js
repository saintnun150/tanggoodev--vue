// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions")

const admin = require("firebase-admin")

const serviceAccount = require("./key.json")
const region = functions.config().admin.region || 'asia-northeast1'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().admin.db_url, //"https://tanggoodev.firebaseio.com"
    storageBucket: functions.config().admin.bucket_url
})

const db = admin.database()
const fs = admin.firestore()

exports.createUser = functions.region(region).auth.user().onCreate(async user => {
    const {uid, email, displayName, photoURL} = user
    const time = new Date()
    const u = {
        email,
        displayName,
        photoURL,
        createAt: time, //front에서 변환 필요
        level: email === functions.config().admin.email ? 0 : 5,
        visitedAt: time,
        visitCount: 0
    };
    await fs.collection("users").doc(uid).set(u)
    u.createAt = time.getTime()
    await db
        .ref("users")
        .child(uid)
        .set(u)
    // 사용자 수 정보 firestore 저장
    try {
        await fs.collection('meta').doc('users').update({count: admin.firestore.FieldValue.increment(1)})
    } catch (e) {
        await fs.collection('meta').doc('users').set({count: 1})
    }
})

exports.deleteUser = functions.region(region).auth.user().onDelete(async user => {
    const {uid} = user
    await db
        .ref("users")
        .child(uid)
        .remove()
    await fs.collection("users").doc(uid).delete()
    await fs.collection("meta").doc('users').update({count: admin.firestore.FieldValue.increment(-1)})
})

exports.onCreateBoard = functions.region(region).firestore.document('boards/{boardId}')
    .onCreate(async (snap, context) => {
        try {
            await fs.collection('meta').doc('boards').update({count: admin.firestore.FieldValue.increment(1)})
        } catch (e) {
            await fs.collection('meta').doc('boards').set({count: 1})
        }
    });

exports.onDeleteBoard = functions.region(region).firestore.document('boards/{boardId}')
    .onDelete(async (snap, context) => {
        await fs.collection('meta').doc('boards')
            .update({count: admin.firestore.FieldValue.increment(-1)})
            .catch(e => {
                console.error(`boardsCountUpdate Error: ${e.message}`)
            })
        const batch = fs.batch()
        const snapshot = await fs.collection('boards').doc(context.params.boardId).collection('article').get()
        // 게시판을 지우게 되면 게시물을 가져와서 지우는데 그것을 onDeleteBoardArticle 함수의 onDelete에서 감지를 한다.
        // 결국 onDeleteBoard와 onDeleteBoardArticle을 연결된 것.
        snapshot.docs.forEach(doc => batch.delete(doc.ref))
        await batch.commit()
    })

exports.onCreateBoardArticle = functions.region(region).firestore.document('boards/{boardId}/articles/{articleId}')
    .onCreate(async (snapshot, context) => {
        return fs.collection('boards').doc(context.params.articleId).update({count: admin.firestore.FieldValue.increment(1)})
    })

exports.onDeleteBoardArticle = functions.region(region).firestore.document('boards/{boardId}/articles/{articleId}')
    .onDelete(async (snapshot, context) => {
        await fs.collection('boards').doc(context.params.boardId)
            .update({count: admin.firestore.FieldValue.increment(-1)})
            .catch(e => {
                // 만약 update에서 에러 발생시 프로그램이 종료되기 때문에 catch가 필요함
                console.error(`boardsArticleCountUpdate Error: ${e.message}`)
            })

        try {
            // remove comment
            const batch = fs.batch()
            const snapshot = await fs.collection('boards').doc(context.params.boardId).collection('articles').doc(context.params.articleId).collection('comments').get()
            snapshot.docs.forEach(doc => batch.delete(doc.ref))
            await batch.commit()
        } catch (e) {
            console.error(`comment remove Error: ${e.message}`)
        }

        const ps = []
        ps.push('boards')
        ps.push(context.params.boardId)
        ps.push(context.params.articleId + '.md')

        await admin.storage().bucket().file(ps.join('/'))
            .delete()
            .catch(e => console.error(`storage remove err: ${e.message}`))
    })

exports.onCreateBoardComment = functions.region(region).firestore.document('boards/{boardId}/articles/{articleId}/comments/{commentId}')
    .onCreate((snapshot, context) => {
        return fs.collection('boards').doc(context.params.boardId).collection('articles').doc(context.params.articleId)
            .update({commentCount: admin.firestore.FieldValue.increment(1)})
    })

exports.onDeleteBoardCommment = functions.region(region).firestore.document('boards/{boardId}/articles/{articleId}/comments/{commentId}')
    .onDelete((snapshot, context) => {
        return fs.collection('boards').doc(context.params.boardId).collection('articles').doc(context.params.articleId)
            .update({commentCount: admin.firestore.FieldValue.increment(-1)})
    })