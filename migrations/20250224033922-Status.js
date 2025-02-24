module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection('users').updateMany({}, { $set: { status: 'active' } });
    console.log("✅ Status field added to all users with default value ''.");
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('users').updateMany({}, { $unset: { status: '' } });
    console.log("❌ Status field removed from all users.");
  }
};
