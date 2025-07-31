import { Router } from 'express';
import { pool } from '../db';
const router = Router();

/* POST /api/history  {expression:"2+2"}  -> {id, expression, value, created_at} */
router.post('/', async (req, res) => {
  const { expression } = req.body;
  if (!expression) return res.status(400).json({ error: 'No expression' });

  // Validate expression contains only allowed characters (numbers, operators, parentheses, spaces, decimal points)
  const validExpression = /^[0-9+\-*/().\s]+$/.test(expression);
  if (!validExpression) {
    return res.status(400).json({ error: 'Invalid expression format' });
  }

  // Use PostgreSQL to evaluate the mathematical expression safely
  try {
    const calc = await pool.query(`SELECT (${expression}) AS value`);
    const value = calc.rows[0].value;
    const insert = await pool.query(
      'INSERT INTO history(expression,value) VALUES($1,$2) RETURNING *',
      [expression, value]
    );
    res.json(insert.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* GET /api/history -> niz poslednjih zapisa */
router.get('/', async (_, res) => {
  const { rows } = await pool.query('SELECT * FROM history ORDER BY created_at DESC LIMIT 20');
  res.json(rows);
});

export default router;
