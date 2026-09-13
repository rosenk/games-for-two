const matchParameters = ["room", "player", "host", "role"];
const tokenPattern = /^[A-Za-z0-9_-]{1,100}$/;
const browserSecretPattern = /^[A-Za-z0-9_-]{43}$/;
const roomPattern = /^ttt-([a-f0-9]{32})([a-f0-9]{32})$/;
const browserSecretKey = "tic-tac-toe:browser-secret";

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

async function signatureBytes(browserSecret, value) {
  if (!browserSecretPattern.test(browserSecret || "")) {
    throw new TypeError("Invalid browser identity");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(browserSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function sign(browserSecret, value) {
  return encode(await signatureBytes(browserSecret, value));
}

export function isValidMatchToken(value) {
  return tokenPattern.test(value || "");
}

export function isValidRoomId(value) {
  return roomPattern.test(value || "");
}

export function getOrCreateBrowserSecret(storage) {
  try {
    const stored = storage.getItem(browserSecretKey);
    if (browserSecretPattern.test(stored || "")) return stored;
  } catch {}

  const browserSecret = randomValue(32);
  try {
    storage.setItem(browserSecretKey, browserSecret);
  } catch {}
  return browserSecret;
}

export async function createRoomId(browserSecret, nonce = encodeHex(crypto.getRandomValues(new Uint8Array(16)))) {
  if (!/^[a-f0-9]{32}$/.test(nonce)) throw new TypeError("Invalid room nonce");
  const signature = encodeHex(await signatureBytes(browserSecret, `room:${nonce}`));
  return `ttt-${nonce}${signature.slice(0, 32)}`;
}

export async function isRoomHost(roomId, browserSecret) {
  const match = roomPattern.exec(roomId || "");
  if (!match) return false;
  const [, nonce, signature] = match;
  return encodeHex(await signatureBytes(browserSecret, `room:${nonce}`)).slice(0, 32) === signature;
}

export async function playerTokenForRoom(browserSecret, roomId) {
  if (!isValidRoomId(roomId)) throw new TypeError("Invalid room ID");
  return `p-${await sign(browserSecret, `player:${roomId}`)}`;
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
