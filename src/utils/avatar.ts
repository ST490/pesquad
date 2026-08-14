export function getInitialsAvatar(name: string, srn?: string): string {
  const cleanName = name.trim() || 'PESU Student';
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  // Deterministic gradient based on SRN or name
  const seed = (srn || name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = (seed * 47) % 360;
  const hue2 = (hue1 + 40) % 360;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hue1}, 85%, 45%)" />
          <stop offset="100%" stop-color="hsl(${hue2}, 90%, 55%)" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#g)" />
      <text x="60" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getProfileAvatar(photoUrl?: string | null, name: string = '', srn: string = ''): string {
  if (photoUrl && photoUrl.trim() && photoUrl.startsWith('http') || photoUrl?.startsWith('data:image')) {
    return photoUrl.trim();
  }
  return getInitialsAvatar(name, srn);
}
