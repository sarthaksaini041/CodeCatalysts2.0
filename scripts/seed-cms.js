const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_CONTENT_DEFAULTS = [
  { key: 'hero_tagline', content: 'CODE CATALYSTS' },
  { key: 'hero_line1', content: 'CRAFTING THE' },
  { key: 'hero_line2', content: 'FUTURE OF CODE' },
  { key: 'hero_scroll_hint', content: 'Scroll to explore' },
  { key: 'chapter1_title', content: 'GENESIS' },
  { key: 'chapter2_title', content: 'SHIFT' },
  { key: 'chapter3_title', content: 'JOURNEY' },
  { key: 'chapter4_title', content: 'FORGE' },
  { key: 'chapter5_title', content: 'ARCHITECTS' },
  { key: 'applyPageEnabled', content: 'true' }
];

const FOOTER_DEFAULTS = {
  tagline: 'Engineered for Excellence.',
  email: 'codecatalysts000@gmail.com',
  instagram: 'https://instagram.com/codecatalysts',
  linkedin: 'https://linkedin.com/company/codecatalysts',
  github: 'https://github.com/codecatalysts',
  copyright_text: '© 2026 Code Catalysts. All rights reserved.'
};

async function seed() {
  console.log('🚀 Starting CMS Seeding...');

  try {
    // 1. Seed site_content
    console.log('Updating site_content...');
    const { error: contentError } = await supabase
      .from('site_content')
      .upsert(SITE_CONTENT_DEFAULTS, { onConflict: 'key' });
    
    if (contentError) throw contentError;
    console.log('✅ site_content updated.');

    // 2. Seed footer_settings
    console.log('Updating footer_settings...');
    // We check if a row exists, if not we insert, if yes we upsert (preserving ID)
    const { data: existingFooter } = await supabase.from('footer_settings').select('id').maybeSingle();
    
    const footerPayload = existingFooter 
      ? { ...FOOTER_DEFAULTS, id: existingFooter.id }
      : FOOTER_DEFAULTS;

    const { error: footerError } = await supabase
      .from('footer_settings')
      .upsert(footerPayload);

    if (footerError) throw footerError;
    console.log('✅ footer_settings updated.');

    console.log('\n🌟 Seeding complete! The admin portal should now show all boxes as "filled".');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seed();
