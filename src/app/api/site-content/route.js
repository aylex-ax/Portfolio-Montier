import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error) {
      console.error('GET /api/site-content error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const content = {
      brandName: data.brand_name,
      heroTagline: data.hero_tagline,
      heroSubtitle: data.hero_subtitle,
      heroPortraitUrl: data.hero_portrait_url,
      heroBgUrl: data.hero_bg_url,
      about: {
        portraitUrl: data.about_portrait_url,
        aboutBgImage: data.about_bg_image,
        nickname: data.about_nickname,
        realName: data.about_real_name,
        heading: data.about_heading,
        paragraph: data.about_paragraph,
        bullets: data.about_bullets || [],
        tools: data.about_tools || [],
      },
      behanceProfile: data.behance_profile,
      instagramProfile: data.instagram_profile,
      whatsAppNumber: data.whatsapp_number,
      emailAddress: data.email_address,
    };

    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert({
        id: 'main',
        brand_name: body.brandName,
        hero_tagline: body.heroTagline,
        hero_subtitle: body.heroSubtitle,
        hero_portrait_url: body.heroPortraitUrl,
        hero_bg_url: body.heroBgUrl,
        about_portrait_url: body.about?.portraitUrl,
        about_bg_image: body.about?.aboutBgImage,
        about_nickname: body.about?.nickname,
        about_real_name: body.about?.realName,
        about_heading: body.about?.heading,
        about_paragraph: body.about?.paragraph,
        about_bullets: body.about?.bullets || [],
        about_tools: body.about?.tools || [],
        behance_profile: body.behanceProfile,
        instagram_profile: body.instagramProfile,
        whatsapp_number: body.whatsAppNumber,
        email_address: body.emailAddress,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('PUT /api/site-content error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
