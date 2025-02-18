import { NextResponse } from 'next/server';
import { setValue, getValue, checkRedisConnection } from '../../../dbconfig/redis';

// Check Redis connection before processing requests
async function ensureRedisConnection() {
  const isConnected = await checkRedisConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Redis connection failed!" }, { status: 500 });
  }
  return null;
}

// Handle POST requests to interact with Redis
export async function POST(req) {
  const connectionError = await ensureRedisConnection();
  if (connectionError) return connectionError;

  const { key, value } = await req.json();
  await setValue(key, value);
  return NextResponse.json({ message: `✅ Set ${key} = ${value}` });
}

// Handle GET requests to retrieve values from Redis
export async function GET(req) {
  const connectionError = await ensureRedisConnection();
  if (connectionError) return connectionError;

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const value = await getValue(key);

  if (value === null) {
    return NextResponse.json({ error: `❌ Key '${key}' not found in Redis.` }, { status: 404 });
  }

  return NextResponse.json({ key, value });
}
