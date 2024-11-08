import { Routes, Route, Navigate } from 'react-router-dom';
import VideoFeed from './pages/VideoFeed';
import AdminPage from './pages/AdminPage';
import AuthForm from './components/AuthForm';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="h-screen w-full bg-black">
      <Routes>
        <Route path="/" element={<VideoFeed />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;