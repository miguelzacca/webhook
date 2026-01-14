import { NextResponse } from "next/server";
import { corsHeaders, deleteData } from "../route";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const DATA_FILE_PATH = path.join(os.tmpdir(), 'latest-data.json');

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const data = Object.fromEntries(request.url.split("?")[1].split('&').map((el) => el.split('=')));
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    setTimeout(deleteData, 1000 * 60 * 60 * 24)
    return NextResponse.json({ success: true, message: 'Data received' }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error writing file:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process data' }, { status: 500, headers: corsHeaders });
  }
}
