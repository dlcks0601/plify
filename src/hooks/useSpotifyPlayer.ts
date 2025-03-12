'use client';

import { transferPlayback } from '@/apis/spotify.api';
import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';
import { useEffect, useState } from 'react';

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken, userInfo } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const loadSpotifySDK = () => {
      return new Promise<void>((resolve, reject) => {
        // 이미 스크립트가 존재하면 바로 resolve
        const existingScript = document.querySelector(
          'script[src="https://sdk.scdn.co/spotify-player.js"]'
        );
        if (existingScript) {
          console.log('✅ Spotify SDK script already exists.');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          console.log('✅ Spotify SDK loaded successfully.');
          // 스크립트 로드 후 잠깐 딜레이 후 강제로 onSpotifyWebPlaybackSDKReady 호출
          setTimeout(() => {
            if (window.onSpotifyWebPlaybackSDKReady) {
              window.onSpotifyWebPlaybackSDKReady();
            } else {
              console.error(
                '❌ window.onSpotifyWebPlaybackSDKReady is not defined.'
              );
            }
          }, 100);
          resolve();
        };
        script.onerror = () => {
          console.error('❌ Failed to load Spotify SDK.');
          reject(new Error('Spotify SDK load error'));
        };
      });
    };

    loadSpotifySDK()
      .then(() => {
        // SDK 로드 후 onSpotifyWebPlaybackSDKReady 재정의
        window.onSpotifyWebPlaybackSDKReady = () => {
          console.log('🎶 onSpotifyWebPlaybackSDKReady 실행됨');

          const player = new window.Spotify.Player({
            name: 'Plify',
            getOAuthToken: (cb) => cb(accessToken),
            volume: 0.5,
          });

          player.addListener('ready', ({ device_id }) => {
            console.log('💻 Spotify Device ID:', device_id);
            if (!device_id) {
              console.error('❌ Device ID is missing!');
              return;
            }
            setDeviceId(device_id);
            transferPlayback(device_id, accessToken);
          });

          player.addListener('not_ready', ({ device_id }) => {
            console.log('⚠️ Device has gone offline:', device_id);
          });

          player.addListener('initialization_error', ({ message }) => {
            console.error('❌ Failed to initialize:', message);
          });

          player.addListener('authentication_error', ({ message }) => {
            console.error('❌ Auth error:', message);
          });

          player.addListener('account_error', ({ message }) => {
            console.error('❌ Account error:', message);
          });

          const connectPlayer = () => {
            player.connect().then((success) => {
              if (success) {
                console.log(
                  `🎵 Hello ${userInfo.name}, Spotify Player connected.`
                );
              } else {
                console.error(
                  '❌ Spotify player failed to connect. Retrying in 3 seconds...'
                );
                setTimeout(connectPlayer, 3000);
              }
            });
          };

          connectPlayer();
          setPlayer(player);
        };
      })
      .catch((error) => {
        console.error('❌ Spotify SDK failed to load completely:', error);
      });

    return () => {
      if (player) {
        console.log('🛑 Disconnecting Spotify Player...');
        player.disconnect();
      }
    };
  }, [accessToken]);

  return { player, deviceId };
};
