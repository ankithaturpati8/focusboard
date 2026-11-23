import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ListTodo,
  PieChart,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Calendar,
  Tag,
  Sparkles,
  Menu,
} from 'lucide-react';
import { TaskModal, DeleteModal } from './TaskModal';

const STORAGE_KEY = 'focusboard_tasks';

const SAMPLE_TASKS = [
  { id: '101', title: 'Complete UI design', description: 'Finish dashboard UI components and align spacing.', category: 'Design', status: 'In progress', priority: 'High', dueDate: '2026-11-25' },
  { id: '102', title: 'Implement localStorage persistence', description: 'Ensure tasks load from browser storage and sync automatically.', category: 'Development', status: 'Completed', priority: 'High', dueDate: '2026-11-24' },
  { id: '103', title: 'Test responsive mobile layout', description: 'Verify stacked cards and touch targets at 390px and 768px.', category: 'Testing', status: 'To do', priority: 'Medium', dueDate: '2026-11-27' },
  { id: '104', title: 'Conduct user accessibility audit', description: 'Check keyboard focus rings, ARIA labels, and contrast ratios.', category: 'Research', status: 'To do', priority: 'Low', dueDate: '2026-11-29' },
  { id: '105', title: 'Refactor task filtering logic', description: 'Combine title search with status tabs and priority filters.', category: 'Development', status: 'In progress', priority: 'Medium', dueDate: '2026-11-26' },
  { id: '106', title: 'Prepare project documentation', description: 'Write README.md and AI_USAGE.md covering deployment.', category: 'Research', status: 'Completed', priority: 'Low', dueDate: '2026-11-23' },
];

const SLIDES = [
  { id: 1, tag: 'FOCUS NOTES • 1 OF 3', title: 'Plan your day', description: 'Organise your priorities and focus on what matters most.', bg: 'from-indigo-600 to-blue-600' },
  { id: 2, tag: 'FOCUS NOTES • 2 OF 3', title: 'Deep work sprints', description: 'Batch similar tasks together and eliminate distractions for 45-minute blocks.', bg: 'from-violet-600 to-purple-600' },
  { id: 3, tag: 'FOCUS NOTES • 3 OF 3', title: 'Review daily progress', description: 'Update task statuses before wrapping up so tomorrow starts with momentum.', bg: 'from-emerald-600 to-teal-600' },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_TASKS;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [slideIdx, setSlideIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'In progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, inProgress, completed, pct };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      const mTitle = t.title.toLowerCase().includes(search.trim().toLowerCase());
      const mStatus = statusTab === 'All' || t.status === statusTab;
      const mPrio = priorityFilter === 'All' || t.priority === priorityFilter;
      return mTitle && mStatus && mPrio;
    });
  }, [tasks, search, statusTab, priorityFilter]);

  const handleSave = (item) => {
    if (editing) {
      setTasks((prev) => prev.map((t) => (t.id === item.id ? item : t)));
    } else {
      setTasks((prev) => [item, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const slide = SLIDES[slideIdx];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 px-5 py-6 z-20">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">FB</div>
          <span className="text-xl font-bold">FocusBoard</span>
        </div>
        <nav className="space-y-1.5 flex-1">
          {[
            { label: 'Overview', value: 'All', icon: LayoutDashboard },
            { label: 'To do', value: 'To do', icon: ListTodo },
            { label: 'In progress', value: 'In progress', icon: Clock },
            { label: 'Completed', value: 'Completed', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusTab(item.value)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${statusTab === item.value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <aside className="relative w-64 bg-white h-full p-5 z-50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold">FocusBoard</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-1.5 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {['All', 'To do', 'In progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setStatusTab(tab); setMenuOpen(false); }}
                className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium mb-1 cursor-pointer ${statusTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
              >
                {tab === 'All' ? 'Overview' : tab}
              </button>
            ))}
          </aside>
        </div>
      )}

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)} className="lg:hidden p-2 rounded-xl border border-slate-200 cursor-pointer">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold">My Tasks Overview</h1>
            </div>
            <button
              type="button"
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Tasks</span>
                <ListTodo className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-3xl font-bold mt-3">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">In Progress</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-indigo-600 mt-3">{stats.inProgress}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-600 mt-3">{stats.completed}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Completion Rate</span>
                <PieChart className="w-4 h-4 text-violet-600" />
              </div>
              <p className="text-3xl font-bold mt-3">{stats.pct}%</p>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${stats.pct}%` }} />
              </div>
            </div>

          </section>

          <section className={`rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r ${slide.bg}`}>
            <p className="text-xs font-bold opacity-80">{slide.tag}</p>
            <h2 className="text-2xl font-bold mt-2">{slide.title}</h2>
            <p className="mt-2 opacity-90 max-w-xl">{slide.description}</p>
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSlideIdx((p) => (p === 0 ? SLIDES.length - 1 : p - 1))}
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setSlideIdx((p) => (p === SLIDES.length - 1 ? 0 : p + 1))}
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlideIdx(i)}
                    className={`h-2 rounded-full cursor-pointer ${slideIdx === i ? 'w-8 bg-white' : 'w-2.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  aria-label="Search tasks"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks by title..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {['All', 'To do', 'In progress', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer ${statusTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <select
                aria-label="Filter by priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="mt-5 space-y-3">
              {visibleTasks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500">No tasks found</p>
                  <button type="button" onClick={() => { setSearch(''); setStatusTab('All'); setPriorityFilter('All'); }} className="mt-3 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold cursor-pointer">Reset Filters</button>
                </div>
              ) : (
                visibleTasks.map((task) => (
                  <article key={task.id} className="rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className={`text-base font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>{task.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                        <span className="font-medium">{task.priority}</span>
                        {task.category && <span className="inline-flex items-center gap-1"><Tag className="w-3 h-3" />{task.category}</span>}
                        {task.dueDate && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {task.dueDate}</span>}
                      </div>
                      {task.description && <p className="mt-2 text-sm text-slate-600">{task.description}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        aria-label={`Status for ${task.title}`}
                        value={task.status}
                        onChange={(e) => setTasks((prev) => prev.map((x) => (x.id === task.id ? { ...x, status: e.target.value } : x)))}
                        className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"
                      >
                        <option value="To do">To do</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button type="button" onClick={() => { setEditing(task); setModalOpen(true); }} className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium hover:bg-slate-50 cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />Edit
                      </button>
                      <button type="button" onClick={() => setToDelete(task)} className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      <TaskModal isOpen={modalOpen} editingTask={editing} onSave={handleSave} onClose={() => { setModalOpen(false); setEditing(null); }} />
      <DeleteModal task={toDelete} onConfirm={() => { setTasks((prev) => prev.filter((x) => x.id !== toDelete.id)); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </div>
  );
}
