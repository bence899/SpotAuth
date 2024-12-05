export const getSpotifyAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/verify';
  
  // Define permissions we need
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private'
  ].join(' ');

  // Construct the authorization URL
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: scope,
    response_type: 'token',
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}; 