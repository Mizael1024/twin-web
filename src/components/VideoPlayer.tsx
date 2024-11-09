import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  isVisible: boolean;
  isFirstVideo?: boolean;
}

export default function VideoPlayer({ src, isVisible, isFirstVideo = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isMuted, setIsMuted] = useState(isFirstVideo);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Hls.isSupported()) {
      initializeHls();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  const initializeHls = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    const hls = new Hls({
      enableWorker: true,
      startLevel: -1,
      autoStartLoad: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      maxBufferSize: 60 * 1000 * 1000,
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 3,
      levelLoadingTimeOut: 10000,
      levelLoadingMaxRetry: 3,
    });

    hlsRef.current = hls;
    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setIsReady(true);
      if (isVisible) {
        setTimeout(() => {
          video.play()
            .catch((error) => {
              console.error('Erro ao reproduzir vídeo:', error);
            });
        }, 100);
      }
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        console.error('Erro fatal HLS:', data);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            initializeHls();
            break;
        }
      }
    });
  }, [src, isVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    if (isVisible) {
      video.play()
        .catch((error) => {
          console.error('Erro ao reproduzir vídeo:', error);
        });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isVisible, isReady]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        loop
        muted={isMuted}
        autoPlay
        preload="auto"
      />
      
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        type="button"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}