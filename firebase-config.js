const admin = require("firebase-admin");
const serviceAccount = require("./flutter-happybirtday-firebase-adminsdk-crfws-a25c4a2386.json");

admin
  .initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://flutter-happybirtday.appspot.com",
  })
  .catch((error) => {
    console.error("Firebase Admin SDK initialization error:", error);
  });

const bucket = admin.storage().bucket();

module.exports = bucket;
