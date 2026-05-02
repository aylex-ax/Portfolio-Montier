import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const images = [];

    // Helper to get files from a directory
    const getFiles = (dirPath, basePath) => {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
            images.push({
              name: file,
              url: `${basePath}/${file}`,
            });
          }
        }
      }
    };

    // Scan public root for existing images
    getFiles(path.join(process.cwd(), 'public'), '');
    
    // Scan uploads directory
    getFiles(path.join(process.cwd(), 'public', 'media', 'uploads'), '/media/uploads');
    
    // Scan about directories
    getFiles(path.join(process.cwd(), 'public', 'media', 'about', 'portraits'), '/media/about/portraits');
    getFiles(path.join(process.cwd(), 'public', 'media', 'about', 'tools'), '/media/about/tools');

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    let folder = formData.get('folder'); // e.g., 'about/portraits', 'about/tools', or null

    if (!folder || (!folder.startsWith('about/') && folder !== 'uploads')) {
      folder = 'uploads';
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'media', folder);
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/media/${folder}/${fileName}` 
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
