// src/contexts/auth-context.tsx

// --- XATO AYNAN SHU YERDA EDI, ENDI TO'G'RILANDI ---
import React, { useState, useEffect, createContext, useContext } from 'react';

// Foydalanuvchi rollari
export type UserRole = 'user' | 'doctor' | 'admin';

// Foydalanuvchi interfeysi
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Auth Context interfeysi
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

// Auth Context yaratish
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API chaqiruvlari (Sun'iy ma'lumotlar)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Serverga so'rov yuborishni simulyatsiya qilish
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 1. Adminni tekshirish
  if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin') {
    return {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: 'admin',
      avatar: `https://www.shutterstock.com/image-vector/man-working-on-laptop-flat-260nw-1083960971.jpg`
    };
  }
  
  // 2. Shifokorni tekshirish
  if (email.toLowerCase() === 'doctor@gmail.com' && password === 'doctor') {
    return { 
      id: 'doc-007', 
      name: 'Dr. Aliyev', 
      email: 'doctor@gmail.com', 
      role: 'doctor', 
      avatar: `https://www.shutterstock.com/image-illustration/vector-medical-icon-doctor-image-600nw-1635128152.jpg` 
    };
  }

  // 3. Qolgan barcha holatlarda oddiy foydalanuvchi sifatida kirish
  return {
    id: 'user-123',
    name: email.split('@')[0],
    email,
    role: 'user',
    avatar: `https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg`
  };
};

const mockRegister = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'new-user-456',
    name,
    email,
    role: 'user',
    avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${Math.floor(Math.random() * 20)}`
  };
};

// Auth Provider komponenti
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dastur ishga tushganda localStorage'ni tekshirish
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Tizimga kirish funksiyasi
  const login = async (email: string, password: string) => {
    const loggedInUser = await mockLogin(email, password);
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  // Ro'yxatdan o'tish funksiyasi
  const register = async (name: string, email: string, password: string) => {
    const registeredUser = await mockRegister(name, email, password);
    setUser(registeredUser);
    localStorage.setItem('user', JSON.stringify(registeredUser));
  };

  // Tizimdan chiqish funksiyasi
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Foydalanuvchi ma'lumotlarini (ism, rasm) yangilash funksiyasi
  const updateUser = (updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  // Barcha funksiya va qiymatlarni Context'ga uzatish
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// `useAuth` custom hook'i
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};