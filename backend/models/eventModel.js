import pool from '../config/db.js';

export const EventModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') AS date, location, description, category, registered 
       FROM events 
       ORDER BY date ASC`
    );
    return rows.map(row => ({ ...row, registered: !!row.registered }));
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') AS date, location, description, category, registered 
       FROM events 
       WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? { ...rows[0], registered: !!rows[0].registered } : null;
  },

  async create(data) {
    const { title, date, location, description, category = 'General' } = data;
    const [result] = await pool.query(
      `INSERT INTO events (title, date, location, description, category, registered) 
       VALUES (?, ?, ?, ?, ?, FALSE)`,
      [title, date, location, description, category]
    );
    return this.getById(result.insertId);
  },

  async update(id, updates) {
    const allowedKeys = ['title', 'date', 'location', 'description', 'category', 'registered'];
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
      `UPDATE events SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM events WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  async toggleRegistration(id, userName = 'Alex Rivera') {
    const event = await this.getById(id);
    if (!event) return null;

    const newStatus = !event.registered;

    await pool.query(
      `UPDATE events SET registered = ? WHERE id = ?`,
      [newStatus, id]
    );

    if (newStatus) {
      await pool.query(
        `INSERT IGNORE INTO event_registrations (event_id, user_name) VALUES (?, ?)`,
        [id, userName]
      );
    } else {
      await pool.query(
        `DELETE FROM event_registrations WHERE event_id = ? AND user_name = ?`,
        [id, userName]
      );
    }

    return this.getById(id);
  }
};
