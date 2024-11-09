import { videosApi } from '../api/videos';

export interface Video {
  id: string;
  src: string;
  created_at: Date;
  title?: string;
}

export const videoService = {
  async getVideos(): Promise<Video[]> {
    try {
      console.log('📊 [VideoService] Buscando vídeos...');
      const videos = await videosApi.getVideos();
      console.log('✅ [VideoService] Vídeos encontrados:', videos.length);
      return videos;
    } catch (error) {
      console.error('❌ [VideoService] Erro ao buscar vídeos:', error);
      throw error;
    }
  },

  async addVideo(src: string): Promise<Video> {
    try {
      console.log('➕ [VideoService] Adicionando vídeo:', src);
      const video = await videosApi.addVideo(src);
      console.log('✅ [VideoService] Vídeo adicionado:', video);
      return video;
    } catch (error) {
      console.error('❌ [VideoService] Erro ao adicionar vídeo:', error);
      throw error;
    }
  },

  async removeVideo(id: string): Promise<void> {
    try {
      console.log('🗑️ [VideoService] Removendo vídeo:', id);
      await videosApi.removeVideo(id);
      console.log('✅ [VideoService] Vídeo removido');
    } catch (error) {
      console.error('❌ [VideoService] Erro ao remover vídeo:', error);
      throw error;
    }
  },
};
