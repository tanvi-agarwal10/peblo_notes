import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder for main workspace
const Workspace = () => (
  <div className="min-h-screen flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 neon-text">Peblo Notes AI</h1>
      <p>Workspace is coming soon...</p>
      <button 
        onClick={() => useAuthStore.getState().logout()}
        className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
      >
        Logout
      </button>
    </div>
  </div>
);

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
