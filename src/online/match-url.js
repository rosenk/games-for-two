const matchParameters = ["room", "player", "host", "role"];
const tokenPattern = /^[A-Za-z0-9_-]{1,100}$/;
const tabSecretPattern = /^[A-Za-z0-9_-]{43}$/;
const roomPattern = /^ttt-([a-f0-9]{32})([a-f0-9]{32})$/;
const tabSecretKey = "tic-tac-toe:tab-secret";

const encoder = new TextEncoder();

function encode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function randomValue(byteLength) {
  return encode(crypto.getRandomValues(new Uint8Array(byteLength)));
}

function encodeHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signatureBytes(tabSecret, value) {
  if (!tabSecretPattern.test(tabSecret || "")) {
    throw new TypeError("Invalid tab identity");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(tabSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function sign(tabSecret, value) {
  return encode(await signatureBytes(tabSecret, value));
}

export function isValidMatchToken(value) {
  return tokenPattern.test(value || "");
}

export function isValidRoomId(value) {
  return roomPattern.test(value || "");
}

export function getOrCreateTabSecret(storage) {
  try {
    const stored = storage.getItem(tabSecretKey);
    if (tabSecretPattern.test(stored || "")) return stored;
  } catch {}

  const tabSecret = randomValue(32);
  try {
    storage.setItem(tabSecretKey, tabSecret);
  } catch {}
  return tabSecret;
}

export async function createRoomId(tabSecret, nonce = encodeHex(crypto.getRandomValues(new Uint8Array(16)))) {
  if (!/^[a-f0-9]{32}$/.test(nonce)) throw new TypeError("Invalid room nonce");
  const signature = encodeHex(await signatureBytes(tabSecret, `room:${nonce}`));
  return `ttt-${nonce}${signature.slice(0, 32)}`;
}

export async function isRoomHost(roomId, tabSecret) {
  const match = roomPattern.exec(roomId || "");
  if (!match) return false;
  const [, nonce, signature] = match;
  return encodeHex(await signatureBytes(tabSecret, `room:${nonce}`)).slice(0, 32) === signature;
}

export async function playerTokenForRoom(tabSecret, roomId) {
  if (!isValidRoomId(roomId)) throw new TypeError("Invalid room ID");
  return `p-${await sign(tabSecret, `player:${roomId}`)}`;
}

export async function hashPlayerToken(playerToken) {
  if (!isValidMatchToken(playerToken)) throw new TypeError("Invalid player token");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(playerToken));
  return encode(new Uint8Array(digest));
}

export function createMatchUrl(address, roomId) {
  if (!isValidRoomId(roomId)) throw new TypeError("Invalid room ID");

  const matchUrl = new URL(address);
  matchUrl.search = "";
  matchUrl.hash = "";
  matchUrl.searchParams.set("room", roomId);
  return matchUrl.toString();
}

export function parseMatchRoute(search) {
  const parameters = new URLSearchParams(search);
  const roomId = parameters.get("room");
  if (!roomId) return null;

  return {
    roomId,
    valid: isValidRoomId(roomId)
      && !matchParameters.slice(1).some((parameter) => parameters.has(parameter)),
  };
}

export function matchPath(address) {
  const url = new URL(address);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function clearMatchPath(address) {
  const url = new URL(address);
  matchParameters.forEach((parameter) => url.searchParams.delete(parameter));
  return matchPath(url);
}
