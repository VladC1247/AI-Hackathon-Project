// Mock database - in production, this would be a real backend
const users = [
  {
    id: 1,
    email: 'admin@hackathon.ro',
    password: 'admin123',
    name: 'Alex Traveler',
    bio: 'Explorer of hidden gems & coffee enthusiast ☕️',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  },
  {
    id: 2,
    email: 'user@test.com',
    password: 'test123',
    name: 'Maria Popescu',
    bio: 'Food lover and adventure seeker 🌍',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
];

export const authenticateUser = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getUserById = (id) => {
  const user = users.find(u => u.id === id);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const updateUser = (id, updates) => {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }
  return null;
};

export const createUser = (name, email, password) => {
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    bio: 'New explorer 🌍',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  };

  users.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
};
