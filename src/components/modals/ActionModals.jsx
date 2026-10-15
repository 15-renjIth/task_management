import { useState } from 'react';
import { Plus, X, Mail } from 'lucide-react';

const EMPTY_FORM = { title: '', priority: 'Medium', due: '', project: 'Product' };

export function TaskModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (form.title.trim()) onSubmit(form);
  };

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head"><div><h2>Create new task</h2><p className="muted">Add a task to your workspace.</p></div><button type="button" className="icon" aria-label="Close" onClick={onClose}><X /></button></div>
        <label htmlFor="task-title">Task title</label>
        <input id="task-title" className="field" autoFocus required placeholder="e.g. Prepare project kickoff" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
        <div className="form-row">
          <div><label htmlFor="task-priority">Priority</label><select id="task-priority" className="field" value={form.priority} onChange={(event) => updateField('priority', event.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
          <div><label htmlFor="task-due">Due date</label><input id="task-due" className="field" type="date" value={form.due} onChange={(event) => updateField('due', event.target.value)} /></div>
        </div>
        <label htmlFor="task-project">Project</label>
        <select id="task-project" className="field" value={form.project} onChange={(event) => updateField('project', event.target.value)}><option>Product</option><option>Design</option><option>Frontend</option><option>Backend</option><option>Research</option></select>
        <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button type="submit" className="primary"><Plus size={16} /> Create task</button></div>
      </form>
    </div>
  );
}

export function InviteModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const submit = (event) => {
    event.preventDefault();
    onClose();
    window.alert(`Invitation flow is a UI demo. Connect a backend to invite ${email} as ${role}.`);
  };

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head"><div><h2>Invite teammate</h2><p className="muted">Give your team access to the workspace.</p></div><button type="button" className="icon" aria-label="Close" onClick={onClose}><X /></button></div>
        <label htmlFor="invite-email">Work email</label><input id="invite-email" className="field" placeholder="teammate@company.com" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="invite-role">Workspace access role</label><select id="invite-role" className="field" value={role} onChange={(event) => setRole(event.target.value)}><option>Editor</option><option>Admin</option><option>Viewer</option></select>
        <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button type="submit" className="primary"><Mail size={16} /> Send invitation</button></div>
      </form>
    </div>
  );
}
