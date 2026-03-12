import React from 'react';
import { 
  Bell, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Download, 
  Calendar, 
  Info,
  BookOpen,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const scheduleItems = [
    {
      time: "08:00 AM",
      title: "Introducción a la IA",
      professor: "Prof. Elena Martínez",
      location: "Auditorio Principal",
      status: "FINALIZADA",
      type: "past"
    },
    {
      time: "10:00 AM",
      title: "Cálculo Integral",
      professor: "Prof. Juan Pérez",
      location: "Bloque 1 - 302",
      status: "SIGUIENTE",
      type: "next"
    },
    {
      time: "02:00 PM",
      title: "Ética y Humanismo",
      professor: "P. Alberto Jaramillo",
      location: "Bloque 4 - 105",
      status: "PENDIENTE",
      type: "upcoming"
    },
    {
      time: "04:00 PM",
      title: "Bases de Datos I",
      professor: "Sata de Sistemas 3",
      location: "",
      status: "PENDIENTE",
      type: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-display">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform hover:scale-110 cursor-pointer">U</div>
            <span className="font-bold text-slate-800 tracking-tight uppercase text-sm">Portal Estudiantil</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="font-bold text-primary border-b-2 border-primary pb-1">Mi Horario</a>
            <a href="#" className="font-medium text-slate-500 hover:text-primary transition-colors">Mis Cursos</a>
            <a href="#" className="font-medium text-slate-500 hover:text-primary transition-colors">Campus</a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-slate-800 text-sm leading-none">Mateo Salazar</p>
              <p className="text-[10px] text-slate-400 font-medium">Ingeniería de Sistemas</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden cursor-pointer hover:border-primary transition-colors">
              <img src="/profile-mateo.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                <Clock size={12} />
                <span>Comienza en 15 minutos</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">¡Hola, Erick!</h1>
              <p className="text-white/80 text-lg font-medium">Tu próxima clase está por comenzar. Ten todo listo.</p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 group hover:bg-white/20 transition-colors">
                  <div className="bg-white/20 p-2 rounded-lg"><BookOpen size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">Asignatura</p>
                    <p className="font-bold">Cálculo Integral</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 group hover:bg-white/20 transition-colors">
                  <div className="bg-white/20 p-2 rounded-lg"><Clock size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">Horario</p>
                    <p className="font-bold">10:00 AM - 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 group hover:bg-white/20 transition-colors">
                  <div className="bg-white/20 p-2 rounded-lg"><MapPin size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">Salón</p>
                    <p className="font-bold">Bloque 1 - 302</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration/Icon Placeholder for Hero */}
            <div className="hidden lg:block absolute right-0 top-0 opacity-20 pointer-events-none -mr-10">
               <div className="w-80 h-80 bg-white rounded-full blur-3xl"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <BookOpen size={200} strokeWidth={1} />
               </div>
            </div>
          </div>
        </motion.section>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Horario de Hoy</h2>
              </div>
              <span className="text-sm font-medium text-slate-400">Lunes, 24 de Mayo</span>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 space-y-1">
                {scheduleItems.map((item, idx) => (
                  <div key={idx} className="relative flex group">
                    {/* Timeline bar */}
                    <div className="w-16 flex flex-col items-center">
                      <div className={`mt-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 
                        ${item.type === 'past' ? 'bg-slate-100 text-slate-400' : 
                          item.type === 'next' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                          'bg-white border-2 border-slate-100 text-slate-300'}`}>
                        {item.type === 'past' ? <CheckCircle2 size={16} /> : 
                         item.type === 'next' ? <PlayCircle size={18} /> : 
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>}
                      </div>
                      {idx !== scheduleItems.length - 1 && (
                        <div className="w-px h-full bg-slate-100 -mt-1 group-hover:bg-primary/20 transition-colors"></div>
                      )}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 pb-10 pl-6">
                      <div className={`p-6 rounded-2xl transition-all duration-300 border
                        ${item.type === 'next' 
                          ? 'bg-white border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20 translate-x-1' 
                          : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50'}`}>
                        
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
                          {item.status && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider
                              ${item.status === 'FINALIZADA' ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        
                        <h3 className={`text-lg font-bold mb-1 ${item.type === 'past' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.professor} {item.location && `• ${item.location}`}
                        </p>

                        {item.type === 'next' && (
                          <button className="mt-4 bg-primary text-white text-xs font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 uppercase tracking-widest">
                            Ver Contenido
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50/80 p-5 border-t border-gray-100 text-center">
                <button className="text-primary text-sm font-bold flex items-center justify-center mx-auto hover:underline underline-offset-4 decoration-2">
                  Ver horario completo de la semana
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Qucik Actions */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="text-secondary">⚡</span>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Accesos Rápidos</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center group hover:border-primary transition-all duration-300 hover:shadow-md">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Download size={22} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 leading-tight">Descargar Horario</p>
                  <p className="text-xs text-slate-400 font-medium">PDF del semestre actual</p>
                </div>
                <ChevronRight className="text-slate-200 group-hover:text-primary transition-colors" />
              </button>

              <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow cursor-pointer relative h-40">
                <img src="/campus-map.png" alt="Map" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin size={16} className="text-secondary" />
                    <p className="font-bold">Mapa del Campus</p>
                  </div>
                  <p className="text-[10px] text-white/70 font-medium">Localiza tus aulas y bloques</p>
                </div>
              </div>

              <button className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center group hover:border-primary transition-all duration-300 hover:shadow-md">
                <div className="bg-secondary/10 p-3 rounded-2xl text-secondary mr-5 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Calendar size={22} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 leading-tight">Calendario Académico</p>
                  <p className="text-xs text-slate-400 font-medium">Fechas clave y exámenes</p>
                </div>
                <ChevronRight className="text-slate-200 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Important Info Card */}
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 border-dashed relative overflow-hidden group">
               <div className="relative z-10">
                <div className="flex items-center space-x-2 text-primary font-bold mb-3">
                  <Info size={18} />
                  <span className="text-sm">Aviso Importante</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                  Las inscripciones para los cursos vacacionales abren el 15 de junio. No olvides revisar los requisitos.
                </p>
                <button className="text-primary text-xs font-bold flex items-center transition-transform hover:translate-x-1">
                  Saber más <ChevronRight size={14} className="ml-1" />
                </button>
               </div>
               <div className="absolute -bottom-6 -right-6 text-primary/10 group-hover:scale-110 transition-transform duration-500">
                <Info size={80} strokeWidth={1} />
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-20 py-12 px-6 border-t border-gray-100 bg-white text-center">
        <p className="text-slate-400 text-xs font-medium mb-6">
          © 2024 Universidad Católica Luis Amigó • Vigilada por el Ministerio de Educación Nacional
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <a href="#" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <Info size={14} />
            <span>Ayuda</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <BookOpen size={14} />
            <span>Términos</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <Bell size={14} />
            <span>Soporte IT</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
