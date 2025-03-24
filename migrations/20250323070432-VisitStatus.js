module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {

    await db.collection('getdoctervisits').updateMany({}, { $set: { status: 'pending' } });
    console.log("✅ status field added to all getdoctervisits records with default value pending.");

  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {

    await db.collection('getdoctervisits').updateMany({}, { $unset: { status: '' } });
    console.log("❌ status field removed from all getdoctervisits records.");

  }
};

//  migrate-mongo create