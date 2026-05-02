import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const THUMBNAILS_DIR = path.join(process.cwd(), 'public', 'media', 'thumbnails');

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const oldPath = formData.get('oldPath');

    // Delete old physical file if requested
    if (oldPath && oldPath.startsWith('/media/thumbnails/')) {
      const oldPhysicalPath = path.join(process.cwd(), 'public', oldPath);
      if (fs.existsSync(oldPhysicalPath)) {
        fs.unlinkSync(oldPhysicalPath);
      }
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    if (!fs.existsSync(THUMBNAILS_DIR)) {
      fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
    }

    const filePath = path.join(THUMBNAILS_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/media/thumbnails/${fileName}` 
    });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return NextResponse.json({ error: 'Failed to upload thumbnail' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();
    if (url && url.startsWith('/media/thumbnails/')) {
      const filePath = path.join(process.cwd(), 'public', url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting thumbnail:', error);
    return NextResponse.json({ error: 'Failed to delete thumbnail' }, { status: 500 });
  }
}
