import fetcher from '@/lib/fetcher';
import { LikedResponse, Playlist } from '@/types/playlist.type';

export interface PlaylistDBResponse {
  playlists: Playlist[];
  pagination: { lastCursor: number | null };
  message: { code: number; text: string };
}
// 배포
// export const fetchPlaylistDB = async () => {
//   const response = await fetch('https://api.plify.store/playlists', {
//     method: 'GET',
//   });

//   if (!response.ok) {
//     throw new Error(`플레이리스트 API 호출 실패: ${response.status}`);
//   }

//   return response.json();
// };

export const fetchPlaylistDB = async () => {
  const response = await fetch('https://localhost:4000/playlists', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`플레이리스트 API 호출 실패: ${response.status}`);
  }

  return response.json();
};

export const fetchPlaylistDetail = async (
  accessToken: string,
  playlistId: string
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Spotify playlist detail. Status: ${response.status}`
    );
  }
  const data = await response.json();
  return data;
};

export const fetchAllPlaylistDetails = async (
  accessToken: string
): Promise<Playlist[]> => {
  const storedData = await fetchPlaylistDB();

  const { playlists } = storedData;

  const enrichedPlaylists = await Promise.all(
    playlists.map(async (playlist: Playlist) => {
      try {
        const spotifyDetail = await fetchPlaylistDetail(
          accessToken,
          playlist.playlistId
        );

        return {
          ...playlist,
          ...spotifyDetail,
        };
      } catch (error) {
        console.error('Spotify API 호출 중 오류 발생:', error);
        return {
          ...playlist,
          image: null,
          name: 'Unknown Playlist',
          spotifyDetail: null,
        };
      }
    })
  );

  return enrichedPlaylists;
};

// 좋아요 토글
export const toggledLiked = async (postId: number): Promise<LikedResponse> => {
  const response = await fetcher<LikedResponse>({
    url: `/playlists/${postId}/like`,
    method: 'POST',
  });
  return response.data;
};

// 좋아요 상태 조회
export const fetchLikedStatus = async (
  postId: number
): Promise<LikedResponse> => {
  const response = await fetcher<LikedResponse>({
    url: `/playlists/${postId}/like`,
    method: 'GET',
  });
  return response.data;
};

export interface AddPlaylistResponse {
  message: {
    code: number;
    text: string;
  };
  playlists: {
    id: number;
  };
}

export const addPlaylist = async (
  userId: number,
  playlistUrl: string
): Promise<AddPlaylistResponse> => {
  const response = await fetcher<AddPlaylistResponse>({
    url: `/playlists`,
    method: 'POST',
    data: { userId, spotifyPlaylistUrl: playlistUrl },
  });

  return response.data;
};

export const deletePlaylist = async (userId: number, postId: number) => {
  return fetcher({
    url: `/playlists/${postId}`,
    method: 'DELETE',
    data: { userId }, // ✅ userId 포함
  });
};

export interface addCommentResponse {
  message: {
    code: number;
    text: string;
  };
  commentId?: number;
}

export const addComment = async (
  userId: number,
  postId: number,
  content: string
): Promise<addCommentResponse> => {
  const response = await fetcher<addCommentResponse>({
    url: `/playlists/${postId}/comments`,
    method: 'POST',
    data: { userId, content },
  });
  return response.data;
};

export interface getCommentResponse {
  comments: {
    commentId: number;
    userId: number;
    userNickname: string;
    userProfileUrl: string;
    content: string;
    likeCount: number;
    isLiked: boolean;
    createdAt: string;
  }[];
}

export const getComments = async (
  postId: number,
  userId: number
): Promise<getCommentResponse> => {
  const response = await fetcher<getCommentResponse>({
    url: `/playlists/${postId}/comments${userId ? `?userId=${userId}` : ''}`,
    method: 'GET',
  });
  console.log('댓글 데이터', response.data);
  return response.data;
};

export interface updateCommentResponse {
  message: {
    code: number;
    text: string;
  };
  comment: {
    commentId: number;
    content: string;
    updatedAt: string;
  };
}

export const updateComment = async (
  userId: number,
  postId: number,
  commentId: number,
  content: string
): Promise<updateCommentResponse> => {
  const response = await fetcher<updateCommentResponse>({
    url: `/playlists/${postId}/comments/${commentId}`,
    method: 'PUT',
    data: { userId, content },
  });
  return response.data;
};

export interface deleteCommentResponse {
  message: {
    code: number;
    text: string;
  };
}

export const deleteComment = async (
  userId: number,
  postId: number,
  commentId: number
): Promise<deleteCommentResponse> => {
  const response = await fetcher<deleteCommentResponse>({
    url: `/playlists/${postId}/comments/${commentId}`,
    method: 'DELETE',
    data: { userId },
  });

  return response.data;
};

export interface toggleCommentLikeResponse {
  message: {
    code: number;
    text: string;
  };
  isLiked: boolean;
  likeCount: number;
}

export const toggleCommentLike = async (
  userId: number,
  postId: number,
  commentId: number
): Promise<toggleCommentLikeResponse> => {
  const response = await fetcher<toggleCommentLikeResponse>({
    url: `/playlists/${postId}/comments/${commentId}/like`,
    method: 'POST',
    data: { userId },
  });

  return response.data;
};
