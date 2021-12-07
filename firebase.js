// 初始化FIREBASE

// 引用 firebase-admin模組
const admin = require("firebase-admin");
// 引用金鑰
const serviceAccount = require("./mfee21-project-one-firebase-key.json");
// 驗證金鑰
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// 輸出 admin 供其他檔案使用
module.exports = admin;