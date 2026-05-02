const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000'; // dev fallback
};

export async function getProjects() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/projects`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  } catch (error) {
    console.error('getProjects error:', error);
    return [];
  }
}

export async function getSiteContent() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/cms`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch site content');
    return await res.json();
  } catch (error) {
    console.error('getSiteContent error:', error);
    return null;
  }
}
