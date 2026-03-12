import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  try {

    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    localStorage.setItem("token", data.token);

    navigate("/dashboard");

  } catch (error) {

    alert("Credenciales incorrectas");

  }

};

  const inputStyles = "w-full pl-12 pr-12 py-3 rounded-lg border border-gray-200 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white";
  const iconStyles = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-display selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">U</div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-800 leading-tight">Universidad Católica Luis Amigó</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-gray-500">¿Necesitas ayuda?</span>
          <a href="#" className="font-semibold text-primary hover:underline underline-offset-4">Centro de Soporte</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Card Header Teal */}
          <div className="bg-primary p-8 text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight mb-1">Portal Estudiantil</h1>
            <p className="text-white/80 text-sm font-medium">Servicios Académicos y Gestión</p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-1 text-left">Iniciar Sesión</h2>
              <p className="text-slate-500 text-sm">Accede a tu cuenta institucional para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Correo Institucional</label>
                <div className="relative">
                  <Mail className={iconStyles} size={20} />
                  <input 
                    type="email" 
                    placeholder="example@amigo.edu.co" 
                    className={inputStyles}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-700">Contraseña</label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">¿Olvidó su contraseña?</a>
                </div>
                <div className="relative">
                  <Lock className={iconStyles} size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className={inputStyles}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} /> }
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-600 font-medium whitespace-nowrap">
                  Recordarme en este dispositivo
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 group"
              >
                <span>Iniciar Sesión</span>
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-600 text-sm">
                ¿Aún no tienes una cuenta? {' '}
                <a href="/register" className="text-secondary font-bold hover:underline">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center bg-white border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4 text-xs font-medium text-slate-500">
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
          <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
          <a href="#" className="hover:text-primary transition-colors">Contáctenos</a>
        </div>
        <p className="text-xs text-slate-400 mb-2">© 2026 Universidad Católica Luis Amigó. Todos los derechos reservados.</p>
        <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={12} className="text-primary" />
          <span>Conexión segura via 256-bit SSL</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;
