const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();
firestore.settings({timestampsInSnapshots: true});
const storage = admin.storage();

module.exports = {admin, firestore, storage};