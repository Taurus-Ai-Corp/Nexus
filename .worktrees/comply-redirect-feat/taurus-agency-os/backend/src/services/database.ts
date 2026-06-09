import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    'postgresql://postgres:postgres_password@localhost:5432/taurus_agency'
});

export const initDatabase = async () => {
  // Create tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agencies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      agency_id INTEGER REFERENCES agencies(id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id),
      plan VARCHAR(50) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      start_date DATE DEFAULT CURRENT_DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_tasks (
      id SERIAL PRIMARY KEY,
      agency_id INTEGER REFERENCES agencies(id),
      client_id INTEGER REFERENCES clients(id),
      agent_type VARCHAR(50) NOT NULL,
      task_type VARCHAR(100) NOT NULL,
      input_data JSONB,
      output_data JSONB,
      status VARCHAR(20) DEFAULT 'pending',
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS heiro_commits (
      id SERIAL PRIMARY KEY,
      agency_id INTEGER REFERENCES agencies(id),
      commit_hash VARCHAR(255) UNIQUE NOT NULL,
      data_hash VARCHAR(255),
      description TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables initialized');
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  console.log('Executed query', { text: text.substring(0, 50), duration: Date.now() - start });
  return res;
};

export const getClient = async () => {
  return pool;
};

export default { query, getClient };