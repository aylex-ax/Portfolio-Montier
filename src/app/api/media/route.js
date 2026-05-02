import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const folders = ['uploads', 'thumbnails', 'about/portraits', 'about/backgrounds', 'about/tools'];
    let allImages = [];

    for (const folder of folders) {
      const { data, error } = await supabaseAdmin.storage
        .from('media')
        .list(folder, {
          limit: 200,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (!error && data) {
        const files = data
          .filter(f => f.name !== '.emptyFolderPlaceholder' && f.name)
          .map(f => ({
            name: f.name,
            folder,
            url: supabaseAdmin.storage
              .from('media')
              .getPublicUrl(`${folder}/${f.name}`).data.publicUrl,
          }));
        allImages = [...allImages, ...files];
      }
    }

    return NextResponse.json({ images: allImages });
  } catch (err) {
    return NextResponse.json({ images: [] });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${folder}/${timestamp}-${safeName}`;

    const { error } = await supabaseAdmin.storage
      .from('media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: fileName,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { path } = await request.json();
    
    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage
      .from('media')
      .remove([path]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
