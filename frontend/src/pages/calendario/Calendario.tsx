import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Clock, MapPin, BookOpen,
  X, Building2, Layers, DoorOpen, Info, Loader2, AlertCircle,
  CalendarDays,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ubicacion {
  bloque: string | null; piso: string | null;
  aula: string | null; descripcion: string | null;
}
interface Clase {
  id: string; materia: string; codigo: string | null;
  creditos: number | null; profesor: string | null;
  salon: string | null; ubicacion: Ubicacion;
  hora_inicio: string; hora_fin: string; semestre: string;
}
interface DiaData { dia: string; clases: Clase[]; huecos: unknown[]; }

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL as string;
const HOUR_HEIGHT = 64; // px per hour
const START_HOUR = 7;
const END_HOUR = 20;
const TOTAL_PX = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

const JS_TO_DIA: Record<number, string> = {
  0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles',
  4: 'jueves', 5: 'viernes', 6: 'sabado',
};
const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const PALETA = [
  { solid: 'bg-blue-500',    light: 'bg-blue-50 text-blue-800 border-blue-200',    dot: 'bg-blue-400' },
  { solid: 'bg-violet-500',  light: 'bg-violet-50 text-violet-800 border-violet-200', dot: 'bg-violet-400' },
  { solid: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-400' },
  { solid: 'bg-amber-500',   light: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-400' },
  { solid: 'bg-rose-500',    light: 'bg-rose-50 text-rose-800 border-rose-200',    dot: 'bg-rose-400' },
  { solid: 'bg-cyan-500',    light: 'bg-cyan-50 text-cyan-800 border-cyan-200',    dot: 'bg-cyan-400' },
];
function color(id: string) {
  let s = 0; for (const c of id) s += c.charCodeAt(0);
  return PALETA[s % PALETA.length];
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function topPx(t: string) { return (toMin(t) - START_HOUR * 60) / 60 * HOUR_HEIGHT; }
function hPx(s: string, e: string) { return (toMin(e) - toMin(s)) / 60 * HOUR_HEIGHT; }

// ─── Date helpers ─────────────────────────────────────────────────────────────

function weekDates(date: Date): Date[] {
  const d = new Date(date);
  const wd = d.getDay();
  d.setDate(d.getDate() + (wd === 0 ? -6 : 1 - wd));
  return Array.from({ length: 6 }, (_, i) => {
    const dd = new Date(d); dd.setDate(d.getDate() + i); return dd;
  });
}

function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const lead  = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const cells: (Date | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth()    === b.getMonth()
      && a.getDate()     === b.getDate();
}

function clasesForDate(date: Date, data: Record<string, DiaData>): Clase[] {
  return data[JS_TO_DIA[date.getDay()]]?.clases ?? [];
}

// ─── Detail modal (similar al de Dashboard) ───────────────────────────────────

function ClaseModal({ clase, onClose }: { clase: Clase; onClose: () => void }) {
  const ub = clase.ubicacion;
  const estructurada = ub.bloque && ub.aula;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-primary p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X size={18} />
            </button>
            <div className="flex items-center space-x-2 mb-1">
              {clase.codigo && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">{clase.codigo}</span>}
              {clase.creditos && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{clase.creditos} créditos</span>}
            </div>
            <h2 className="text-2xl font-extrabold mt-2">{clase.materia}</h2>
            {clase.profesor && <p className="text-white/80 text-sm mt-1">{clase.profesor}</p>}
            <div className="flex items-center space-x-1 mt-3 text-white/90 text-sm font-bold">
              <Clock size={14} /><span>{clase.hora_inicio} – {clase.hora_fin}</span>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ubicación del Salón</h3>
            {estructurada ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-primary/5 rounded-2xl p-4 flex flex-col items-center text-center border border-primary/10">
                    <div className="bg-primary/10 p-3 rounded-xl mb-2"><Building2 size={22} className="text-primary" /></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bloque</p>
                    <p className="text-3xl font-extrabold text-primary">{ub.bloque}</p>
                  </div>
                  <div className="bg-secondary/5 rounded-2xl p-4 flex flex-col items-center text-center border border-secondary/10">
                    <div className="bg-secondary/10 p-3 rounded-xl mb-2"><Layers size={22} className="text-secondary" /></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Piso</p>
                    <p className="text-3xl font-extrabold text-secondary">{ub.piso}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center text-center border border-emerald-100">
                    <div className="bg-emerald-100 p-3 rounded-xl mb-2"><DoorOpen size={22} className="text-emerald-600" /></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aula</p>
                    <p className="text-3xl font-extrabold text-emerald-600">{ub.aula}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start space-x-3">
                  <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Dirígete al <strong>Bloque {ub.bloque}</strong>, sube al <strong>piso {ub.piso}</strong> y busca el aula <strong>{ub.aula}</strong>.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-5 flex items-center space-x-4 border border-slate-100">
                <div className="bg-slate-200 p-3 rounded-xl"><MapPin size={22} className="text-slate-500" /></div>
                <p className="font-bold text-slate-700">{ub.descripcion ?? 'Sin ubicación definida'}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Semestre {clase.semestre}</span>
              <button onClick={onClose} className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Vista Semana ─────────────────────────────────────────────────────────────

function WeekView({
  current, semanaData, onClaseClick,
}: {
  current: Date;
  semanaData: Record<string, DiaData>;
  onClaseClick: (c: Clase) => void;
}) {
  const days = weekDates(current);
  const today = new Date();
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header días */}
      <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
        <div className="p-3" />
        {days.map((d, i) => {
          const isToday = sameDay(d, today);
          return (
            <div key={i} className={`p-3 text-center border-l border-gray-100 ${isToday ? 'bg-primary/5' : ''}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-primary' : 'text-slate-400'}`}>
                {DIAS_CORTO[d.getDay()]}
              </p>
              <div className={`mx-auto mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold
                ${isToday ? 'bg-primary text-white' : 'text-slate-700'}`}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de tiempo */}
      <div className="overflow-y-auto max-h-[600px]">
        <div className="grid relative" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
          {/* Etiquetas de hora */}
          <div className="relative" style={{ height: TOTAL_PX }}>
            {hours.map(h => (
              <div
                key={h}
                className="absolute right-2 text-[10px] font-bold text-slate-300 -translate-y-2"
                style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
              >
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {days.map((d, colIdx) => {
            const clases = clasesForDate(d, semanaData);
            const isToday = sameDay(d, today);
            return (
              <div
                key={colIdx}
                className={`relative border-l border-gray-100 ${isToday ? 'bg-primary/[0.02]' : ''}`}
                style={{ height: TOTAL_PX }}
              >
                {/* Líneas de hora */}
                {hours.map(h => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
                  />
                ))}

                {/* Clases */}
                {clases.map(clase => {
                  const top = topPx(clase.hora_inicio);
                  const height = hPx(clase.hora_inicio, clase.hora_fin);
                  if (top < 0 || top >= TOTAL_PX) return null;
                  const c = color(clase.id);
                  return (
                    <button
                      key={clase.id}
                      onClick={() => onClaseClick(clase)}
                      className={`absolute left-1 right-1 rounded-xl px-2 py-1.5 text-left overflow-hidden border ${c.light} hover:brightness-95 transition-all shadow-sm`}
                      style={{ top: top + 2, height: Math.max(height - 4, 24) }}
                    >
                      <p className="text-[11px] font-extrabold leading-tight truncate">{clase.materia}</p>
                      {height > 40 && (
                        <p className="text-[10px] opacity-70 mt-0.5 flex items-center gap-0.5">
                          <Clock size={9} />{clase.hora_inicio}–{clase.hora_fin}
                        </p>
                      )}
                      {height > 60 && clase.salon && (
                        <p className="text-[10px] opacity-60 truncate flex items-center gap-0.5 mt-0.5">
                          <MapPin size={9} />{clase.salon}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Vista Mes ────────────────────────────────────────────────────────────────

function MonthView({
  current, semanaData, onClaseClick,
}: {
  current: Date;
  semanaData: Record<string, DiaData>;
  onClaseClick: (c: Clase) => void;
}) {
  const today = new Date();
  const cells = monthGrid(current.getFullYear(), current.getMonth());

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header días semana */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
          <div key={d} className="p-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      {/* Celdas */}
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} className="min-h-[96px] bg-slate-50/50" />;
          const clases = clasesForDate(date, semanaData);
          const isToday = sameDay(date, today);
          const isCurrentMonth = date.getMonth() === current.getMonth();
          return (
            <div
              key={idx}
              className={`min-h-[96px] p-2 ${isToday ? 'bg-primary/5' : ''} ${!isCurrentMonth ? 'opacity-30' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold mb-1
                ${isToday ? 'bg-primary text-white' : 'text-slate-700'}`}>
                {date.getDate()}
              </div>
              <div className="space-y-0.5">
                {clases.slice(0, 3).map(clase => {
                  const c = color(clase.id);
                  return (
                    <button
                      key={clase.id}
                      onClick={() => onClaseClick(clase)}
                      className={`w-full text-left px-1.5 py-0.5 rounded-lg text-[10px] font-bold truncate border ${c.light} hover:brightness-95 transition-all`}
                    >
                      {clase.materia}
                    </button>
                  );
                })}
                {clases.length > 3 && (
                  <p className="text-[10px] text-slate-400 font-bold pl-1">+{clases.length - 3} más</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vista Año ────────────────────────────────────────────────────────────────

function YearView({
  year, semanaData, onMonthClick,
}: {
  year: number;
  semanaData: Record<string, DiaData>;
  onMonthClick: (month: number) => void;
}) {
  const today = new Date();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {MESES.map((mes, mIdx) => {
        const cells = monthGrid(year, mIdx);
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === mIdx;
        return (
          <button
            key={mIdx}
            onClick={() => onMonthClick(mIdx)}
            className={`bg-white rounded-2xl border p-4 text-left hover:border-primary/40 hover:shadow-md transition-all ${isCurrentMonth ? 'border-primary/30 shadow-sm ring-1 ring-primary/20' : 'border-gray-100'}`}
          >
            <p className={`text-sm font-extrabold mb-3 ${isCurrentMonth ? 'text-primary' : 'text-slate-700'}`}>{mes}</p>
            <div className="grid grid-cols-7 gap-0.5">
              {['L','M','X','J','V','S','D'].map(d => (
                <div key={d} className="text-[8px] text-slate-300 text-center font-bold">{d}</div>
              ))}
              {cells.map((date, idx) => {
                if (!date) return <div key={`e-${idx}`} />;
                const clases = clasesForDate(date, semanaData);
                const isToday = sameDay(date, today);
                return (
                  <div key={idx} className="flex items-center justify-center aspect-square">
                    {isToday ? (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[7px] font-black text-white">{date.getDate()}</span>
                      </div>
                    ) : clases.length > 0 ? (
                      <div className={`w-3.5 h-3.5 rounded-full ${color(clases[0].id).dot} opacity-70`} />
                    ) : (
                      <span className="text-[8px] text-slate-300">{date.getDate()}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Vista = 'semana' | 'mes' | 'año';

const Calendario: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  const userName = localStorage.getItem('userName') || 'Estudiante';
  const firstName = userName.split(' ')[0];

  const [vista, setVista] = useState<Vista>('semana');
  const [current, setCurrent] = useState(new Date());
  const [semanaData, setSemanaData] = useState<Record<string, DiaData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClase, setSelectedClase] = useState<Clase | null>(null);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/horario/semana`, { headers });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSemanaData(json.semana);
    } catch {
      setError('No se pudo cargar el horario. Verifica que el servidor esté activo.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Navegación ────────────────────────────────────────────────────────────

  function prev() {
    setCurrent(d => {
      const nd = new Date(d);
      if (vista === 'semana') nd.setDate(nd.getDate() - 7);
      else if (vista === 'mes') nd.setMonth(nd.getMonth() - 1);
      else nd.setFullYear(nd.getFullYear() - 1);
      return nd;
    });
  }
  function next() {
    setCurrent(d => {
      const nd = new Date(d);
      if (vista === 'semana') nd.setDate(nd.getDate() + 7);
      else if (vista === 'mes') nd.setMonth(nd.getMonth() + 1);
      else nd.setFullYear(nd.getFullYear() + 1);
      return nd;
    });
  }
  function goToday() { setCurrent(new Date()); }

  // ── Título del período ────────────────────────────────────────────────────

  function titulo() {
    if (vista === 'semana') {
      const days = weekDates(current);
      const first = days[0]; const last = days[5];
      if (first.getMonth() === last.getMonth())
        return `${first.getDate()} – ${last.getDate()} de ${MESES[first.getMonth()]} ${first.getFullYear()}`;
      return `${first.getDate()} ${MESES[first.getMonth()].slice(0,3)} – ${last.getDate()} ${MESES[last.getMonth()].slice(0,3)} ${last.getFullYear()}`;
    }
    if (vista === 'mes') return `${MESES[current.getMonth()]} ${current.getFullYear()}`;
    return `${current.getFullYear()}`;
  }

  // ── Click en mes desde vista año ──────────────────────────────────────────

  function handleMonthClick(month: number) {
    setCurrent(d => new Date(d.getFullYear(), month, 1));
    setVista('mes');
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-display">

      {selectedClase && (
        <ClaseModal clase={selectedClase} onClose={() => setSelectedClase(null)} />
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-slate-50"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-primary w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg">U</div>
            <div>
              <span className="font-bold text-slate-800 tracking-tight uppercase text-sm hidden sm:block">Portal Estudiantil</span>
              <span className="block text-[10px] text-slate-400 font-medium hidden sm:block">Calendario Académico</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-slate-800 text-sm leading-none">{userName}</p>
            <p className="text-[10px] text-slate-400 font-medium">Ingeniería de Sistemas</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">

        {/* ── Barra de controles ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          {/* Tabs de vista */}
          <div className="flex bg-slate-100 rounded-2xl p-1 gap-1 w-fit">
            {(['semana', 'mes', 'año'] as Vista[]).map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`px-4 py-2 text-sm font-bold rounded-xl capitalize transition-all ${
                  vista === v ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Navegación */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-100 rounded-2xl shadow-sm">
              <button onClick={prev} className="p-2.5 hover:text-primary text-slate-400 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-primary border-x border-gray-100 transition-colors"
              >
                Hoy
              </button>
              <button onClick={next} className="p-2.5 hover:text-primary text-slate-400 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
            <span className="font-bold text-slate-700 text-sm hidden sm:block">{titulo()}</span>
          </div>
        </div>

        {/* Título en móvil */}
        <p className="font-bold text-slate-700 text-sm sm:hidden">{titulo()}</p>

        {/* ── Contenido ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-3">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="font-medium">Cargando tu horario...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-3xl p-10 text-center border border-red-100">
            <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
            <p className="font-bold text-red-700 mb-1">Error de conexión</p>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button onClick={fetchData} className="bg-red-500 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-red-600 transition-colors">
              Reintentar
            </button>
          </div>
        ) : Object.values(semanaData).every(d => d.clases.length === 0) ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sin clases registradas</h2>
            <p className="text-slate-500 text-sm mb-5">
              Carga el horario de demo desde el Dashboard para ver tus clases aquí.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={vista}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {vista === 'semana' && (
                <WeekView current={current} semanaData={semanaData} onClaseClick={setSelectedClase} />
              )}
              {vista === 'mes' && (
                <MonthView current={current} semanaData={semanaData} onClaseClick={setSelectedClase} />
              )}
              {vista === 'año' && (
                <YearView year={current.getFullYear()} semanaData={semanaData} onMonthClick={handleMonthClick} />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Leyenda ── */}
        {!loading && !error && Object.values(semanaData).some(d => d.clases.length > 0) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full">Asignaturas</p>
            {Array.from(
              new Map(
                Object.values(semanaData)
                  .flatMap(d => d.clases)
                  .map(c => [c.id, c])
              ).values()
            ).map(clase => {
              const c = color(clase.id);
              return (
                <div key={clase.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${c.light}`}>
                  <BookOpen size={11} />
                  <span>{clase.materia}</span>
                  {clase.codigo && <span className="opacity-60">· {clase.codigo}</span>}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Calendario;
