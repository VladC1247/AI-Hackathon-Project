import * as SQLite from 'expo-sqlite';

// Initialize database using the modern synchronous API
const db = SQLite.openDatabaseSync('hackathon.db');

export const initDatabase = async () => {
  try {
    // Enable WAL mode and create tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        bio TEXT,
        avatar TEXT
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        location_id INTEGER,
        rating REAL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        location_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, location_id)
      );
    `);

    console.log('Database initialized');

    // Check if admin exists
    const adminEmail = 'admin@hackathon.ro';
    const admin = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (!admin) {
      await db.runAsync(
        'INSERT INTO users (name, email, password, bio, avatar) VALUES (?, ?, ?, ?, ?)',
        [
          'Alex Traveler',
          adminEmail,
          'admin123',
          'Explorer of hidden gems & coffee enthusiast ☕️',
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
        ]
      );
      console.log('Admin user created');
      
      // Get admin ID
      const adminUser = await db.getFirstAsync('SELECT id FROM users WHERE email = ?', [adminEmail]);
      
      // Seed some dummy data for admin
      if (adminUser) {
        await db.runAsync('INSERT OR IGNORE INTO favorites (user_id, location_id) VALUES (?, ?)', [adminUser.id, 1]);
        await db.runAsync('INSERT OR IGNORE INTO favorites (user_id, location_id) VALUES (?, ?)', [adminUser.id, 2]);
        await db.runAsync('INSERT OR IGNORE INTO reviews (user_id, location_id, rating, comment) VALUES (?, ?, ?, ?)', [adminUser.id, 1, 5, 'Amazing place!']);
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
};

export const getUserById = async (id) => {
  try {
    const user = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [id]);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    console.error('Get user failed:', error);
    return null;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    if (fields.length === 0) return null;

    await db.runAsync(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    
    return await getUserById(id);
  } catch (error) {
    console.error('Update user failed:', error);
    return null;
  }
};

export const createUser = async (name, email, password, bio = '', avatar = '') => {
  try {
    // Check if email exists
    const existing = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return { success: false, error: 'Email already registered' };
    }

    const result = await db.runAsync(
      'INSERT INTO users (name, email, password, bio, avatar) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, bio, avatar]
    );

    const newUser = await getUserById(result.lastInsertRowId);
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Create user failed:', error);
    return { success: false, error: 'Database error' };
  }
};

// User stats
export const getUserStats = async (userId) => {
  try {
    const reviews = await db.getFirstAsync('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?', [userId]);
    const favorites = await db.getFirstAsync('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?', [userId]);

    return {
      reviews: reviews?.count || 0,
      favorites: favorites?.count || 0
    };
  } catch (error) {
    console.error('Get user stats failed:', error);
    return { reviews: 0, favorites: 0 };
  }
};

// Favorites
export const toggleFavorite = async (userId, locationId) => {
  try {
    const existing = await db.getFirstAsync(
      'SELECT * FROM favorites WHERE user_id = ? AND location_id = ?',
      [userId, locationId]
    );

    if (existing) {
      await db.runAsync(
        'DELETE FROM favorites WHERE user_id = ? AND location_id = ?',
        [userId, locationId]
      );
      return false; // Removed
    } else {
      await db.runAsync(
        'INSERT INTO favorites (user_id, location_id) VALUES (?, ?)',
        [userId, locationId]
      );
      return true; // Added
    }
  } catch (error) {
    console.error('Toggle favorite failed:', error);
    return null;
  }
};

export const checkFavorite = async (userId, locationId) => {
  try {
    const existing = await db.getFirstAsync(
      'SELECT * FROM favorites WHERE user_id = ? AND location_id = ?',
      [userId, locationId]
    );
    return !!existing;
  } catch (error) {
    console.error('Check favorite failed:', error);
    return false;
  }
};

// Reviews
export const addReview = async (userId, locationId, rating, comment) => {
  try {
    await db.runAsync(
      'INSERT INTO reviews (user_id, location_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, locationId, rating, comment]
    );
    return true;
  } catch (error) {
    console.error('Add review failed:', error);
    return false;
  }
};

export const getLocationReviews = async (locationId) => {
  try {
    const reviews = await db.getAllAsync(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.location_id = ? 
       ORDER BY r.created_at DESC`,
      [locationId]
    );
    return reviews;
  } catch (error) {
    console.error('Get location reviews failed:', error);
    return [];
  }
};
