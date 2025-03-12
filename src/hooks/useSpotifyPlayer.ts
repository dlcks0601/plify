'use client';

import { useEffect, useState } from 'react';
import { transferPlayback } from '@/apis/spotify.api';
import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';

const loadSpotifySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 Spotify SDK가 로드되어 있다면 바로 resolve
    if (window.Spotify) {
      resolve();
    } else {
      // SDK가 로드되었을 때 호출될 콜백을 미리 정의
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve();
      };
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      script.onerror = reject;
      document.body.appendChild(script);
    }
  });
};

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken, userInfo } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    let spotifyPlayer: Spotify.Player | null = null;

    const initializePlayer = async () => {
      try {
        await loadSpotifySDK();
      } catch (error) {
        console.error('Error loading Spotify SDK:', error);
        return;
      }

      // Spotify 플레이어 인스턴스 생성
      spotifyPlayer = new window.Spotify.Player({
        name: 'Plify',
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      // 플레이어 이벤트 리스너 등록
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('💻 Spotify device ID:', device_id);
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

      const connected = await spotifyPlayer.connect();
      if (connected) {
        console.log(`🎵 Hello ${userInfo.name}`);
      }

      setPlayer(spotifyPlayer);
    };

    initializePlayer();

    // 컴포넌트 언마운트 시 플레이어 연결 해제
    return () => {
      if (spotifyPlayer) {
        spotifyPlayer.disconnect();
      }
    };
  }, [accessToken, setDeviceId, userInfo.name]);

  return { player, deviceId };
};
