import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ success: true });

    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/media/');
    if (pathParts.length > 1) {
      await supabaseAdmin.storage.from('media').remove([pathParts[1]]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
