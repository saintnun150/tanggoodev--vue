// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().admin.db_url //"https://tanggoodev.firebaseio.com"
});

const db = admin.database();
const fdb = admin.firestore();

exports.createUser = functions.region('asia-northeast3').auth.user().onCreate(async user => {
    const {uid, email, displayName, photoURL} = user;
    const time = new Date()
    const u = {
        email,
        displayName,
        photoURL,
        createAt: time, //front에서 변환 필요
        level: email === functions.config().admin.email ? 0 : 5
    };
    await fdb.collection("users").doc(uid).set(u)
    u.createAt = time.getTime()
    await db
        .ref("users")
        .child(uid)
        .set(u);
});

exports.deleteUser = functions.region('asia-northeast3').auth.user().onDelete(async user => {
    const {uid} = user;
    await db
        .ref("users")
        .child(uid)
        .remove();
    await fdb.collection("users").doc(uid).delete()
});

exports.incrementBoardCount = functions
    .region('asia-northeast3')
    .firestore
    .document('boards/{boardId}')
    .onCreate(async (snap, context) => {
        try {
            await fdb.collection('meta').doc('boards').update('count', admin.firestore.FieldValue.increment(1));
        } catch (e) {
            await fdb.collection('meta').doc('boards').set({count: 1});
        }
    });

exports.decrementBoardCount = functions
    .region('asia-northeast3')
    .firestore
    .document('boards/{boardId}')
    .onDelete(async (snap, context) => {
        await fdb.collection('meta').doc('boards').update('count', admin.firestore.FieldValue.increment(-1));
    });