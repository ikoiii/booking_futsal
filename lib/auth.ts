// Authentication helper functions
import { dbHelpers } from './database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  nama: string;
  email: string;
  password?: string; // Make password optional
  no_telp: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Register new user
export async function registerUser(userData: {
  nama: string;
  email: string;
  password: string;
  no_telp: string;
}): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await dbHelpers.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user in database
    const result = await dbHelpers.createUser({
      nama: userData.nama,
      email: userData.email,
      password: hashedPassword,
      no_telp: userData.no_telp
    });

    // Get the created user
    const newUser = await dbHelpers.getUserByEmail(userData.email);
    return newUser as User;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    // Get user by email
    const user = await dbHelpers.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password || '');
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user as User;
    return userWithoutPassword;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = await dbHelpers.getUserById(id);
    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user as User;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user failed:', error);
    throw error;
  }
}

// Get user from token (for API authentication)
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    // For now, we'll use a simple approach
    // In production, you should use JWT or similar
    const userId = parseInt(token);
    if (isNaN(userId)) {
      return null;
    }
    
    return await getUserById(userId);
  } catch (error) {
    console.error('Get user from token failed:', error);
    return null;
  }
}

// Authentication object for export
export const auth = {
  getUserFromToken,
  getUserById,
  loginUser,
  registerUser,
  updateUser
};

// Update user
export async function updateUser(id: number, userData: Partial<{
  nama: string;
  email: string;
  password: string;
  no_telp: string;
}>): Promise<User | null> {
  try {
    // Check if email is being changed and already exists
    if (userData.email) {
      const existingUser = await dbHelpers.getUserByEmail(userData.email);
      if (existingUser && (existingUser as User).id !== id) {
        throw new Error('Email already exists');
      }
    }

    // Hash password if provided
    let updateData = { ...userData };
    if (userData.password) {
      updateData.password = await hashPassword(userData.password);
    }

    // Update user in database
    await dbHelpers.updateUser(id, updateData);

    // Get updated user
    const updatedUser = await getUserById(id);
    return updatedUser;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
}
