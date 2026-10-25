
const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
const validStatuses = ['To Do', 'In Progress', 'Completed'];

const allowedFields = [
    'title',
    'project',
    'priority',
    'status',
    'assignee',
    'due_date',
];

function validateTask(body, partial = false) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'Request body must be an object';
    }

    if (!partial && (
        typeof body.title !== 'string' || !body.title.trim()
    )) {
        return 'Title is required';
    }

    if (body.title !== undefined && (
        typeof body.title !== 'string' || !body.title.trim()
    )) {
        return 'Title must not be empty';
    }

    if (body.priority !== undefined &&
        !validPriorities.includes(body.priority)) {
        return 'Invalid priority';
    }

    if (body.status !== undefined &&
        !validStatuses.includes(body.status)) {
        return 'Invalid status';
    }

    for (const field of ['project', 'assignee']) {
        if (body[field] !== undefined &&
            body[field] !== null &&
            typeof body[field] !== 'string') {
            return `${field} must be text or null`;
        }
    }

    if (body.due_date !== undefined &&
        body.due_date !== null &&
        body.due_date !== '' &&
        (typeof body.due_date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(body.due_date) ||
            Number.isNaN(Date.parse(`${body.due_date}T00:00:00Z`)) ||
            new Date(`${body.due_date}T00:00:00Z`)
                .toISOString().slice(0, 10) !== body.due_date)) {
        return 'due_date must be a valid YYYY-MM-DD date';
    }

    return null;
}

// GET /api/tasks — Read tasks
router.get('/', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('GET tasks:', error.message);
        res.status(500).json({ error: 'Unable to fetch tasks' });
    }
});

// POST /api/tasks — Create a task
router.post('/', async (req, res) => {
    const validationError = validateTask(req.body);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const task = {
        title: req.body.title.trim(),
        project: req.body.project ?? null,
        priority: req.body.priority ?? 'Medium',
        status: req.body.status ?? 'To Do',
        assignee: req.body.assignee ?? null,
        due_date: req.body.due_date || null,
    };

    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert(task)
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('POST task:', error.message);
        res.status(500).json({ error: 'Unable to create task' });
    }
});

// PUT /api/tasks/:id — Update a task
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    const validationError = validateTask(req.body, true);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const updates = {};

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updates[field] = req.body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }

    if (typeof updates.title === 'string') {
        updates.title = updates.title.trim();
    }

    if (updates.due_date === '') {
        updates.due_date = null;
    }

    try {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('PUT task:', error.message);
        res.status(500).json({ error: 'Unable to update task' });
    }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .select('id')
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(204).end();
    } catch (error) {
        console.error('DELETE task:', error.message);
        res.status(500).json({ error: 'Unable to delete task' });
    }
});

module.exports = router;
