// /src/hooks/useSpotifyPlayer.ts

'use client';

import { useEffect, useState } from 'react';
import { transferPlayback } from '@/apis/spotify.api';
import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';
import { getSpotifyPlayer, setSpotifyPlayer } from './SpotifyPlayerSingleton';

export const useSpotifyPlayer = () => {
  // 전역에 저장된 플레이어 인스턴스를 초기값으로 설정합니다.
  const [player, setPlayerState] = useState<Spotify.Player | null>(
    getSpotifyPlayer()
  );
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken, userInfo } = useAuthStore();

  useEffect(() => {
    // accessToken이 없으면 아무것도 하지 않습니다.
    if (!accessToken) return;
    // 이미 플레이어가 존재하면 재생성하지 않습니다.
    if (player) return;
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

    // 플레이어 인스턴스를 상태와 전역 변수에 저장합니다.
    setPlayerState(spotifyPlayer);
    setSpotifyPlayer(spotifyPlayer);

    // cleanup 함수에서는 disconnect를 호출하지 않습니다.
    // (플레이어를 앱 전체에서 유지하려면 cleanup에서 disconnect하지 않고,
    // 로그아웃이나 토큰 변경 시 별도로 관리합니다.)
  }, [accessToken, player, setDeviceId, userInfo.name]);

  return { player, deviceId };
};
