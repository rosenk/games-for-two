const matchParameters = ["room", "player", "role"];
const tokenPattern = /^[A-Za-z0-9_-]{1,100}$/;

export function isValidMatchToken(value) {
  return tokenPattern.test(value || "");
}

export function createMatchUrls(address, { roomId, guestToken }) {
  if (!isValidMatchToken(roomId) || !isValidMatchToken(guestToken)) {
    throw new TypeError("Invalid match tokens");
  }

  const inviteUrl = new URL(address);
  inviteUrl.search = "";
  inviteUrl.hash = "";
  inviteUrl.searchParams.set("room", roomId);
  inviteUrl.searchParams.set("player", guestToken);
  inviteUrl.searchParams.set("role", "guest");

  const hostUrl = new URL(inviteUrl);
  hostUrl.searchParams.set("role", "host");

  return {
    hostUrl: hostUrl.toString(),
    inviteUrl: inviteUrl.toString(),
  };
}

export function parseMatchRoute(search) {
  const parameters = new URLSearchParams(search);
  const roomId = parameters.get("room");
  if (!roomId) return null;

  const role = parameters.get("role") || "guest";
  return {
    role,
    roomId,
    guestToken: parameters.get("player"),
    valid: (role === "host" || role === "guest")
      && isValidMatchToken(roomId)
      && isValidMatchToken(parameters.get("player")),
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
