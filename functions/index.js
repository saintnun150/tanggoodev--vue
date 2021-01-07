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
  databaseURL: "https://tanggoodev.firebaseio.com"
});

const db = admin.database();

exports.createUser = functions.region('asia-northeast3').auth.user().onCreate(async user => {
  const { uid, email, displayName, photoURL } = user;
  const u = {
    email,
    displayName,
    photoURL,
    createAt: new Date()
  };
  await db
    .ref("users")
    .child(uid)
    .set(u);
});

exports.deleteUser = functions.region('asia-northeast3').auth.user().onDelete(async user => {
  const { uid } = user;
  await db
    .ref("users")
    .child(uid)
    .remove();
});
