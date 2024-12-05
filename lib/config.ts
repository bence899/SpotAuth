export const spotifyConfig = {
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/verify'
}; 