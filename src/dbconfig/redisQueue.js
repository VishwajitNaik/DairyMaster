// import Redis from 'ioredis';

// const redis = new Redis();

// const TTL = 10800; // 3 hours in seconds

// // Enqueue milk data with expiry
// export const enqueueMilkRecord = async (record) => {
//   try {
//     const recordKey = `milkRecord:${Date.now()}`;
//     await redis.set(recordKey, JSON.stringify(record), 'EX', TTL);
//     await redis.lpush('milkQueue', recordKey);
//     console.log('✅ Milk record added to Redis queue with 3-hour expiry');
//   } catch (error) {
//     console.error('❌ Failed to enqueue milk record:', error);
//   }
// };

// // Dequeue milk records from Redis
// export const dequeueMilkRecords = async () => {
//   try {
//     const recordKeys = await redis.lrange('milkQueue', 0, -1);
//     const records = await Promise.all(recordKeys.map(async key => {
//       const record = await redis.get(key);
//       return record ? JSON.parse(record) : null;
//     }));
//     console.log('✅ Milk records dequeued from Redis');
//     return records.filter(record => record !== null);
//   } catch (error) {
//     console.error('❌ Failed to dequeue milk records:', error);
//     return [];
//   }
// };
