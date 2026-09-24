import { restoreGame } from "../game/game-state.ts";
import { isValidRoomId } from "./match-url.js";

export const MATCH_INACTIVITY_TIMEOUT = 24 * 60 * 60 * 1000;

const matchKeyPrefix = "tic-tac-toe:match:";
const tokenHashPattern = /^[A-Za-z0-9_-]{43}$/;

function matchKey(roomId) {
  return `${matchKeyPrefix}${roomId}`;
}

function validRecord(record) {
  return record?.version === 1
    && (record.playerTokenHash === null || tokenHashPattern.test(record.playerTokenHash))
    && restoreGame(record.game)
    && Number.isFinite(record.updatedAt)
    && record.updatedAt >= 0;
}

export function saveHostedMatch(storage, roomId, match, now = Date.now()) {
  if (
    !isValidRoomId(roomId)
    || (match.playerTokenHash !== null && !tokenHashPattern.test(match.playerTokenHash || ""))
    || !match.game
    || typeof match.game !== "object"
    || !Number.isFinite(now)
    || now < 0
  ) return null;

  const record = {
    version: 1,
    playerTokenHash: match.playerTokenHash,
    game: match.game,
    updatedAt: now,
  };

  try {
    storage.setItem(matchKey(roomId), JSON.stringify(record));
    return record;
  } catch {
    return null;
  }
}

export function loadHostedMatch(storage, roomId, now = Date.now()) {
  if (!isValidRoomId(roomId)) return null;

  try {
    const record = JSON.parse(storage.getItem(matchKey(roomId)));
    if (!validRecord(record) || now - record.updatedAt >= MATCH_INACTIVITY_TIMEOUT) {
      storage.removeItem(matchKey(roomId));
      return null;
    }
    return record;
  } catch {
    try {
      storage.removeItem(matchKey(roomId));
    } catch {}
    return null;
  }
}

export function removeHostedMatch(storage, roomId) {
  if (!isValidRoomId(roomId)) return;
  try {
    storage.removeItem(matchKey(roomId));
  } catch {}
}

export function pruneHostedMatches(storage, now = Date.now()) {
  try {
    const roomIds = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith(matchKeyPrefix)) roomIds.push(key.slice(matchKeyPrefix.length));
    }
    roomIds.forEach((roomId) => loadHostedMatch(storage, roomId, now));
  } catch {}
}
