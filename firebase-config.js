const admin = require("firebase-admin");
const serviceAccount = require("./flutter-happybirtday-firebase-adminsdk-crfws-6aaa38917d.json"); // Ganti dengan path ke file service account key Firebase-mu

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://flutter-happybirtday.appspot.com", // Ganti dengan project Firebase Storage ID kamu
});

const bucket = admin.storage().bucket();

module.exports = bucket;
