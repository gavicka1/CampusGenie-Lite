import pool from '../config/db.js';

export const StudyTaskModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT id, task_name AS taskName, subject, DATE_FORMAT(planned_date, '%Y-%m-%d') AS plannedDate, priority, status 
       FROM study_tasks 
       ORDER BY planned_date ASC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, task_name AS taskName, subject, DATE_FORMAT(planned_date, '%Y-%m-%d') AS plannedDate, priority, status 
       FROM study_tasks 
       WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async create(data) {
    const { taskName, subject, plannedDate, priority = 'Medium', status = 'Pending' } = data;
    const [result] = await pool.query(
      `INSERT INTO study_tasks (task_name, subject, planned_date, priority, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [taskName, subject, plannedDate, priority, status]
    );
    return this.getById(result.insertId);
  },

  async update(id, updates) {
    const fieldMapping = {
      taskName: 'task_name',
      subject: 'subject',
      plannedDate: 'planned_date',
      priority: 'priority',
      status: 'status'
    };

    const fields = [];
    const values = [];

    for (const [key, dbColumn] of Object.entries(fieldMapping)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbColumn} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    await pool.query(
      `UPDATE study_tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM study_tasks WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};
