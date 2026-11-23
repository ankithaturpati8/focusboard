import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function TaskModal({ isOpen, editingTask, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [status, setStatus] = useState('To do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'General');
      setStatus(editingTask.status || 'To do');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Development');
      setStatus('To do');
      setPriority('Medium');
      setDueDate(new Date().toISOString().split('T'));
    }
    setError('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required and cannot be blank.');
      return;
    }
    onSave({
      id: editingTask ? editingTask.id : String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      status,
      priority,
      dueDate,
    });
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button type="button" aria-label="Close modal" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="t-title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              id="t-title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="Enter task title"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
            {error && <p role="alert" className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
          </div>

          <div>
            <label htmlFor="t-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              id="t-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select id="t-status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm">
                <option value="To do">To do</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="t-priority" className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select id="t-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input id="t-category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label htmlFor="t-due" className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input id="t-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold cursor-pointer">{editingTask ? 'Update Task' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteModal({ task, onConfirm, onCancel }) {
  if (!task) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Delete Task?</h2>
        <p className="text-sm text-slate-600">Are you sure you want to delete <strong>"{task.title}"</strong>?</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium cursor-pointer">Cancel</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold cursor-pointer">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}
