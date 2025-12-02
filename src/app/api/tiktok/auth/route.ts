
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const csrfState = Math.random().toString(36).substring(2);
  const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
  
  // Dynamically construct the redirect URI from the request URL
  const appUrl = new URL(request.url);
  const REDIRECT_URI = `${appUrl.protocol}//${appUrl.host}/api/tiktok/callback`;

  if (!TIKTOK_CLIENT_KEY) {
    return new NextResponse('Configuration error: TikTok Client Key is missing.', { status: 500 });
  }

  let url = 'https://www.tiktok.com/v2/auth/authorize/';

  url += `?client_key=${TIKTOK_CLIENT_KEY}`;
  url += '&scope=user.info.basic';
  url += '&response_type=code';
  url += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  url += `&state=${csrfState}`;
  
  return NextResponse.redirect(url);
}
