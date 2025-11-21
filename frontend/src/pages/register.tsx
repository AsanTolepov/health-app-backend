// src/pages/register.tsx

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Input, Button, Link, Checkbox, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context.tsx';
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const history = useHistory();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Parollar mos kelmadi');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      history.push('/user/dashboard');
    } catch (err) {
      setError('Ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg bg-white dark:bg-gray-800">
          <CardBody className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon icon="lucide:heart-pulse" className="text-primary text-4xl" />
                </div>
              </div>
              <h1 className="text-2xl font-bold dark:text-white">Hisob Yaratish</h1>
              <p className="text-gray-500 dark:text-gray-400">Boshlash uchun ro'yxatdan o'ting</p>
            </div>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <Input
                label="To'liq ism"
                placeholder="Ismingizni kiriting"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startContent={<Icon icon="lucide:user" className="text-gray-400" />}
                required
              />
              
              <Input
                label="Email"
                placeholder="Email manzilingizni kiriting"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Icon icon="lucide:mail" className="text-gray-400" />}
                required
              />
              
              <Input
                label="Parol"
                placeholder="Parol yarating"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Icon icon="lucide:lock" className="text-gray-400" />}
                required
              />
              
              <Input
                label="Parolni tasdiqlang"
                placeholder="Parolni qayta kiriting"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                startContent={<Icon icon="lucide:lock" className="text-gray-400" />}
                required
              />
              
              <Checkbox size="sm" required className="dark:text-gray-300">
                Men <Link href="#" size="sm">Foydalanish shartlariga</Link> va <Link href="#" size="sm">Maxfiylik siyosatiga</Link> roziman
              </Checkbox>
              
              <Button 
                type="submit" 
                color="primary" 
                fullWidth 
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner size="sm" color="white" /> : 'Hisob Yaratish'}
              </Button>
            </form>
            
            <div className="flex items-center gap-4">
              <Divider className="flex-1 dark:border-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">YOKI</p>
              <Divider className="flex-1 dark:border-gray-600" />
            </div>
            
            <Button 
              variant="flat" 
              startContent={<Icon icon="logos:google-icon" className="text-lg" />}
              fullWidth
            >
              Google bilan ro'yxatdan o'tish
            </Button>
              
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hisobingiz bormi? <Link href="/login" className="font-medium">Kirish</Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;