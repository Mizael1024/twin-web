import { Routes, Route, Navigate } from 'react-router-dom';
import VideoFeed from './pages/VideoFeed';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="h-screen w-full bg-black">
      <Routes>
        <Route path="/" element={<VideoFeed />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;