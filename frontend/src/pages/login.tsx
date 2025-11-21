// src/pages/login.tsx

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // v5 uchun
import { Card, CardBody, Input, Button, Link, Checkbox, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context.tsx';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  // =========================================================================
  // XATO AYNAN SHU YERDA EDI - DOCTOR UCHUN SHART QO'SHILDI
  // =========================================================================
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        history.push('/admin/dashboard');
      } else if (user.role === 'doctor') { // <-- BU QATOR QO'SHILDI
        history.push('/doctor/dashboard');
      } else {
        history.push('/user/dashboard');
      }
    }
  }, [isAuthenticated, user, history]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      // useEffect o'zi yo'naltiradi
    } catch (error) {
      setError('Login yoki parol xato');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authIsLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900"><Spinner size="lg" color="primary" /></div>;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="w-full shadow-lg bg-white dark:bg-gray-800">
          <CardBody className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-2"><Icon icon="lucide:heart-pulse" className="text-primary text-4xl" /></div>
              <h1 className="text-2xl font-bold dark:text-white">Sog'liqni Tahlil</h1>
              <p className="text-gray-500 dark:text-gray-400">Davom etish uchun hisobingizga kiring</p>
            </div>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input label="Email" placeholder="doctor@gmail.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} startContent={<Icon icon="lucide:mail" />} required />
              <Input label="Parol" placeholder="doctor" type="password" value={password} onChange={(e) => setPassword(e.target.value)} startContent={<Icon icon="lucide:lock" />} required />
              <div className="flex items-center justify-between">
                <Checkbox defaultSelected size="sm" className="dark:text-gray-300">Eslab qolish</Checkbox>
                <Link href="#" size="sm">Parolni unutdingizmi?</Link>
              </div>
              <Button type="submit" color="primary" fullWidth disabled={isSubmitting}>{isSubmitting ? <Spinner size="sm" color="white" /> : 'Kirish'}</Button>
            </form>
            <div className="flex items-center gap-4">
              <Divider className="flex-1 dark:border-gray-600" /><p className="text-gray-500 dark:text-gray-400 text-sm">YOKI</p><Divider className="flex-1 dark:border-gray-600" />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="flat" startContent={<Icon icon="logos:google-icon" />} fullWidth>Google bilan kirish</Button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Hisobingiz yo'qmi? <Link href="/register" className="font-medium">Ro'yxatdan o'tish</Link></p>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Demo uchun ma'lumotlar:</p>
          <p>Admin: <span className="font-medium">admin@gmail.com</span> / <span className="font-medium">admin</span></p>
          <p>Shifokor: <span className="font-medium">doctor@gmail.com</span> / <span className="font-medium">doctor</span></p>
          <p>Foydalanuvchi: <span className="font-medium">user@gmail.com</span> / <span className="font-medium">user</span></p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;