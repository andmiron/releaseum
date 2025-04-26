export function getSubdomain() {
  const hostname = window.location.hostname;

  const parts = hostname.split(".");

  if (hostname.endsWith(".pages.dev")) {
    if (parts.length > 3) {
      return parts[0];
    }
    return null;
  }

  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}
