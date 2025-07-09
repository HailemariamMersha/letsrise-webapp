import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, assessment_id, question_number, selected_option } = req.body;
    if (!user_id || !assessment_id || !question_number || selected_option === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      await pool.query(
        'INSERT INTO assessment_results (user_id, assessment_id, question_number, selected_option) VALUES ($1, $2, $3, $4)',
        [user_id, assessment_id, question_number, selected_option]
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'GET') {
    const { user_id, assessment_id } = req.query;
    if (!user_id || !assessment_id) {
      return res.status(400).json({ error: 'Missing user_id or assessment_id' });
    }
    try {
      const { rows } = await pool.query(
        'SELECT * FROM assessment_results WHERE user_id = $1 AND assessment_id = $2 ORDER BY question_number',
        [user_id, assessment_id]
      );
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).end();
  }
} 