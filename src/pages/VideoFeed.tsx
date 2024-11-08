import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import VideoPlayer from '../components/VideoPlayer';
import { videoService, type Video } from '../services/videoService';

interface VideoContainerProps {
  video: Video;
  onInView: () => void;
}

function VideoContainer({ video, onInView }: VideoContainerProps) {
  const { ref, inView } = useInView({
    threshold: 0.7,
    onChange: (inView) => {
      if (inView) {
        onInView();
      }
    }
  });

  return (
    <div 
      ref={ref}
      className="h-screen w-full snap-start snap-always"
    >
      <VideoPlayer
        src={video.src}
        isVisible={inView}
      />
    </div>
  );
}

export default function VideoFeed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando vídeos do banco...');
      const fetchedVideos = await videoService.getVideos();
      console.log('✅ Vídeos carregados:', fetchedVideos);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('❌ Erro ao carregar vídeos:', error);
      setError('Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Carregando vídeos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Nenhum vídeo disponível</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {videos.map((video) => (
        <VideoContainer
          key={video.id}
          video={video}
          onInView={() => console.log('Video em view:', video.src)}
        />
      ))}
    </div>
  );
}