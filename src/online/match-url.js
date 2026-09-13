const matchParameters = ["room", "player", "host", "role"];
const tokenPattern = /^[A-Za-z0-9_-]{1,100}$/;

export function isValidMatchToken(value) {
  return tokenPattern.test(value || "");
}

export async function roomIdForHostToken(hostToken) {
  if (!isValidMatchToken(hostToken)) throw new TypeError("Invalid host token");

  const digest = new Uint8Array(await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(hostToken),
  ));
  const encoded = btoa(String.fromCharCode(...digest))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `ttt-${encoded.slice(0, 22)}`;
}

export function createMatchUrls(address, { roomId, hostToken }) {
  if (!isValidMatchToken(roomId) || !isValidMatchToken(hostToken)) {
    throw new TypeError("Invalid match tokens");
  }

  const inviteUrl = new URL(address);
  inviteUrl.search = "";
  inviteUrl.hash = "";
  inviteUrl.searchParams.set("room", roomId);

  const hostUrl = new URL(inviteUrl);
  hostUrl.searchParams.set("host", hostToken);

  return {
    hostUrl: hostUrl.toString(),
    inviteUrl: inviteUrl.toString(),
  };
}

export function createPlayerUrl(address, { roomId, playerToken }) {
  if (!isValidMatchToken(roomId) || !isValidMatchToken(playerToken)) {
    throw new TypeError("Invalid match tokens");
  }

  const playerUrl = new URL(address);
  playerUrl.search = "";
  playerUrl.hash = "";
  playerUrl.searchParams.set("room", roomId);
  playerUrl.searchParams.set("player", playerToken);
  return playerUrl.toString();
}

export function parseMatchRoute(search) {
  const parameters = new URLSearchParams(search);
  const roomId = parameters.get("room");
  if (!roomId) return null;

  const hasHostToken = parameters.has("host");
  const hasGuestToken = parameters.has("player");
  const hostToken = hasHostToken ? parameters.get("host") : null;
  const guestToken = hasGuestToken ? parameters.get("player") : null;
  return {
    role: hasHostToken ? "host" : "guest",
    roomId,
    hostToken,
    guestToken,
    valid: !parameters.has("role")
      && !(hasHostToken && hasGuestToken)
      && isValidMatchToken(roomId)
      && (!hasHostToken || isValidMatchToken(hostToken))
      && (!hasGuestToken || isValidMatchToken(guestToken)),
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
