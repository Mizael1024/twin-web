import { useState, useEffect, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { videoService, type Video } from '../services/videoService';
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Carregar vídeos ao abrir o painel
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Carregando vídeos...');
      loadVideos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadVideos = async () => {
    if (!user) {
      console.log('⚠️ Usuário não autenticado');
      return;
    }

    try {
      console.log('📥 Iniciando busca de vídeos...');
      const fetchedVideos = await videoService.getVideos(user.id);
      console.log('✅ Vídeos carregados:', fetchedVideos);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('❌ Erro ao carregar vídeos:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      setIsLoading(true);
      try {
        console.log('📤 Tentando adicionar vídeo:', videoUrl);
        const addedVideo = await videoService.addVideo(videoUrl);
        console.log('✅ Vídeo adicionado com sucesso:', addedVideo);
        setVideoUrl('');
        await loadVideos();
      } catch (error) {
        console.error('❌ Erro detalhado ao adicionar vídeo:', error);
        if (error instanceof Error) {
          console.error('Mensagem de erro:', error.message);
          console.error('Stack trace:', error.stack);
        }
        alert(`Erro ao adicionar vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveVideo = async (id: string) => {
    if (!user) {
      console.log('⚠️ Tentativa de remoção sem autenticação');
      alert('Você precisa estar logado para remover vídeos');
      return;
    }

    try {
      console.log('🗑️ Tentando remover vídeo:', id);
      await videoService.removeVideo(id);
      console.log('✅ Vídeo removido com sucesso');
      await loadVideos();
    } catch (error) {
      console.error('❌ Erro ao remover vídeo:', error);
      if (error instanceof Error) {
        console.error('Mensagem de erro:', error.message);
        console.error('Stack trace:', error.stack);
      }
      alert('Erro ao remover vídeo. Tente novamente.');
    }
  };

  return (
    <>
      {/* Admin Toggle Button */}
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Admin Panel */}
      {isOpen && (
        <div className="fixed right-4 top-36 z-50 w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Painel do Administrador</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Digite a URL do vídeo HLS..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Vídeo'}
            </button>
          </form>

          <div className="p-4 max-h-96 overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">Lista de Vídeos</h3>
            <div className="space-y-2">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <span className="text-white text-sm truncate flex-1 mr-2">
                    {video.src}
                  </span>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    onClick={() => handleRemoveVideo(video.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}