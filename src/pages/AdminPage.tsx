import type React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { videoService, type Video } from '../services/videoService';

export default function AdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const fetchedVideos = await videoService.getVideos('p0');
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      try {
        await videoService.addVideo(videoUrl);
        setVideoUrl('');
        await loadVideos();
      } catch (error) {
        console.error('Erro ao adicionar vídeo:', error);
        alert('Erro ao adicionar vídeo. Tente novamente.');
      }
    }
  };

  const handleRemoveVideo = async (id: string) => {
    try {
      await videoService.removeVideo(id);
      await loadVideos();
    } catch (error) {
      console.error('Erro ao remover vídeo:', error);
      alert('Erro ao remover vídeo. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Video Management</h1>
        </div>

        {/* Add Video Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Video</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">
                HLS Video URL
              </label>
              <input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter HLS video URL..."
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Video
            </button>
          </form>
        </div>

        {/* Video List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Video List</h2>
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <span className="truncate flex-1 mr-4">{video.src}</span>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => handleRemoveVideo(video.id)}
                  className="p-2 text-red-400 hover:bg-gray-600 rounded-full transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {videos.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No videos added yet. Add your first video above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}