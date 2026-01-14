import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const DATA_FILE_PATH = path.join(os.tmpdir(), 'latest-data.json');

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function deleteData() {
  try {
    await fs.unlink(DATA_FILE_PATH);
    return NextResponse.json({ success: true, message: 'Data deleted' }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete data' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, message: 'Data received' }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error writing file:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process data' }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data), { headers: corsHeaders });
  } catch (error) {
    // If file doesn't exist or error reading, return null or empty
    return NextResponse.json(null, { headers: corsHeaders });
  }
}
