import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Plus, Trash2, X, Clock, Calendar,
  BookOpen, AlertCircle, ChevronLeft, Sparkles,
  BellOff, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoNotif = 'clase' | 'examen' | 'personal' | 'otro';

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  hora: string;
  tipo: TipoNotif;
  createdAt: string;
}

// ─── Config por tipo ──────────────────────────────────────────────────────────

const TIPO_CONFIG: Record<TipoNotif, { label: string; colorBadge: string; colorCard: string; icon: React.ReactNode }> = {
  clase: {
    label: 'Clase',
    colorBadge: 'bg-blue-100 text-blue-700',
    colorCard: 'border-blue-100 bg-blue-50/40',
    icon: <BookOpen size={15} className="text-blue-500" />,
  },
  examen: {
    label: 'Examen',
    colorBadge: 'bg-red-100 text-red-700',
    colorCard: 'border-red-100 bg-red-50/40',
    icon: <AlertCircle size={15} className="text-red-500" />,
  },
  personal: {
    label: 'Personal',
    colorBadge: 'bg-emerald-100 text-emerald-700',
    colorCard: 'border-emerald-100 bg-emerald-50/40',
    icon: <Sparkles size={15} className="text-emerald-500" />,
  },
  otro: {
    label: 'Otro',
    colorBadge: 'bg-slate-100 text-slate-600',
    colorCard: 'border-slate-100 bg-slate-50/60',
    icon: <Bell size={15} className="text-slate-400" />,
  },
};

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'horariojed_notificaciones';

function loadNotifs(): Notificacion[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}

function saveNotifs(notifs: Notificacion[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(notifs));
}

// ─── Form vacío ───────────────────────────────────────────────────────────────

const FORM_EMPTY = { titulo: '', mensaje: '', fecha: '', hora: '', tipo: 'clase' as TipoNotif };

// ─── Componente principal ─────────────────────────────────────────────────────

const Notificaciones: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Estudiante';
  const firstName = userName.split(' ')[0];

  const [notifs, setNotifs] = useState<Notificacion[]>(loadNotifs);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(FORM_EMPTY);
  const [errors, setErrors] = useState<Partial<typeof FORM_EMPTY>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { saveNotifs(notifs); }, [notifs]);

  // ── Ordenar: próximas primero ──
  const notifsOrdenadas = [...notifs].sort((a, b) => {
    const da = new Date(`${a.fecha}T${a.hora}`).getTime();
    const db = new Date(`${b.fecha}T${b.hora}`).getTime();
    return da - db;
  });

  const proximas = notifsOrdenadas.filter(n => new Date(`${n.fecha}T${n.hora}`) >= new Date());
  const pasadas = notifsOrdenadas.filter(n => new Date(`${n.fecha}T${n.hora}`) < new Date());

  // ── Validación ──
  function validate() {
    const e: Partial<typeof FORM_EMPTY> = {};
    if (!form.titulo.trim()) e.titulo = 'El título es obligatorio';
    if (!form.fecha) e.fecha = 'Selecciona una fecha';
    if (!form.hora) e.hora = 'Selecciona una hora';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCrear(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const nueva: Notificacion = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
    };
    setNotifs(prev => [nueva, ...prev]);
    setForm(FORM_EMPTY);
    setErrors({});
    setFormOpen(false);
  }

  function handleEliminar(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id));
    setDeleteId(null);
  }

  function formatFechaHora(fecha: string, hora: string) {
    try {
      return new Date(`${fecha}T${hora}`).toLocaleString('es-CO', {
        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      });
    } catch { return `${fecha} ${hora}`; }
  }

  function tiempoRestante(fecha: string, hora: string) {
    const diff = new Date(`${fecha}T${hora}`).getTime() - Date.now();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `en ${d}d ${h}h`;
    if (h > 0) return `en ${h}h ${m}min`;
    return `en ${m} min`;
  }

  // ─── Fecha mínima (hoy) ───────────────────────────────────────────────────
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-display">

      {/* Modal confirmación eliminar */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">¿Eliminar notificación?</h3>
              <p className="text-sm text-slate-400 text-center mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminar(deleteId)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="block text-[10px] text-slate-400 font-medium hidden sm:block">Notificaciones</span>
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

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-primary/20"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Bell size={18} className="opacity-80" />
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">RF07 — Notificaciones</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Mis Notificaciones</h1>
              <p className="text-white/70 text-sm mt-1 font-medium">
                {notifs.length === 0 ? 'Sin notificaciones programadas' : `${proximas.length} próxima${proximas.length !== 1 ? 's' : ''} · ${pasadas.length} pasada${pasadas.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center space-x-2 bg-white text-primary font-bold px-4 py-2.5 rounded-2xl text-sm hover:bg-white/90 transition-colors shadow-md flex-shrink-0"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nueva</span>
            </button>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
            <Bell size={120} strokeWidth={0.8} />
          </div>
        </motion.div>

        {/* ── Formulario nueva notificación ── */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-slate-800 flex items-center space-x-2">
                    <Plus size={18} className="text-primary" />
                    <span>Nueva notificación</span>
                  </h2>
                  <button
                    onClick={() => { setFormOpen(false); setForm(FORM_EMPTY); setErrors({}); }}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCrear} className="space-y-4">
                  {/* Tipo */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Tipo</label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(TIPO_CONFIG) as TipoNotif[]).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, tipo: t }))}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            form.tipo === t
                              ? 'bg-primary text-white border-primary shadow-md'
                              : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {TIPO_CONFIG[t].icon}
                          <span>{TIPO_CONFIG[t].label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Título *</label>
                    <input
                      type="text"
                      placeholder="Ej: Parcial de Cálculo"
                      value={form.titulo}
                      onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 ${
                        errors.titulo ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    {errors.titulo && <p className="text-xs text-red-500 mt-1 font-medium">{errors.titulo}</p>}
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Mensaje (opcional)</label>
                    <textarea
                      placeholder="Descripción o recordatorio adicional..."
                      value={form.mensaje}
                      onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:border-primary focus:bg-white text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 resize-none"
                    />
                  </div>

                  {/* Fecha y hora */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                        <Calendar size={11} /><span>Fecha *</span>
                      </label>
                      <input
                        type="date"
                        min={hoy}
                        value={form.fecha}
                        onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium text-slate-800 outline-none transition-all ${
                          errors.fecha ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.fecha && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fecha}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                        <Clock size={11} /><span>Hora *</span>
                      </label>
                      <input
                        type="time"
                        value={form.hora}
                        onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium text-slate-800 outline-none transition-all ${
                          errors.hora ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.hora && <p className="text-xs text-red-500 mt-1 font-medium">{errors.hora}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => { setFormOpen(false); setForm(FORM_EMPTY); setErrors({}); }}
                      className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                    >
                      <Bell size={15} />
                      <span>Programar</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Lista vacía ── */}
        {notifs.length === 0 && !formOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BellOff size={28} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Sin notificaciones</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
              Crea recordatorios para tus clases, exámenes o eventos personales.
            </p>
            <button
              onClick={() => setFormOpen(true)}
              className="bg-primary text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 inline-flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Crear primera notificación</span>
            </button>
          </motion.div>
        )}

        {/* ── Próximas ── */}
        {proximas.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2 px-1">
              <Clock size={14} className="text-primary" />
              <span>Próximas ({proximas.length})</span>
            </h2>
            <AnimatePresence initial={false}>
              {proximas.map(n => (
                <NotifCard key={n.id} n={n} onDelete={() => setDeleteId(n.id)} formatFechaHora={formatFechaHora} tiempoRestante={tiempoRestante} />
              ))}
            </AnimatePresence>
          </section>
        )}

        {/* ── Pasadas ── */}
        {pasadas.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2 px-1">
              <Info size={14} className="text-slate-400" />
              <span>Pasadas ({pasadas.length})</span>
            </h2>
            <AnimatePresence initial={false}>
              {pasadas.map(n => (
                <NotifCard key={n.id} n={n} onDelete={() => setDeleteId(n.id)} formatFechaHora={formatFechaHora} tiempoRestante={tiempoRestante} pasada />
              ))}
            </AnimatePresence>
          </section>
        )}
      </main>
    </div>
  );
};

// ─── Tarjeta de notificación ──────────────────────────────────────────────────

function NotifCard({
  n, onDelete, formatFechaHora, tiempoRestante, pasada = false,
}: {
  n: Notificacion;
  onDelete: () => void;
  formatFechaHora: (f: string, h: string) => string;
  tiempoRestante: (f: string, h: string) => string | null;
  pasada?: boolean;
}) {
  const cfg = TIPO_CONFIG[n.tipo];
  const restante = tiempoRestante(n.fecha, n.hora);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-white rounded-2xl border p-5 flex items-start gap-4 shadow-sm transition-opacity ${cfg.colorCard} ${pasada ? 'opacity-50' : ''}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${pasada ? 'bg-slate-100' : 'bg-white border border-slate-100 shadow-sm'}`}>
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-slate-800 text-sm truncate">{n.titulo}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.colorBadge}`}>
                {cfg.label}
              </span>
            </div>
            {n.mensaje && (
              <p className="text-xs text-slate-500 font-medium mb-1.5 line-clamp-2">{n.mensaje}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={11} />{formatFechaHora(n.fecha, n.hora)}
              </span>
              {restante && (
                <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                  {restante}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Notificaciones;
