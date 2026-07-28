import pool from '../config/db.js';

export const AssignmentModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT id, title, subject, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline, priority, status, description 
       FROM assignments 
       ORDER BY deadline ASC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, title, subject, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline, priority, status, description 
       FROM assignments 
       WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async create(data) {
    const { title, subject, deadline, priority = 'Medium', status = 'Pending', description = '' } = data;
    const [result] = await pool.query(
      `INSERT INTO assignments (title, subject, deadline, priority, status, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, subject, deadline, priority, status, description]
    );
    return this.getById(result.insertId);
  },

  async update(id, updates) {
    const allowedKeys = ['title', 'subject', 'deadline', 'priority', 'status', 'description'];
    const fields = [];
    const values = [];

    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    await pool.query(
      `UPDATE assignments SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM assignments WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};
