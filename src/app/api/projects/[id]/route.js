import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('projects')
      .update({
        title: body.title,
        description: body.description,
        video_url: body.videoUrl,
        thumbnail_path: body.thumbnailPath,
        order: body.order,
        is_featured: body.isFeatured,
      })
      .eq('id', id);

    if (error) {
      console.error('PUT /api/projects/[id] error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('DELETE /api/projects/[id] error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
