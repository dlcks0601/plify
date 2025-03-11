import useAuthStore from '@/store/authStore';
import axios from 'axios';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // ✅ 경고 메시지 띄우기
      alert(
        'Plify는 안전한 로그인을 위해 한 시간마다 다시 로그인이 필요합니다.'
      );

      // ✅ 토큰 초기화 (로그아웃 처리)
      useAuthStore.setState({ accessToken: '' });

      // ✅ 메인 페이지로 이동
      window.location.href = '/';

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
