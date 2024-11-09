import { useState, useEffect, type FormEvent } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { videoService, type Video } from '../services/videoService';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar vídeos ao abrir o painel
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Carregando vídeos...');
      loadVideos();
    }
  }, [isOpen]);

  const loadVideos = async () => {
    try {
      console.log('📥 Iniciando busca de vídeos...');
      const fetchedVideos = await videoService.getVideos();
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
        console.error('❌ Erro ao adicionar vídeo:', error);
        alert('Erro ao adicionar vídeo. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveVideo = async (id: string) => {
    try {
      console.log('🗑️ Removendo vídeo:', id);
      await videoService.removeVideo(id);
      console.log('✅ Vídeo removido com sucesso');
      await loadVideos();
    } catch (error) {
      console.error('❌ Erro ao remover vídeo:', error);
      alert('Erro ao remover vídeo. Tente novamente.');
    }
  };

  return (
    <>
      {/* Admin Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Admin Panel */}
      {isOpen && (
        <div className="fixed right-4 top-36 z-50 w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700">
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
            <h3 className="text-white font-semibold mb-4">URLs Adicionadas</h3>
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-gray-800 p-3 rounded-lg group hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 break-all">
                        {video.src}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {video.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        Adicionado em: {new Date(video.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(video.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remover vídeo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhum vídeo adicionado ainda
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}