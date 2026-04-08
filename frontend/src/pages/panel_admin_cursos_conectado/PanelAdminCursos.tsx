import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Materia {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
}

const PanelAdminCursos: React.FC = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:8000/admin/courses", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMaterias(data);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50">

{/*  SideNavBar Component  */}
<aside className="h-screen w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col p-4 space-y-2 sticky top-0">
<div className="flex items-center gap-3 px-2 py-4 mb-6">
<img alt="University Logo" className="h-10 w-10 object-contain" data-alt="Modern university crest logo with clean geometric lines in teal and white background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKD5N4VgElmD_0oKjh4aJs7EjjHKWKDLzXXqGFAxgjfuMTu5HcwFky02VqMSTV8yISofELYNFRDBXM74_WETbqfKl-yjrKnkwN_eBsmkAMHRhHRcEzpChrD8QMznGPaZoDTU3PKBhc49p5mgdBTeX0ZFxWXZYQNzaj72B3PW364vymdB9nUtdQNQumK89mMH7NtmvpgMOwQzhcsgCQjP56XocMsVau54v-RfPTY43D-ngZvcYkNOQ4bAtP6wpu72pbAbKtZu9LBxc"/>
<div className="flex flex-col">
<span className="text-lg font-bold text-[#008499]">Admin Panel</span>
<span className="text-[10px] uppercase tracking-wider text-slate-500">University Management</span>
</div>
</div>
<nav className="flex-1 space-y-1">

<a className="flex items-center gap-3 px-4 py-3 text-[#008499] bg-[#008499]/10 rounded-xl font-semibold" href="/admin/cursos">
<span className="material-symbols-outlined" data-icon="calendar_today" style={{fontVariationSettings: "'FILL' 1"}}>calendar_today</span>
<span>Schedules</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all" href="/admin/estudiantes">
<span className="material-symbols-outlined" data-icon="groups">groups</span>
<span>Faculty</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
<span className="material-symbols-outlined" data-icon="meeting_room">meeting_room</span>
<span>Classrooms</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<div className="pt-4 border-t border-slate-100 dark:border-slate-800">
<button className="w-full bg-[#008499] text-white py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-4">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
<span>New Entry</span>
</button>
<div className="space-y-1">
<a className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500 hover:text-[#008499]" href="#">
<span className="material-symbols-outlined text-sm" data-icon="help_outline">help_outline</span>
<span>Support</span>
</a>
<a className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500 hover:text-[#008499]" href="#">
<span className="material-symbols-outlined text-sm" data-icon="analytics">analytics</span>
<span>System Status</span>
</a>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<main className="flex-1 flex flex-col min-w-0">
{/*  TopAppBar Component  */}
<header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6 h-16 shadow-sm no-line md:relative md:bg-white md:shadow-none">
<div className="flex items-center gap-4 flex-1">
<div className="md:hidden">
<img alt="University Logo" className="h-8 w-8 object-contain" data-alt="Minimalist logo of a university focusing on academic excellence" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYn4fM2RG_igOFLQPyZcm6DskjiW2NO_4lELNtErnIdoDrMIUiIBPUDhwiwynQK6EIJAfJsdDJ6XANBQecmjDiGoyRCs6lsBzAANyBKyJ_9DX8weU5jGRDY9PynTMfYG_daRPXfrv3gEFDblyG4mLKBl2ssBdVCzth6ZmMQQ2EY1z03yxiMAvbOJhwpi_veEpaaIOtXoM7fL8fJg3IRuRQTvoKVOCO1LPCfN5K6S_hhoSFBPYdh77YnCIsjaCUaETPBqPXmRDlkZs"/>
</div>
<div className="relative max-w-md w-full ml-4 md:ml-0">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" data-icon="search">search</span>
<input 
  className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#008499] placeholder:text-slate-400" 
  placeholder="Search courses by name or code..." 
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<div className="hidden md:flex items-center gap-3">
<div className="text-right">
<p className="text-sm font-bold leading-none">Admin User</p>
<p className="text-[10px] text-slate-500 uppercase tracking-tighter">Department Head</p>
</div>
<button onClick={handleLogout} className="bg-[#F58220] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#e0761d] transition-all">
                        Logout
                    </button>
</div>
</div>
</header>
{/*  Canvas  */}
<div className="p-6 md:p-10 pt-24 md:pt-10 max-w-7xl mx-auto w-full">
{/*  Hero Header  */}
<div className="mb-10">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="text-3xl font-extrabold text-[#008499] mb-2">Course Management</h1>
<p className="text-slate-500 max-w-lg">Monitor university schedules, student enrollment, and faculty assignments across all departments.</p>
</div>
<div className="flex gap-2">
<span className="px-3 py-1 bg-[#008499]/10 text-[#008499] rounded-full text-xs font-bold uppercase tracking-wider">Active: 24 Courses</span>
<span className="px-3 py-1 bg-[#F58220]/10 text-[#F58220] rounded-full text-xs font-bold uppercase tracking-wider">Pending: 3</span>
</div>
</div>
</div>
{/*  Bento Grid Courses  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

{materias.filter(m => m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || (m.codigo && m.codigo.toLowerCase().includes(searchTerm.toLowerCase()))).map((materia, index) => {
  const icons = ['architecture', 'code', 'biotech', 'palette', 'warning', 'functions'];
  const colors = ['#008499', '#008499', '#008499', '#008499', '#F58220', '#008499'];
  const departments = ['Department of Civil Engineering', 'Computer Science Dept.', 'Faculty of Life Sciences', 'School of Visual Arts', 'Faculty of Jurisprudence', 'Mathematics Department'];
  const icon = icons[index % icons.length];
  const color = colors[index % colors.length];
  const department = departments[index % departments.length];

  return (
    <div key={materia.id} className={`group bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[${color}]/20 cursor-pointer`} onClick={() => window.location.href="/admin/estudiantes"}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl bg-[${color}]/10 flex items-center justify-center text-[${color}] group-hover:bg-[${color}] group-hover:text-white transition-colors`}>
          <span className="material-symbols-outlined" data-icon={icon}>{icon}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 tracking-widest">{materia.codigo}</span>
      </div>
      <h3 className={`font-bold text-lg text-slate-900 group-hover:text-[${color}] transition-colors`}>{materia.nombre}</h3>
      <p className="text-sm text-slate-500 mt-1 mb-6">{department}</p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200"></div>
          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-300"></div>
          <div className={`w-7 h-7 rounded-full border-2 border-white bg-[${color}] flex items-center justify-center text-[10px] text-white`}>+{materia.creditos}C</div>
        </div>
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
        </span>
      </div>
    </div>
  );
})}

{/*  New Course Placeholder  */}
<div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#008499] hover:text-[#008499] transition-all cursor-pointer group">
<div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="add">add</span>
</div>
<span className="font-bold">Add New Course</span>
</div>
</div>
{/*  Recently Modified (Asymmetric Layout element)  */}
<section className="mt-16">
<h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[#F58220]" data-icon="history">history</span>
                    System Logs
                </h2>
<div className="bg-surface-container-lowest rounded-2xl p-2 shadow-sm overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left text-sm">
<thead>
<tr className="border-b border-slate-50">
<th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Action</th>
<th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Course</th>
<th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Admin</th>
<th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Status</th>
</tr>
</thead>
<tbody>
<tr className="hover:bg-slate-50 transition-colors">
<td className="px-6 py-4 font-medium">Modified Schedule</td>
<td className="px-6 py-4 text-slate-500">ENG-204</td>
<td className="px-6 py-4 text-slate-500">Dr. Smith</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">SUCCESS</span>
</td>
</tr>
<tr className="hover:bg-slate-50 transition-colors">
<td className="px-6 py-4 font-medium">New Enrollment</td>
<td className="px-6 py-4 text-slate-500">CS-101</td>
<td className="px-6 py-4 text-slate-500">System</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-[#008499]/10 text-[#008499] rounded-md text-[10px] font-bold">INFO</span>
</td>
</tr>
<tr className="hover:bg-slate-50 transition-colors border-none">
<td className="px-6 py-4 font-medium">Classroom Conflict</td>
<td className="px-6 py-4 text-slate-500">LAW-400</td>
<td className="px-6 py-4 text-slate-500">Admin User</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-[#F58220]/10 text-[#F58220] rounded-md text-[10px] font-bold">PENDING</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
</div>
</main>
{/*  Mobile Navigation (Bottom)  */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 px-4 z-50">

<a className="flex flex-col items-center gap-1 text-slate-400" href="/admin/cursos">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span className="text-[10px] font-bold uppercase">Sched</span>
</a>
<div className="-mt-8">
<button className="bg-[#008499] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
<span className="material-symbols-outlined" data-icon="add">add</span>
</button>
</div>
<a className="flex flex-col items-center gap-1 text-slate-400" href="/admin/estudiantes">
<span className="material-symbols-outlined" data-icon="groups">groups</span>
<span className="text-[10px] font-bold uppercase">Staff</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="text-[10px] font-bold uppercase">Setup</span>
</a>
</nav>

    </div>
  );
};

export default PanelAdminCursos;
