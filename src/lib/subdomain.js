export function getSubdomain() {
  const hostname = window.location.hostname;

  const parts = hostname.split(".");

  // Common development domains to ignore
  const devDomains = [
    "vercel.app",
    "netlify.app",
    "pages.dev",
    "github.io",
    "herokuapp.com",
    "onrender.com",
  ];

  // Check if we're on a development platform
  for (const devDomain of devDomains) {
    if (hostname.endsWith(`.${devDomain}`)) {
      // For dev domains, we need one more part to consider it a subdomain
      return parts.length > 3 ? parts[0] : null;
    }
  }

  // Handle custom domains
  // Assuming anything with 3 or more parts has a subdomain
  // e.g., sub.domain.com, sub.domain.co.uk
  return parts.length > 2 ? parts[0] : null;
}
