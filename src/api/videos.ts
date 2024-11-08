const API_BASE_URL = 'http://localhost:3001/api';

export const videosApi = {
  async getVideos(userId?: string) {
    const url = userId 
      ? `/api/videos?userId=${userId}`
      : '/api/videos';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar vídeos');
    return response.json();
  },

  async addVideo(src: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ src }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro ao adicionar vídeo:', response.status, errorData);
        throw new Error(`Erro ao adicionar vídeo: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ Erro na requisição de adição:', error);
      throw new Error('Erro ao adicionar vídeo');
    }
  },

  async removeVideo(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro ao remover vídeo:', response.status, errorData);
        throw new Error(`Erro ao remover vídeo: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro na requisição de remoção:', error);
      throw new Error('Erro ao remover vídeo');
    }
  },
};
