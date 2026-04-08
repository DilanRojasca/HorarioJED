import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PanelAdminCursos from './pages/panel_admin_cursos_conectado/PanelAdminCursos';
import PanelAdminEstudiantes from './pages/panel_admin_lista_estudiantes_conectado/PanelAdminEstudiantes';

// Protected Route for Admin
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Protected Route for Users
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User protected routes */}
        <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
        
        {/* Admin protected routes */}
        <Route path="/admin/cursos" element={<AdminRoute><PanelAdminCursos /></AdminRoute>} />
        <Route path="/admin/estudiantes" element={<AdminRoute><PanelAdminEstudiantes /></AdminRoute>} />
        
        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-primary font-bold text-2xl">404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
