import express from 'express';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key';


let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn(
    'OpenAI API key not found. Chatbot functionality is temporarily disabled.'
  );
}

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database(join(__dirname, 'insureguard.db'));

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS insurance_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      base_price REAL NOT NULL,
      features TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

 
  db.run(`
    CREATE TABLE IF NOT EXISTS user_insurance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      plan_type TEXT NOT NULL,
      monthly_price REAL NOT NULL,
      status TEXT DEFAULT 'active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES insurance_products(id)
    )
  `);

 
  db.all('SELECT COUNT(*) as count FROM insurance_products', (err, rows) => {
    if (rows && rows[0].count === 0) {
      db.run(`
        INSERT INTO insurance_products (name, category, description, base_price, features) VALUES
        ('Auto Coverage', 'auto', 'Complete protection for your vehicle', 20, 'Collision coverage,Comprehensive coverage,Liability protection'),
        ('Life Insurance', 'life', 'Secure your family''s future', 30, 'Term life coverage,Beneficiary protection,Accidental death benefit'),
        ('Travel Insurance', 'travel', 'Protection for your journeys', 15, 'Trip cancellation,Emergency medical,Baggage coverage'),
        ('Home Insurance', 'home', 'Protect your home and belongings', 40, 'Property coverage,Liability protection,Personal property coverage')
      `);
    }
  });
});


app.post('/api/chat', async (req, res) => {
  if (!openai) {
    return res
      .status(503)
      .json({ error: 'Chatbot temporarily unavailable. Please provide an API key.' });
  }

  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI request failed:', err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});


app.delete('/api/insurance/policies/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.run(
      'DELETE FROM user_insurance WHERE id = ? AND user_id = ?',
      [id, decoded.userId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete policy' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Policy not found' });
        }

        res.status(204).send();
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
   
    const hashedPassword = await bcryptjs.hash(password, 10);

    
    db.run(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, hashedPassword, full_name],
      function (err) {
        if (err) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        
        const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });

      
        db.get(
          'SELECT id, email, full_name, created_at FROM users WHERE id = ?',
          [this.lastID],
          (err, user) => {
            if (err) {
              return res.status(500).json({ error: 'User fetch failed' });
            }

        
            res.json({
              user,
              token,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});



app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
      token,
    });
  });
});

app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.get('SELECT id, email, full_name FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'User not found' });
      }
      res.json({ user });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/insurance/products', (req, res) => {
  db.all('SELECT * FROM insurance_products', (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(
      products.map((p) => ({
        ...p,
        features: p.features.split(','),
      }))
    );
  });
});

app.post('/api/insurance/purchase', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { product_id, plan_type, monthly_price } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.run(
      'INSERT INTO user_insurance (user_id, product_id, plan_type, monthly_price) VALUES (?, ?, ?, ?)',
      [decoded.userId, product_id, plan_type, monthly_price],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Purchase failed' });
        }
        res.json({ id: this.lastID, user_id: decoded.userId, product_id, plan_type, monthly_price });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/insurance/my-policies', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.all(
      `SELECT ui.*, ip.name as product_name, ip.category FROM user_insurance ui
       JOIN insurance_products ip ON ui.product_id = ip.id
       WHERE ui.user_id = ?`,
      [decoded.userId],
      (err, policies) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch policies' });
        }
        res.json(policies || []);
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
