import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const targetUrl = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    'content-type': req.headers.get('content-type') || 'application/json',
    'accept': 'application/json',
  };

  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    headers['authorization'] = authHeader;
  }

  try {
    let bodyData: any = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const bodyText = await req.text();
      if (bodyText) {
        try {
          bodyData = JSON.parse(bodyText);
        } catch {
          bodyData = bodyText;
        }
      }
    }

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: bodyData,
      headers,
      validateStatus: () => true, // Pass all HTTP status codes (200, 400, 401, 500) through to frontend
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        data: null,
        error: {
          message: err.message || 'Failed to communicate with backend server',
          status: '500 INTERNAL_SERVER_ERROR',
        },
      },
      { status: err.response?.status || 500 }
    );
  }
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE,
};
