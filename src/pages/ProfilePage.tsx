import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { videoService, type Video } from '../services/videoService';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserVideos = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userVideos = await videoService.getVideos(user.id);
      setVideos(userVideos);
    } catch (error) {
      console.error('Erro ao carregar vídeos do usuário:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUserVideos();
  }, [user, navigate, loadUserVideos]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Voltar
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mb-12">
          <img
            src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 border-4 border-purple-600"
          />
          <h1 className="text-2xl font-bold mb-2">
            {user.username || user.email.split('@')[0]}
          </h1>
          {user.bio && (
            <p className="text-gray-400 text-center max-w-md">
              {user.bio}
            </p>
          )}
        </div>

        {/* Videos Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Meus Vídeos</h2>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group"
                >
                  {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                  <video
                    src={video.src}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm">{video.title || 'Sem título'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Nenhum vídeo publicado ainda
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
