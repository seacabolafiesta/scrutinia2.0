import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback-secret';

  if (!validEmail || !validPassword) {
    return NextResponse.json({ ok: false, error: 'Credenciales no configuradas en el servidor' }, { status: 500 });
  }

  if (email === validEmail && password === validPassword) {
    // Create a simple token: base64 of email + timestamp + secret hash
    const token = Buffer.from(`${email}:${Date.now()}:${secret}`).toString('base64');

    const response = NextResponse.json({ ok: true });
    response.cookies.set('scrutinia-admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  }

  return NextResponse.json({ ok: false, error: 'Credenciales incorrectas' }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('scrutinia-admin');
  return response;
}
