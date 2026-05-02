import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder'); // 'portraits' or 'tools'
    const oldPath = formData.get('oldPath');

    // Security check to avoid path traversal
    if (!['portraits', 'tools'].includes(folder)) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
    }

    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'media', 'about', folder);

    // Delete old file if provided
    if (oldPath && oldPath.includes(`/media/about/${folder}/`)) {
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
    
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/media/about/${folder}/${fileName}` 
    });
  } catch (error) {
    console.error('Error uploading about media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();
    if (url && url.includes('/media/about/')) {
      const filePath = path.join(process.cwd(), 'public', url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting about media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
