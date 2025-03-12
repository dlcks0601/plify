// /src/hooks/SpotifyPlayerSingleton.ts

let spotifyPlayerGlobal: Spotify.Player | null = null;

export const getSpotifyPlayer = (): Spotify.Player | null =>
  spotifyPlayerGlobal;

export const setSpotifyPlayer = (player: Spotify.Player) => {
  spotifyPlayerGlobal = player;
};

export const resetSpotifyPlayer = () => {
  spotifyPlayerGlobal = null;
};
