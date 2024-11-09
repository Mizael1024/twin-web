import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import VideoPlayer from '../components/VideoPlayer';
import { videoService, type Video } from '../services/videoService';
import Hls from 'hls.js';

interface VideoContainerProps {
  video: Video;
  onInView: () => void;
  isNext?: boolean;
}

function VideoContainer({ video, onInView, isNext = false }: VideoContainerProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    initialInView: true,
    onChange: (inView) => {
      if (inView) {
        onInView();
      }
    }
  });

  return (
    <div 
      ref={ref}
      className="h-screen w-full snap-start snap-always relative bg-black"
    >
      <VideoPlayer
        src={video.src}
        isVisible={inView || isNext}
      />
    </div>
  );
}

export default function VideoFeed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Otimizar o preload do próximo vídeo
  useEffect(() => {
    if (currentIndex < videos.length - 1) {
      const nextVideo = videos[currentIndex + 1];
      const preloadVideo = document.createElement('video');
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
        });
        hls.loadSource(nextVideo.src);
        hls.attachMedia(preloadVideo);
        
        // Limpar recursos quando não for mais necessário
        return () => {
          hls.destroy();
        };
      }
    }
  }, [currentIndex, videos]);

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
      {videos.map((video, index) => (
        <VideoContainer
          key={video.id}
          video={video}
          onInView={() => setCurrentIndex(index)}
          isNext={index === currentIndex + 1}
        />
      ))}
    </div>
  );
}