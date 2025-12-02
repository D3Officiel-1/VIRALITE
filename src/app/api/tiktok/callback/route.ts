
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // In a real app, you'd validate the state and exchange the code for an access token.
  // For now, we'll just log it and redirect to the home page.

  console.log('TikTok callback received:');
  console.log('Code:', code);
  console.log('State:', state);
  
  const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
  const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/tiktok/callback';

  if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET || !REDIRECT_URI || !code) {
    return new NextResponse('Configuration or callback error', { status: 500 });
  }

  const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';

  const params = new URLSearchParams();
  params.append('client_key', TIKTOK_CLIENT_KEY);
  params.append('client_secret', TIKTOK_CLIENT_SECRET);
  params.append('code', code);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', REDIRECT_URI);
  
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    console.log('TikTok token response:', data);

    if (data.error) {
        throw new Error(data.error_description || 'Failed to get access token');
    }
    
    // Here you would typically save the access_token (e.g., in a secure cookie or session)
    // and fetch user info. For now, we just redirect.

    const redirectUrl = new URL('/home', request.url);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Error fetching TikTok access token:', error);
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'tiktok_auth_failed');
    return NextResponse.redirect(errorUrl);
  }
}
