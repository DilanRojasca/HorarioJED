import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Bell, Clock, MapPin, ChevronRight, Download, Calendar,
  Info, BookOpen, X, Building2, Layers, DoorOpen, Coffee,
  AlertCircle, Loader2, Sparkles, LogOut, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ubicacion {
  bloque: string | null;
  piso: string | null;
  aula: string | null;
  descripcion: string | null;
}

interface Clase {
  id: string;
  materia: string;
  codigo: string | null;
  creditos: number | null;
  profesor: string | null;
  salon: string | null;
  ubicacion: Ubicacion;
  hora_inicio: string;
  hora_fin: string;
  semestre: string;
}

interface Hueco {
  hora_inicio: string;
  hora_fin: string;
  duracion_minutos: number;
  sugerencias: string[];
}

interface DiaData {
  dia: string;
  clases: Clase[];
  huecos: Hueco[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = 'http://localhost:8000';

const DIAS_ORDEN = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DIAS_DISPLAY: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
};
const DIAS_JS: Record<number, string> = {
  0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles',
  4: 'jueves', 5: 'viernes', 6: 'sabado',
};

const COLORES_MATERIA = [
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-violet-50 border-violet-200 text-violet-700',
  'bg-emerald-50 border-emerald-200 text-emerald-700',
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-rose-50 border-rose-200 text-rose-700',
  'bg-cyan-50 border-cyan-200 text-cyan-700',
];

function colorMateria(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return COLORES_MATERIA[sum % COLORES_MATERIA.length];
}

// ─── Modal de detalle de clase (RF04) ─────────────────────────────────────────

function ClaseModal({ clase, onClose }: { clase: Clase; onClose: () => void }) {
  const { ubicacion } = clase;
  const tieneUbicacionEstructurada = ubicacion.bloque && ubicacion.aula;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header del modal */}
          <div className="bg-primary p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {clase.codigo ?? 'Sin código'}
              </span>
              {clase.creditos && (
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  {clase.creditos} créditos
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mt-2">{clase.materia}</h2>
            {clase.profesor && (
              <p className="text-white/80 text-sm font-medium mt-1">{clase.profesor}</p>
            )}
            <div className="flex items-center space-x-1 mt-3 text-white/90 text-sm font-bold">
              <Clock size={14} />
              <span>{clase.hora_inicio} – {clase.hora_fin}</span>
            </div>
          </div>

          {/* Cuerpo del modal — RF04: ubicación detallada */}
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Ubicación del Salón
            </h3>

            {tieneUbicacionEstructurada ? (
              <div className="grid grid-cols-3 gap-3">
                {/* Bloque */}
                <div className="bg-primary/5 rounded-2xl p-4 flex flex-col items-center text-center border border-primary/10">
                  <div className="bg-primary/10 p-3 rounded-xl mb-2">
                    <Building2 size={22} className="text-primary" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bloque</p>
                  <p className="text-3xl font-extrabold text-primary">{ubicacion.bloque}</p>
                </div>
                {/* Piso */}
                <div className="bg-secondary/5 rounded-2xl p-4 flex flex-col items-center text-center border border-secondary/10">
                  <div className="bg-secondary/10 p-3 rounded-xl mb-2">
                    <Layers size={22} className="text-secondary" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Piso</p>
                  <p className="text-3xl font-extrabold text-secondary">{ubicacion.piso}</p>
                </div>
                {/* Aula */}
                <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center text-center border border-emerald-100">
                  <div className="bg-emerald-100 p-3 rounded-xl mb-2">
                    <DoorOpen size={22} className="text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aula</p>
                  <p className="text-3xl font-extrabold text-emerald-600">{ubicacion.aula}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-5 flex items-center space-x-4 border border-slate-100">
                <div className="bg-slate-200 p-3 rounded-xl">
                  <MapPin size={22} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">{ubicacion.descripcion ?? 'Sin ubicación definida'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Consulta con tu profesor la ubicación exacta</p>
                </div>
              </div>
            )}

            {/* Indicaciones de cómo llegar */}
            {tieneUbicacionEstructurada && (
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start space-x-3">
                <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Dirígete al <strong>Bloque {ubicacion.bloque}</strong>, sube al <strong>piso {ubicacion.piso}</strong> y busca el aula <strong>{ubicacion.aula}</strong>.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Semestre {clase.semestre}</span>
              <button
                onClick={onClose}
                className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Tarjeta de Hueco (RF05) ──────────────────────────────────────────────────

function HuecoCard({ hueco }: { hueco: Hueco }) {
  const [expandido, setExpandido] = useState(false);
  const horas = Math.floor(hueco.duracion_minutos / 60);
  const mins = hueco.duracion_minutos % 60;
  const duracionLabel = horas > 0
    ? `${horas}h${mins > 0 ? ` ${mins}min` : ''}`
    : `${mins} min`;

  return (
    <div className="relative flex group">
      <div className="w-16 flex flex-col items-center">
        <div className="mt-2 flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-center z-10">
          <Coffee size={14} className="text-amber-400" />
        </div>
        <div className="w-px flex-1 bg-dashed border-l-2 border-dashed border-amber-200 -mt-1" />
      </div>

      <div className="flex-1 pb-6 pl-6">
        <button
          onClick={() => setExpandido(v => !v)}
          className="w-full text-left p-4 rounded-2xl bg-amber-50 border border-amber-100 border-dashed hover:border-amber-300 transition-all group/hueco"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Hueco libre — {duracionLabel}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-amber-500">
              <span className="text-xs font-medium">{hueco.hora_inicio} – {hueco.hora_fin}</span>
              <ChevronRight
                size={14}
                className={`transition-transform ${expandido ? 'rotate-90' : ''}`}
              />
            </div>
          </div>

          <AnimatePresence>
            {expandido && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-amber-200 space-y-1.5">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">
                    Sugerencias para este tiempo libre
                  </p>
                  {hueco.sugerencias.map((s, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-amber-800 font-medium">
                      <span className="text-base leading-none">{s.split(' ')[0]}</span>
                      <span>{s.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

// ─── Tarjeta de Clase ─────────────────────────────────────────────────────────

function ClaseCard({
  clase, esProxima, esPasada, onVerDetalle
}: {
  clase: Clase;
  esProxima: boolean;
  esPasada: boolean;
  onVerDetalle: (c: Clase) => void;
}) {
  const color = colorMateria(clase.id);

  return (
    <div className="relative flex group">
      <div className="w-16 flex flex-col items-center">
        <div className={`mt-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10
          ${esPasada ? 'bg-slate-100 text-slate-400'
            : esProxima ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'bg-white border-2 border-slate-100 text-slate-300'}`}
        >
          {esPasada
            ? <span className="text-[10px] font-black">✓</span>
            : esProxima
              ? <span className="text-[10px] font-black">▶</span>
              : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          }
        </div>
        <div className="w-px flex-1 bg-slate-100 -mt-1 group-hover:bg-primary/20 transition-colors" />
      </div>

      <div className="flex-1 pb-6 pl-6">
        <motion.div
          layout
          className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer
            ${esProxima
              ? 'bg-white border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20 translate-x-1'
              : esPasada
                ? 'bg-slate-50/60 border-slate-100 opacity-60 hover:opacity-80'
                : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50'
            }`}
          onClick={() => onVerDetalle(clase)}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {clase.hora_inicio} – {clase.hora_fin}
            </span>
            {esProxima && (
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full tracking-wider uppercase">
                Siguiente
              </span>
            )}
            {esPasada && (
              <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full tracking-wider uppercase">
                Finalizada
              </span>
            )}
          </div>

          <h3 className={`text-lg font-bold mb-1 ${esPasada ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {clase.materia}
          </h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {clase.profesor && (
              <span className="text-xs text-slate-500 font-medium">
                👤 {clase.profesor}
              </span>
            )}
            {clase.salon && (
              <button
                onClick={e => { e.stopPropagation(); onVerDetalle(clase); }}
                className="flex items-center space-x-1 text-xs text-primary font-bold hover:underline"
              >
                <MapPin size={11} />
                <span>{clase.salon}</span>
              </button>
            )}
          </div>

          {clase.codigo && (
            <div className={`inline-flex items-center mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
              {clase.codigo}
            </div>
          )}

          {esProxima && (
            <button
              onClick={e => { e.stopPropagation(); onVerDetalle(clase); }}
              className="mt-4 bg-primary text-white text-xs font-bold py-2 px-5 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 uppercase tracking-widest flex items-center space-x-1"
            >
              <MapPin size={12} />
              <span>Ver ubicación</span>
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Timeline de un día ───────────────────────────────────────────────────────

function TimelineDay({ diaData, onVerDetalle }: { diaData: DiaData; onVerDetalle: (c: Clase) => void }) {
  const ahora = new Date();
  const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  const diaHoy = DIAS_JS[ahora.getDay()];
  const esHoy = diaData.dia === diaHoy;

  // Intercalar clases y huecos ordenados por hora
  type Item = { tipo: 'clase'; data: Clase } | { tipo: 'hueco'; data: Hueco };
  const items: Item[] = [];

  const clasesSorted = [...diaData.clases].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  const huecosSorted = [...diaData.huecos].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  clasesSorted.forEach(c => items.push({ tipo: 'clase', data: c }));
  huecosSorted.forEach(h => items.push({ tipo: 'hueco', data: h }));
  items.sort((a, b) => {
    const ta = a.tipo === 'clase' ? a.data.hora_inicio : a.data.hora_inicio;
    const tb = b.tipo === 'clase' ? b.data.hora_inicio : b.data.hora_inicio;
    return ta.localeCompare(tb);
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Calendar size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-bold text-slate-500">No hay clases este día</p>
        <p className="text-sm mt-1">Disfruta tu tiempo libre 🎉</p>
      </div>
    );
  }

  // Determinar cuál clase es la "próxima" (solo si es hoy)
  let proximaId: string | null = null;
  if (esHoy) {
    const proxima = clasesSorted.find(c => c.hora_inicio > horaActual);
    if (proxima) proximaId = proxima.id;
  }

  return (
    <div className="p-6 space-y-0">
      {items.map((item, idx) => {
        if (item.tipo === 'hueco') {
          return <HuecoCard key={`hueco-${idx}`} hueco={item.data} />;
        }
        const clase = item.data;
        const esProxima = esHoy && clase.id === proximaId;
        const esPasada = esHoy && clase.hora_fin <= horaActual;
        return (
          <ClaseCard
            key={clase.id}
            clase={clase}
            esProxima={esProxima}
            esPasada={esPasada}
            onVerDetalle={onVerDetalle}
          />
        );
      })}
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Estudiante';
  const token = localStorage.getItem('token') || '';
  const firstName = userName.split(' ')[0];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const diaHoy = DIAS_JS[new Date().getDay()];

  const [vista, setVista] = useState<'hoy' | 'semana'>('hoy');
  const [diaSeleccionado, setDiaSeleccionado] = useState(
    DIAS_ORDEN.includes(diaHoy) ? diaHoy : 'lunes'
  );
  const [hoyData, setHoyData] = useState<DiaData | null>(null);
  const [semanaData, setSemanaData] = useState<Record<string, DiaData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClase, setSelectedClase] = useState<Clase | null>(null);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || Object.keys(semanaData).length === 0) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{ clase: Clase; dia: string }> = [];
    for (const [dia, diaData] of Object.entries(semanaData)) {
      for (const clase of diaData.clases) {
        if (
          clase.materia.toLowerCase().includes(q) ||
          (clase.codigo && clase.codigo.toLowerCase().includes(q))
        ) {
          results.push({ clase, dia });
        }
      }
    }
    return results;
  }, [searchQuery, semanaData]);

  const notifCount = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('horariojed_notificaciones') || '[]').length;
    } catch { return 0; }
  }, []);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchHoy = useCallback(async () => {
    const res = await fetch(`${API}/horario/hoy`, { headers });
    if (!res.ok) throw new Error('Error al cargar el horario');
    return res.json() as Promise<DiaData>;
  }, [token]);

  const fetchSemana = useCallback(async () => {
    const res = await fetch(`${API}/horario/semana`, { headers });
    if (!res.ok) throw new Error('Error al cargar el horario semanal');
    const json = await res.json();
    return json.semana as Record<string, DiaData>;
  }, [token]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hoy, semana] = await Promise.all([fetchHoy(), fetchSemana()]);
      setHoyData(hoy);
      setSemanaData(semana);
    } catch {
      setError('No se pudo cargar el horario. Verifica que el servidor esté activo.');
    } finally {
      setLoading(false);
    }
  }, [fetchHoy, fetchSemana]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSeedDemo = async () => {
    setSeedingDemo(true);
    try {
      const res = await fetch(`${API}/horario/seed-demo`, { method: 'POST', headers });
      if (!res.ok) throw new Error();
      await loadAll();
    } catch {
      alert('Error al cargar datos de demo');
    } finally {
      setSeedingDemo(false);
    }
  };

  // Clase próxima para el hero
  const ahora = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
  const proxima = hoyData?.clases.find(c => c.hora_inicio > ahora) ?? hoyData?.clases[0] ?? null;

  // Datos actuales del tab de semana
  const diaActualData = semanaData[diaSeleccionado];
  const totalClasesSemana = Object.values(semanaData).reduce((s, d) => s + d.clases.length, 0);

  const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-display">

      {/* Modal de detalle RF04 */}
      {selectedClase && (
        <ClaseModal clase={selectedClase} onClose={() => setSelectedClase(null)} />
      )}

      {/* RF06 — Buscador de asignaturas */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-5 py-4 border-b border-slate-100">
                <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar por nombre o código de asignatura..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 text-slate-800 font-medium outline-none placeholder:text-slate-300 text-sm bg-transparent"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="ml-3 p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchQuery.trim() === '' ? (
                  <div className="p-10 text-center text-slate-400">
                    <Search size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">Escribe para buscar una asignatura</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <p className="font-bold text-slate-500 text-sm">Sin resultados</p>
                    <p className="text-xs mt-1">No se encontró "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                      {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                    </p>
                    {searchResults.map(({ clase, dia }, idx) => (
                      <button
                        key={`${clase.id}-${dia}-${idx}`}
                        onClick={() => {
                          setSelectedClase(clase);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm truncate">{clase.materia}</span>
                            {clase.codigo && (
                              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
                                {clase.codigo}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            <span className="capitalize">{DIAS_DISPLAY[dia] ?? dia}</span>
                            {' · '}{clase.hora_inicio} – {clase.hora_fin}
                            {clase.salon && ` · ${clase.salon}`}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">U</div>
            <span className="font-bold text-slate-800 tracking-tight uppercase text-sm hidden sm:block">Portal Estudiantil</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setVista('hoy')}
              className={`font-bold text-sm pb-1 transition-colors ${vista === 'hoy' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Mi Horario
            </button>
            <button
              onClick={() => { setVista('semana'); }}
              className={`font-bold text-sm pb-1 transition-colors ${vista === 'semana' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Semana Completa
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSearchOpen(true)}
            title="Buscar asignatura (RF06)"
            className="p-2 text-slate-400 hover:text-primary transition-colors"
          >
            <Search size={22} />
          </button>
          <button
            onClick={() => navigate('/notificaciones')}
            title="Notificaciones"
            className="relative p-2 text-slate-400 hover:text-primary transition-colors"
          >
            <Bell size={22} />
            {notifCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white px-0.5">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            ) : (
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
            )}
          </button>
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-slate-800 text-sm leading-none">{userName}</p>
              <p className="text-[10px] text-slate-400 font-medium">Ingeniería de Sistemas</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {firstName[0]?.toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── Hero (RF03) ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                <Clock size={12} />
                <span className="capitalize">{fechaHoy}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">¡Hola, {firstName}!</h1>
              {loading ? (
                <p className="text-white/70 text-lg font-medium flex items-center space-x-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Cargando tu horario...</span>
                </p>
              ) : proxima ? (
                <>
                  <p className="text-white/80 text-base font-medium">Tu próxima clase:</p>
                  <div className="flex flex-wrap gap-3">
                    <div
                      className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedClase(proxima)}
                    >
                      <div className="bg-white/20 p-2 rounded-lg"><BookOpen size={18} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">Asignatura</p>
                        <p className="font-bold text-sm">{proxima.materia}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                      <div className="bg-white/20 p-2 rounded-lg"><Clock size={18} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">Horario</p>
                        <p className="font-bold text-sm">{proxima.hora_inicio} – {proxima.hora_fin}</p>
                      </div>
                    </div>
                    {proxima.salon && (
                      <div
                        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedClase(proxima)}
                      >
                        <div className="bg-white/20 p-2 rounded-lg"><MapPin size={18} /></div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">Salón</p>
                          <p className="font-bold text-sm">{proxima.salon}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-white/80 text-lg font-medium">
                  {hoyData?.clases.length === 0
                    ? '¡No tienes clases hoy! Disfruta tu día 🎉'
                    : 'Ya terminaste todas tus clases de hoy 🎓'}
                </p>
              )}
            </div>

            {/* Stats */}
            {!loading && totalClasesSemana > 0 && (
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 min-w-[80px]">
                  <p className="text-3xl font-extrabold">{hoyData?.clases.length ?? 0}</p>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Hoy</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 min-w-[80px]">
                  <p className="text-3xl font-extrabold">{totalClasesSemana}</p>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Semana</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
            <BookOpen size={200} strokeWidth={0.5} />
          </div>
        </motion.section>

        {/* ── Contenido principal ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="font-medium">Cargando tu horario...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-3xl p-8 text-center border border-red-100">
            <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
            <p className="font-bold text-red-700 mb-1">Error de conexión</p>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button onClick={loadAll} className="bg-red-500 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-red-600 transition-colors">
              Reintentar
            </button>
          </div>
        ) : totalClasesSemana === 0 ? (
          /* Sin datos — invitar a cargar demo */
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Aún no tienes clases registradas</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Carga el horario de demo para explorar todas las funcionalidades del portal.
            </p>
            <button
              onClick={handleSeedDemo}
              disabled={seedingDemo}
              className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center space-x-2 mx-auto disabled:opacity-60"
            >
              {seedingDemo
                ? <><Loader2 size={16} className="animate-spin" /><span>Cargando...</span></>
                : <><Sparkles size={16} /><span>Cargar horario de demo</span></>
              }
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Columna izquierda: Horario ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Tabs Hoy / Semana (mobile) */}
              <div className="flex md:hidden bg-slate-100 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => setVista('hoy')}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${vista === 'hoy' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                >
                  Hoy
                </button>
                <button
                  onClick={() => setVista('semana')}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${vista === 'semana' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                >
                  Semana
                </button>
              </div>

              {vista === 'hoy' ? (
                /* Vista Hoy */
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-primary" size={22} />
                      <h2 className="text-lg font-bold text-slate-800">
                        Horario de hoy —&nbsp;
                        <span className="capitalize text-primary">{DIAS_DISPLAY[diaHoy] ?? diaHoy}</span>
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-slate-400 capitalize">{fechaHoy}</span>
                  </div>
                  {hoyData
                    ? <TimelineDay diaData={hoyData} onVerDetalle={setSelectedClase} />
                    : <p className="p-8 text-center text-slate-400">Sin datos</p>
                  }
                </div>
              ) : (
                /* Vista Semana */
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Selector de días */}
                  <div className="flex overflow-x-auto gap-1 p-3 border-b border-gray-100 no-scrollbar">
                    {DIAS_ORDEN.map(dia => {
                      const count = semanaData[dia]?.clases.length ?? 0;
                      const esHoyDia = dia === diaHoy;
                      return (
                        <button
                          key={dia}
                          onClick={() => setDiaSeleccionado(dia)}
                          className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-all text-xs font-bold
                            ${diaSeleccionado === dia
                              ? 'bg-primary text-white shadow-md shadow-primary/20'
                              : 'text-slate-400 hover:bg-slate-50'
                            }`}
                        >
                          <span className="uppercase tracking-wider">{DIAS_DISPLAY[dia].slice(0, 3)}</span>
                          <span className={`mt-1 text-[10px] px-1.5 rounded-full font-black
                            ${diaSeleccionado === dia ? 'bg-white/30' : count > 0 ? 'bg-primary/10 text-primary' : 'text-slate-200'}`}>
                            {count}
                          </span>
                          {esHoyDia && (
                            <span className="mt-0.5 w-1 h-1 rounded-full bg-secondary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center px-6 pt-4 pb-0 space-x-3">
                    <h2 className="text-lg font-bold text-slate-800 capitalize">
                      {DIAS_DISPLAY[diaSeleccionado]}
                    </h2>
                    {diaSeleccionado === diaHoy && (
                      <span className="text-[10px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full">Hoy</span>
                    )}
                  </div>
                  {diaActualData
                    ? <TimelineDay diaData={diaActualData} onVerDetalle={setSelectedClase} />
                    : <p className="p-8 text-center text-slate-400">Sin datos para este día</p>
                  }
                </div>
              )}
            </div>

            {/* ── Columna derecha ── */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <span className="text-secondary">⚡</span>
                <span>Accesos Rápidos</span>
              </h2>

              <div className="space-y-3">
                <button className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center group hover:border-primary transition-all duration-300 hover:shadow-md">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Download size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-slate-800 text-sm">Descargar Horario</p>
                    <p className="text-xs text-slate-400 font-medium">PDF del semestre actual</p>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-primary transition-colors" size={18} />
                </button>

                <button className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center group hover:border-primary transition-all duration-300 hover:shadow-md">
                  <div className="bg-secondary/10 p-3 rounded-2xl text-secondary mr-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Calendar size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-slate-800 text-sm">Calendario Académico</p>
                    <p className="text-xs text-slate-400 font-medium">Fechas clave y exámenes</p>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-secondary transition-colors" size={18} />
                </button>
              </div>

              {/* Resumen semanal */}
              {Object.keys(semanaData).length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center space-x-2">
                    <Info size={14} className="text-primary" />
                    <span>Resumen de la semana</span>
                  </h3>
                  <div className="space-y-2">
                    {DIAS_ORDEN.map(dia => {
                      const d = semanaData[dia];
                      if (!d || d.clases.length === 0) return null;
                      return (
                        <button
                          key={dia}
                          onClick={() => { setVista('semana'); setDiaSeleccionado(dia); }}
                          className="w-full flex items-center justify-between text-xs py-1.5 hover:text-primary transition-colors group"
                        >
                          <span className={`font-bold capitalize ${dia === diaHoy ? 'text-primary' : 'text-slate-600'}`}>
                            {DIAS_DISPLAY[dia]}
                            {dia === diaHoy && <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">hoy</span>}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">{d.clases.length} clase{d.clases.length !== 1 ? 's' : ''}</span>
                            {d.huecos.length > 0 && (
                              <span className="text-amber-500 font-bold">{d.huecos.length} hueco{d.huecos.length !== 1 ? 's' : ''}</span>
                            )}
                            <ChevronRight size={12} className="text-slate-200 group-hover:text-primary transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Aviso */}
              <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10 border-dashed relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 text-primary font-bold mb-2">
                    <Info size={16} />
                    <span className="text-sm">Aviso Importante</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">
                    Las inscripciones para cursos vacacionales abren el 15 de junio. Revisa los requisitos.
                  </p>
                  <button className="text-primary text-xs font-bold flex items-center hover:translate-x-1 transition-transform">
                    Saber más <ChevronRight size={12} className="ml-1" />
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 text-primary/10">
                  <Info size={60} strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 py-10 px-6 border-t border-gray-100 bg-white text-center">
        <p className="text-slate-400 text-xs font-medium mb-4">
          © 2026 Universidad Católica Luis Amigó • Vigilada por el Ministerio de Educación Nacional
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors flex items-center space-x-1"><Info size={12} /><span>Ayuda</span></a>
          <a href="#" className="hover:text-primary transition-colors flex items-center space-x-1"><BookOpen size={12} /><span>Términos</span></a>
          <a href="#" className="hover:text-primary transition-colors flex items-center space-x-1"><Bell size={12} /><span>Soporte IT</span></a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
