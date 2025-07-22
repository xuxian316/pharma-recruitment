import { NextRequest, NextResponse } from 'next/server';

const VALID_CREDENTIALS = {
  username: '3331484470',
  password: 'qq3331484470',
};

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    // Generate a simple token (for demonstration purposes)
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
    });
  }

  return NextResponse.json({
    success: false,
    message: '用户名或密码错误',
  }, { status: 401 });
}
