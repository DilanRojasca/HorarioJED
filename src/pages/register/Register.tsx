import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  IdCard, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Globe, 
  Users, 
  HelpCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterFormData {
  fullName: string;
  cedula: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    cedula: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempt:', formData);
  };

  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Programas Académicos Acreditados"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Oportunidades de Intercambio Internacional"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Apoyo Estudiantil Personalizado"
    }
  ];

  const inputStyles = "w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50/50";
  const iconStyles = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-display selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">U</div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary leading-tight">Luis Amigó</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Universidad Católica</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Guía de Admisión</a>
          <button className="flex items-center space-x-2 bg-secondary/10 text-secondary border border-secondary/20 px-5 py-2 rounded-lg font-bold hover:bg-secondary hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm">
            <span>Ayuda</span>
            <HelpCircle className="w-4 h-4" />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 pt-28">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]"
        >
          {/* Left Panel */}
          <div className="w-full md:w-5/12 bg-primary text-white p-10 flex flex-col justify-between relative overflow-hidden" 
               style={{ background: 'linear-gradient(135deg, #00849a 0%, #006b7d 100%)' }}>
            <div className="relative z-10">
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-extrabold leading-tight"
                >
                  Comienza Tu<br />Camino Hoy
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-lg leading-relaxed max-w-sm"
                >
                  Únete a una comunidad dedicada a la excelencia y los valores. Regístrate para acceder a nuestra plataforma académica y completar tu proceso de inscripción.
                </motion.p>
              </div>

              <div className="space-y-4 mt-12">
                {benefits.map((benefit, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center space-x-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-white/20">
                      {benefit.icon}
                    </div>
                    <span className="font-semibold text-white/90 group-hover:text-white transition-colors">{benefit.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
              <p className="italic text-white/70 text-sm">
                "Transforma tu futuro con Luis Amigó."
              </p>
            </div>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="animate-fade-in">
              <div className="w-12 h-1 bg-secondary mb-4 rounded-full"></div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Crear Cuenta de Estudiante</h2>
              <p className="text-slate-500 mb-8 font-medium">Por favor, completa tus datos personales para comenzar.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                  <div className="relative">
                    <User className={iconStyles} size={20} />
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Ingresa tu nombre completo" 
                      className={inputStyles} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cedula</label>
                    <div className="relative">
                      <IdCard className={iconStyles} size={20} />
                      <input 
                        type="text" 
                        name="cedula"
                        placeholder="CC" 
                        className={inputStyles} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className={iconStyles} size={20} />
                      <input 
                        type="email" 
                        name="email"
                        placeholder="name@example.com" 
                        className={inputStyles} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className={iconStyles} size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      placeholder="Crea una contraseña segura" 
                      className={inputStyles} 
                      onChange={handleChange}
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
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Mín. 8 caracteres con al menos un número y un carácter especial.</p>
                </div>

                <button type="submit" className="w-full py-4 rounded-lg bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] mt-4 flex items-center justify-center group overflow-hidden relative">
                  <span className="relative z-10">Completar Registro</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </form>

              <div className="mt-8 text-center sm:text-left">
                <p className="text-slate-500 font-medium">
                  ¿Ya tienes una cuenta? {' '}
                  <a href="/login" className="text-secondary font-bold hover:underline underline-offset-4 decoration-2">
                    Iniciar Sesión
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-slate-400 text-xs">
        <p className="mb-4">© 2024 Universidad Católica Luis Amigó. Todos los derechos reservados.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
          <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
          <a href="#" className="hover:text-primary transition-colors">Contactar Soporte</a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
