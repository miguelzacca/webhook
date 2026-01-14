import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'latest-data.json');

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, message: 'Data received' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // If file doesn't exist or error reading, return null or empty
    return NextResponse.json(null);
  }
}
