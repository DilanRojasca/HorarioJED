import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: string;
  full_name: string;
  cedula: string;
  email: string;
}

const PanelAdminEstudiantes: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/students`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50">

      {/*  SideNavBar (Desktop)  */}
      <aside className="h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 hidden md:flex flex-col p-4 space-y-2 font-lexend shadow-lg transition-all duration-200 ease-in-out">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#008499]">Admin Panel</h2>
            <p className="text-xs text-slate-500 font-medium tracking-tight">University Management</p>
          </div>
        </div>
        <nav className="flex-grow space-y-1">

          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all" href="/admin/cursos">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm font-medium">Cursos</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#008499] bg-[#008499]/10 rounded-xl font-semibold" href="/admin/estudiantes">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span className="text-sm font-medium">Estudiantes</span>
          </a>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/*  TopNavBar  */}
        <header className="fixed top-0 w-full md:relative z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6 h-16 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-xl font-extrabold text-[#008499] font-lexend tracking-tight">Horario JED</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <a className="text-[#008499] font-bold border-b-2 border-[#008499] py-5" href="#">Estudiantes</a>
              <a className="text-slate-500 hover:text-[#008499] transition-colors" href="#">Cursos</a>
              <a className="text-slate-500 hover:text-[#008499] transition-colors" href="#">Reportes</a>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <button className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container">
                <img alt="Admin User" data-alt="professional portrait of a male university administrator with a friendly expression and short dark hair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjANjBXSS8qSeGsTQqQ1i1oUXbloh0msevQ1M6yswTQB058_0yr6zfvwIOmeQ6EQYtVfW8ME2J8sUdmEQEg6tMlx-F56hZZGohWAO754BfG8V-fsn0o60HRAMxOhgsHLKyD1b2KkPEHN-nQlcx8GRhrmZ7iqbLsz2NGKbGwCqbLvXoZ9_pPvgfi1hjL-gbB1B0GesQjK9nngOsXTj1J5jdLaW9tm7rmC2lRYOJrCxBNEd-Jg4AxmQQfzEHZfBqwMFRZYkJ886_E64" />
              </button>
              <a className="text-secondary font-bold text-sm hover:underline scale-95 active:duration-150 inline-block" onClick={(e) => { e.preventDefault(); handleLogout(); }} href="/login">Logout</a>
            </div>
          </div>
        </header>
        {/*  Main Content  */}
        <main className="flex-grow pt-20 md:pt-8 px-6 pb-24 md:pb-8 overflow-y-auto no-scrollbar">
          {/*  Breadcrumb & Header  */}
          <div className="mb-8">
            <nav className="flex text-xs font-bold text-slate-400 uppercase tracking-widest gap-2 mb-2">
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-on-background leading-tight">Listado de Estudiantes</h1>
                <p className="text-slate-500 mt-1">Vista total de {students.length} estudiantes matriculados actualmente en el sistema.</p>
              </div>
              {/*  Search Bar Section  */}
              <div className="relative group w-full md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                  className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-on-background placeholder:text-slate-400 font-medium"
                  id="student-search-input"
                  name="id_cedula"
                  placeholder="Buscar por ID (Cédula)..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/*  Bento Grid of Students  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {students.filter(s => s.cedula && s.cedula.includes(searchTerm)).map((student, index) => {
              const avatars = [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAdNJaFBMMogZv5c1R4l8lzRl98vTT_HF65hU-63VYuZfTu1cu0Bim2L5-xcLa2wenzi1o6kq6Bbkyma-YhbWKONc4_AEjGDE2lIUm2Jdvd4gC8O8KEktIqJU0SiOaRudmfakqbhHSJYhNfOZUYKqoVujVTO81VeSmwOw3sxgB-8NZa0Swqhg4hifoODFnBTOENr4DD8Z7UVMycelyI-BFAsqJuGxsAtWpHBfDFkfuFOa5W2BKdHSWVVJcXyRD25jVU-DIKdzGEmok",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAz3r9eddXJewgK3eAa2lNYZj1AloPVocRq_Adg7uSr-SY1fFK9MOTWYeLcAR0vzoBwCfSQVHKiMRNEpirgqiVYALCfSOk8iXjQgi2sr-ndqeO0hD9wyrGYxov-l_Al09kDJmf0uJSWGq_jWqZ7dSsl12T3ugTzXAYw2HeTXT_ZEkK3sQkCfxM7eVln9qR2pTwHrsCS18Qep2wb5mpYF7d-1hciToBk2fBioD_DEql44YHpe1rmMn1FfC7SACl1H1QcFF7dHbfiuE0",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAJQOl2BYOLTSGAcGKwK-YUzT0yMG84w8I5U70Ot6MuQu_8FmKDytIRiigWV4rgCNN203o8gP2ZVYypohAipl9ZkuZM2e_12LxHDn22xOJ_Ju4G1OyiMWftQDoVT1wnXOVSWBAtCFDBH5FQhLzV4oyXN2xZp2N6zMPzwNXGBzChTZjDoUsH-BEG3tI5qYKHIseciaHhKx8tDXpcGv_P1lWxy0nM77urUhznuvq2oSisXbJUk-xxUruczIbuy5sN6REUQQOK3YUzSsA",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCfgNADfJx4Ol_VFGRgtPI-90fZSNLzjcn00Qp9FH9LmVXLtiMxVjVoUEiexWPRJcYoUnZrRUokN1DENh7XI_4K71BnMwK3BzUWXEteMWAZPTjKgOqgyR7gnoZzX0YktGYbsq-mo4cPGv9tpvL-FTj-CZI_vNIHuxCLMvHM_x_0oEvhIoPBI0eFM7LJhkHZEqTVcaeI8JVxT6mKTbbh9h5Q5NspwlMP97YcV3rF6DSLht-4XUI861m2COQVSxulyfXLEh-g1aS7Edw",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA0YRXpV57mVrPBS-90rrmL5QaaJaXgXLeu9N6fOlK4dINPBZJZRPKEU-ZZn91Ud-7eWsMozHTDcfV2x2AOfZY7kNuISruHfyCdjqnctLubqjIFSIQvFqbilpprTdfI-iR7gfez1GHKXI11TwqUtwtC40xP7h2zsyO4kdsHKZSvtaTvgSFCFBCRqs0eSkwfcC_CHrfhUFvBbovNY14zJB3dE5eFpJ7q7yYIf9y1q4l0eU_XeZ9bQ8_OE0rD8mMeJDMZjrp4qnXAxDI",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD6urZPCZZD82bLNDTAFj7UjEocQ8E2BVloP72n4JEn3q1mJWWkd56TrLdmL0gTe0fN6wmFcWOTKBGgVyWeLtMVfWh21FnZS9_AxhGXh4xEh9AcS4nMpAVYf7cubCEY9Rrq175oTqsGYXZknN0QLK0Xc4YtsyT-L-E9fwm4hu4woggRvNNDzAPbtpokfsOhb6G9ijK0Yr6RXFiiAvPqJ-LL5RwSXh0rwd3ZYvVAi6j9rwf74ZlOc2o_Ev2w6O8e6hIeqFaONNChxmU"
              ];

              const statusStyles = [
                { border: 'border-primary', badge: 'bg-primary/10 text-primary', text: 'Active' },
                { border: 'border-slate-200', badge: 'bg-slate-100 text-slate-500', text: 'Regular' },
                { border: 'border-secondary', badge: 'bg-secondary/10 text-secondary', text: 'Scholarship' }
              ];

              const avatar = avatars[index % avatars.length];
              const style = statusStyles[index % statusStyles.length];

              return (
                <div key={student.id} className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 outline-variant outline-1 flex flex-col border-l-4 ${style.border}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                      <img alt="Student" src={avatar} />
                    </div>
                    <span className={`${style.badge} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>{style.text}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 truncate">{student.full_name}</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">ID: {student.cedula}</p>
                  <div className="flex items-center gap-2 text-slate-500 mt-4 text-sm">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="truncate">{student.email}</span>
                  </div>
                  <a className="mt-6 w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2" href="#">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>Ver Horario
                  </a>
                </div>
              );
            })}

          </div>
        </main>
        {/*  FAB for Adding Student (University Focused Action)  */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-secondary text-white rounded-2xl shadow-xl hover:shadow-secondary/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center md:hidden">
          <span className="material-symbols-outlined text-3xl">person_add</span>
        </button>
      </div>
      {/*  BottomNavBar (Mobile Only)  */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md flex items-center justify-around px-4 z-40">

        <button onClick={() => navigate('/admin/estudiantes')} className="flex flex-col items-center gap-1 text-[#008499]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Students</span>
        </button>
        <button onClick={() => navigate('/admin/cursos')} className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Schedules</span>
        </button>
      </nav>

    </div>
  );
};

export default PanelAdminEstudiantes;
