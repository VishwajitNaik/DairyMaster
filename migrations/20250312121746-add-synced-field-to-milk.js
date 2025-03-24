module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // ✅ Add 'synced' field with default value false to all existing Milk records
    await db.collection('milks').updateMany({}, { $set: { synced: false } });
    console.log("✅ Synced field added to all Milk records with default value false.");
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // ✅ Remove 'synced' field from all Milk records
    await db.collection('milks').updateMany({}, { $unset: { synced: '' } });
    console.log("❌ Synced field removed from all Milk records.");
  }
};
