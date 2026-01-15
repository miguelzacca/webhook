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
    const data = Object.fromEntries(request.url.split("?")[1].split('&').map((el) => el.split('=')).map(([key, value]) => [key, decodeURIComponent(value)]));
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return Response.redirect('https://google.com');
  } catch (error: any) {
    console.error('Error writing file:', error);
    return Response.redirect('https://google.com');
  }
}
