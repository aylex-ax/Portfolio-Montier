import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const projects = await request.json();

    const updates = projects.map(p =>
      supabaseAdmin
        .from('projects')
        .update({
          order: p.order,
          is_featured: p.isFeatured,
        })
        .eq('id', p.id)
    );

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
