import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'latest-data.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, message: 'Data received' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process data' }, { status: 500, headers: corsHeaders });
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
