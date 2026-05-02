import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'siteContent.json');

export async function GET() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Content file not found' }, { status: 404 });
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading CMS data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Ensure directory exists
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Overwrite the file
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving CMS data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
