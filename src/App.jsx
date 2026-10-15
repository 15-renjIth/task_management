import { useMemo, useState } from 'react';
import { initialTasks } from './data.js';
import { Dashboard, Tasks, Analytics, Team } from './components/index.jsx';
import { Sidebar, Topbar, Footer } from './components/layout/AppLayout.jsx';
import { TaskModal, InviteModal } from './components/modals/ActionModals.jsx';
import LoginPage from './components/auth/LoginPage.jsx';

export default function App() {
  const [page, setPage] = useState('Dashboard');
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [view, setView] = useState('Board');
  const [period, setPeriod] = useState('This Week');
  const [login, setLogin] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return tasks;
    return tasks.filter((task) =>
      `${task.title} ${task.project} ${task.assignee}`.toLowerCase().includes(search),
    );
  }, [tasks, query]);

  const addTask = (form) => {
    const title = form.title.trim();
    if (!title) return;

    const task = {
      id: Date.now(),
      title,
      project: form.project || 'Product',
      priority: form.priority,
      status: 'To Do',
      assignee: 'JD',
      due: form.due || 'Nov 02',
      subtasks: '0/0',
      color: 'purple',
    };

    setTasks((currentTasks) => [...currentTasks, task]);
    setShowTaskModal(false);
    setPage('Tasks');
  };

  const toggleComplete = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'Completed' ? 'To Do' : 'Completed' }
          : task,
      ),
    );
  };

  if (login) return <LoginPage onSignIn={() => setLogin(false)} />;

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        tasks={tasks}
        mobileNavOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogin={() => setLogin(true)}
      />

      <main className="main">
        <Topbar page={page} query={query} onQueryChange={setQuery} onMenuClick={() => setMobileNavOpen((open) => !open)} />

        {page === 'Dashboard' && (
          <Dashboard
            tasks={tasks}
            setPage={setPage}
            onAdd={() => setShowTaskModal(true)}
            complete={toggleComplete}
          />
        )}
        {page === 'Tasks' && (
          <Tasks
            tasks={filteredTasks}
            allTasks={tasks}
            setTasks={setTasks}
            view={view}
            setView={setView}
            onAdd={() => setShowTaskModal(true)}
            complete={toggleComplete}
          />
        )}
        {page === 'Analytics' && (
          <Analytics tasks={tasks} period={period} setPeriod={setPeriod} />
        )}
        {page === 'Team' && <Team onInvite={() => setShowInviteModal(true)} />}

        <Footer />
      </main>

      {showTaskModal && (
        <TaskModal onClose={() => setShowTaskModal(false)} onSubmit={addTask} />
      )}
      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}
