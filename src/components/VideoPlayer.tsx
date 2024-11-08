import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface VideoPlayerProps {
  src: string;
  isVisible: boolean;
}

export default function VideoPlayer({ src, isVisible }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initializeVideo = async () => {
      try {
        if (Hls.isSupported()) {
          // Limpar instância anterior do HLS se existir
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          hlsRef.current = hls;
          hls.loadSource(src);
          hls.attachMedia(video);

          return new Promise<void>((resolve) => {
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (isVisible) {
                video.play().catch(() => {
                  console.log('Autoplay prevented');
                });
              }
              resolve();
            });
          });
        }

        // Fallback para navegadores que suportam HLS nativamente (Safari)
        video.src = src;
        if (isVisible) {
          await video.play().catch(() => {
            console.log('Autoplay prevented');
          });
        }
      } catch (error) {
        console.error('Error initializing video:', error);
      }
    };

    initializeVideo();

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, isVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibilityChange = async () => {
      try {
        if (isVisible) {
          video.currentTime = 0;
          await video.play().catch(() => {
            console.log('Playback prevented');
          });
        } else {
          video.pause();
        }
      } catch (error) {
        console.error('Error handling visibility change:', error);
      }
    };

    handleVisibilityChange();
  }, [isVisible]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        loop
        muted={isMuted}
      />
      
      {/* User Profile Button */}
      <button
        type="button"
        onClick={() => navigate(user ? '/profile' : '/auth')}
        className="absolute top-6 left-6 z-10 bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all transform hover:scale-110"
      >
        <User className="w-7 h-7 text-white" />
      </button>

      {/* Volume Control */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-6 right-6 z-10 bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all transform hover:scale-110"
      >
        {isMuted ? (
          <VolumeX className="w-7 h-7 text-white" />
        ) : (
          <Volume2 className="w-7 h-7 text-white" />
        )}
      </button>

      <button
        type="button"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl w-4/5 max-w-md text-lg"
        onClick={() => navigate('/auth')}
      >
        Unlock Now
      </button>
    </div>
  );
}