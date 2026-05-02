import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = data.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      videoUrl: p.video_url,
      thumbnailPath: p.thumbnail_path,
      order: p.order,
      isFeatured: p.is_featured,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const projects = await request.json();

    // Delete all existing and re-insert (bulk save)
    await supabaseAdmin.from('projects').delete().neq('id', '');

    if (projects.length > 0) {
      const toInsert = projects.map(p => ({
        id: p.id || Date.now().toString(),
        title: p.title || '',
        description: p.description || '',
        video_url: p.videoUrl || '',
        thumbnail_path: p.thumbnailPath || '',
        order: p.order || 0,
        is_featured: p.isFeatured || false,
      }));

      const { error } = await supabaseAdmin.from('projects').insert(toInsert);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
