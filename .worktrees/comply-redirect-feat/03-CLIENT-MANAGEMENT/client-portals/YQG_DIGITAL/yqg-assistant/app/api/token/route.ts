import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Don't cache token responses
export const revalidate = 0;

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// In production, proxy token generation to the Python backend so the
// LiveKit API credentials stay server-side and the agent bridge starts.
const BACKEND_URL = process.env.BACKEND_URL; // e.g. http://localhost:8000

export async function POST(req: Request) {
  try {
    if (BACKEND_URL) {
      return proxyToBackend(BACKEND_URL, req);
    }
    return generateLocally(req);
  } catch (error) {
    if (error instanceof Error) {
      console.error('[token] Error:', error.message);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

// ── Session ID helpers ────────────────────────────────────────────────────

function generateSessionIds() {
  return {
    participantName: 'user',
    participantIdentity: `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`,
    roomName: `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`,
  };
}

// ── Local generation (dev, no backend running) ────────────────────────────

async function generateLocally(req: Request): Promise<NextResponse> {
  if (!LIVEKIT_URL) throw new Error('LIVEKIT_URL is not defined');
  if (!API_KEY) throw new Error('LIVEKIT_API_KEY is not defined');
  if (!API_SECRET) throw new Error('LIVEKIT_API_SECRET is not defined');

  const body = await req.json();
  const roomConfig = RoomConfiguration.fromJson(body?.room_config ?? {}, {
    ignoreUnknownFields: true,
  });

  const { participantName, participantIdentity, roomName } = generateSessionIds();

  const participantToken = await createParticipantToken(
    { identity: participantIdentity, name: participantName },
    roomName,
    roomConfig
  );

  const data: ConnectionDetails = {
    serverUrl: LIVEKIT_URL,
    roomName,
    participantName,
    participantToken,
  };
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

// ── Backend proxy (production) ────────────────────────────────────────────
// Calls Python backend /api/livekit/token which also starts the agent bridge.
// Reshapes the response to the ConnectionDetails type expected by @agents-ui.

async function proxyToBackend(backendUrl: string, req: Request): Promise<NextResponse> {
  const { participantName, participantIdentity, roomName } = generateSessionIds();

  const upstream = await fetch(`${backendUrl}/api/livekit/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.APP_SECRET ?? ''}`,
    },
    body: JSON.stringify({
      room_name: roomName,
      participant_name: participantIdentity,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    throw new Error(`Backend token error ${upstream.status}: ${detail}`);
  }

  // Python backend returns { token, url, room_name }
  const { token, url } = await upstream.json();

  const data: ConnectionDetails = {
    serverUrl: url,
    roomName,
    participantName,
    participantToken: token,
  };
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

// ── Local token helper ────────────────────────────────────────────────────

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  roomConfig: RoomConfiguration
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, { ...userInfo, ttl: '15m' });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  if (roomConfig) at.roomConfig = roomConfig;
  return at.toJwt();
}
