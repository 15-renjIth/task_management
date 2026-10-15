import { useState } from 'react';
import {
  LayoutDashboard, CheckSquare, ChartNoAxesColumn, Users, Search, Bell,
  ChevronDown, Plus, MoreHorizontal, ArrowUpRight, CircleHelp, Menu, X,
} from 'lucide-react';

const NAV_ITEMS = [
  ['Dashboard', LayoutDashboard],
  ['Tasks', CheckSquare],
  ['Analytics', ChartNoAxesColumn],
  ['Team', Users],
];

export function Sidebar({ page, setPage, tasks, mobileNavOpen, onClose, onLogin }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigate = (name) => {
    setPage(name);
    onClose();
  };

  return (
    <>
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">O</div><span>organizo</span>
          <button className="icon mobile-close" aria-label="Close navigation" onClick={onClose}><X /></button>
        </div>
        <button className="workspace">
          <span className="workspace-logo">W</span>
          <span><b>Workspace</b><small>Free plan</small></span>
          <ChevronDown size={16} />
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {NAV_ITEMS.map(([name, Icon]) => (
            <button key={name} className={`nav-item ${page === name ? 'active' : ''}`} onClick={() => navigate(name)}>
              <Icon size={19} />{name}
              {name === 'Tasks' && <span className="nav-count">{tasks.filter((task) => task.status !== 'Completed').length}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-label project-label">YOUR PROJECTS <Plus size={15} /></div>
        <button className="project-item"><span className="dot purple-dot" />Product Launch</button>
        <button className="project-item"><span className="dot green-dot" />Website Redesign</button>
        <button className="project-item"><span className="dot orange-dot" />Mobile App</button>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={19} /></div>
            <b>Need a hand?</b><p>Visit our help center to get started.</p>
            <button onClick={() => window.alert('Help center is coming soon.')}>Get help <ArrowUpRight size={14} /></button>
          </div>
          <button className="profile" onClick={() => setProfileMenuOpen((open) => !open)}>
            <div className="avatar violet">AM</div>
            <span><b>Alex Morgan</b><small>alex@organizo.io</small></span>
            <MoreHorizontal size={19} />
          </button>
          {profileMenuOpen && <div className="profile-menu">
            <button onClick={onLogin}>Sign out / Login</button>
            <button onClick={() => window.alert('Settings coming soon')}>Settings</button>
          </div>}
        </div>
      </aside>
    </>
  );
}

export function Topbar({ page, query, onQueryChange, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="icon menu-button" aria-label="Toggle navigation" onClick={onMenuClick}><Menu /></button>
      <div className="crumb">Workspace <ChevronDown size={15} /><span className="slash">/</span><b>{page}</b></div>
      <div className="top-actions">
        <div className="searchbox">
          <Search size={17} />
          <input aria-label="Search tasks" placeholder="Search anything..." value={query} onChange={(event) => onQueryChange(event.target.value)} />
          <kbd>⌘ K</kbd>
        </div>
        <button className="icon notification" aria-label="Notifications" onClick={() => window.alert('You’re all caught up!')}><Bell size={19} /><i /></button>
        <div className="avatar violet small-avatar">AM</div>
      </div>
    </header>
  );
}

export function Footer() {
  return <footer>© 2024 Organizo Inc. <span>Made for focused teams <span className="heart">♥</span></span><a onClick={() => window.alert('Help center coming soon')}>Help center</a></footer>;
}
