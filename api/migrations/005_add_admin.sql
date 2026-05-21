-- Add admin user with proper role
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (email, hashed_password, role) VALUES
    ('admin@taurusai.io', '$2b$12$X7GK5qN8zL4pM2wR6vT9yOeJ3fH1sA0bC8dE5gI7jK9lM2nO4pQ6r', 'admin')
    ON CONFLICT (email) DO UPDATE SET role = 'admin';
