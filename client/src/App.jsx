import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import PublicNote from './pages/PublicNote';
import Workspace from './pages/Workspace';

const NotFound = () => (
  <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center text-white">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl text-gray-400 mb-8">Page not found</p>
    <Link to="/" className="px-6 py-3 bg-[#00ffcc] text-black font-bold rounded-lg hover:bg-[#00e6b8] transition">
      Go Home
    </Link>
  </div>
);

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1d24',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shared/:shareId" element={<PublicNote />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
