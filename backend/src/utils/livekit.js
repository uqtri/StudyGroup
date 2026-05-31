import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

export const isLiveKitConfigured = () =>
  Boolean(env.livekit.apiKey && env.livekit.apiSecret && env.livekit.url);

export const createLiveKitToken = ({ roomName, participantName, participantId }) => {
  if (!isLiveKitConfigured()) {
    throw ApiError.internal('LiveKit is not configured');
  }

  const token = new AccessToken(env.livekit.apiKey, env.livekit.apiSecret, {
    identity: participantId,
    name: participantName,
    ttl: '4h',
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return token.toJwt();
};

export const deleteLiveKitRoom = async (roomName) => {
  if (!isLiveKitConfigured()) return;

  const client = new RoomServiceClient(
    env.livekit.url,
    env.livekit.apiKey,
    env.livekit.apiSecret,
  );

  try {
    await client.deleteRoom(roomName);
  } catch {
    // Room may already be closed
  }
};

export const getLiveKitUrl = () => env.livekit.url;
