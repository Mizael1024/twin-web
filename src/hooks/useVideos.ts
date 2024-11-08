import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Video {
  id: number;
  src: string;
}

interface VideoStore {
  videos: Video[];
  addVideo: (video: Omit<Video, 'id'>) => void;
  removeVideo: (id: number) => void;
}

export const useVideos = create<VideoStore>()(
  persist(
    (set) => ({
      videos: [
        {
          id: 1,
          src: 'https://stream.mux.com/taKxGayqNLR00BYFdxNZIxWTaeeIJdmW01E00vTAO71fNU.m3u8'
        },
        {
          id: 2,
          src: 'https://stream.mux.com/KyhEnbTM00IvufTxoWQ9OZNeWoPW00inKBKIGhsPnMI8w.m3u8'
        },
        {
          id: 3,
          src: 'https://stream.mux.com/fNjgEcMBKK6SwS7Deq3LNDRZ01ehVk702HE2WBXmBce3I.m3u8'
        },
        {
          id: 4,
          src: 'https://stream.mux.com/gwC4uy4klFHKEuNs8w5v9m005WzLDTucnTvwP8KRnnu00.m3u8'
        }
      ],
      addVideo: (video) =>
        set((state) => ({
          videos: [...state.videos, { ...video, id: Date.now() }],
        })),
      removeVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        })),
    }),
    {
      name: 'videos-storage',
    }
  )
);