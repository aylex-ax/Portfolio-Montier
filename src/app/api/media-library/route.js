import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const folders = ['uploads', 'thumbnails', 'about'];
    let allFiles = [];

    for (const folder of folders) {
      const { data, error } = await supabaseAdmin.storage
        .from('media')
        .list(folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (!error && data) {
        const files = data
          .filter(f => f.name !== '.emptyFolderPlaceholder')
          .map(f => ({
            name: f.name,
            folder,
            url: supabaseAdmin.storage
              .from('media')
              .getPublicUrl(`${folder}/${f.name}`).data.publicUrl,
          }));
        allFiles = [...allFiles, ...files];
      }
    }

    return NextResponse.json(allFiles);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
