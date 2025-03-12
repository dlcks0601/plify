'use client';

import { useEffect, useState } from 'react';
import { transferPlayback } from '@/apis/spotify.api';
import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken, userInfo } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    if (!window.Spotify) {
      console.error('Spotify SDK is not loaded.');
      return;
    }

    const spotifyPlayer = new window.Spotify.Player({
      name: 'Plify',
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.5,
    });

    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Spotify device ID:', device_id);
      setDeviceId(device_id);
      transferPlayback(device_id, accessToken);
    });

    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device has gone offline:', device_id);
    });

    spotifyPlayer.addListener('initialization_error', ({ message }) => {
      console.error('Initialization error:', message);
    });
    spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Authentication error:', message);
    });
    spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error('Account error:', message);
    });

    spotifyPlayer.connect().then((success) => {
      if (success) {
        console.log(`🎵 Hello ${userInfo.name}`);
      }
    });

    setPlayer(spotifyPlayer);

    return () => {
      spotifyPlayer.disconnect();
    };
  }, [accessToken, setDeviceId, userInfo.name]);

  return { player, deviceId };
};
