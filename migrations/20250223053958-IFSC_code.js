module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // Add 'ifscCode' field to all users with default value 'MAHB0000804'
    await db.collection("users").updateMany({}, { $set: { ifscCode: "MAHB0000804" } });
    console.log("✅ IFSC Code field added to all users with default value 'MAHB0000804'.");
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // Remove 'ifscCode' field from all users in case of rollback
    await db.collection("users").updateMany({}, { $unset: { ifscCode: "" } });
    console.log("❌ IFSC Code field removed from all users.");
  }
};
