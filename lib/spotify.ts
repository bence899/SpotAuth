export const getSpotifyAuthUrl = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'user-read-playback-state',
    'streaming'
  ];

  // Generate random state using Web Crypto API
  const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    scope: scopes.join(' '),
    response_type: 'code',
    show_dialog: 'true',
    state
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}; 