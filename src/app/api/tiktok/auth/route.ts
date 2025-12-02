
import { NextResponse } from 'next/server';

export function GET() {
  const csrfState = Math.random().toString(36).substring(2);
  const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/tiktok/callback';

  if (!TIKTOK_CLIENT_KEY || !REDIRECT_URI) {
    return new NextResponse('Configuration error', { status: 500 });
  }

  let url = 'https://www.tiktok.com/v2/auth/authorize/';

  url += `?client_key=${TIKTOK_CLIENT_KEY}`;
  url += '&scope=user.info.basic';
  url += '&response_type=code';
  url += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  url += `&state=${csrfState}`;
  
  return NextResponse.redirect(url);
}
