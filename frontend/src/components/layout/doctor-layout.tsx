// src/components/layout/doctor-layout.tsx

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context.tsx';
import { useTheme } from '../../contexts/theme-context.tsx';
import { motion } from 'framer-motion';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  const { user, updateUser, logout } = useAuth();
  const history = useHistory();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', avatar: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, avatar: user.avatar || '' });
    }
  }, [user]);

  const handleLogout = () => { logout(); history.push('/login'); };

  const handleProfileUpdate = () => {
    if (user) {
        updateUser({ name: formData.name, avatar: formData.avatar });
    }
    setIsEditProfileModalOpen(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar maxWidth="xl" isBordered className="bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:stethoscope" className="text-primary text-3xl" />
            <p className="font-bold text-inherit text-xl dark:text-white">Shifokor Paneli</p>
          </div>
        </NavbarBrand>
        
        <NavbarContent justify="end" className="flex items-center gap-4">
          <Badge content="5" color="danger" shape="circle">
            <Button isIconOnly variant="light" aria-label="Notifications">
              <Icon icon="lucide:bell" className="text-2xl text-gray-600 dark:text-gray-300" />
            </Button>
          </Badge>
          
          <Button isIconOnly variant="light" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon icon={isDarkMode ? 'lucide:sun' : 'lucide:moon'} className="text-2xl text-gray-600 dark:text-gray-300" />
          </Button>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar as="button" isBordered color="primary" size="md" src={user?.avatar || ''} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Doctor menu">
              <DropdownItem key="profile" startContent={<Icon icon="lucide:user-cog" />} onPress={() => setIsEditProfileModalOpen(true)} description={user?.email}>
                Profilni Tahrirlash
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<Icon icon="lucide:log-out" />} onClick={handleLogout}>
                Chiqish
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      
      <main className="flex-grow p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {children}
        </motion.div>
      </main>

      {/* Profilni Tahrirlash Modali */}
      <Modal isOpen={isEditProfileModalOpen} onOpenChange={setIsEditProfileModalOpen}>
        <ModalContent className="dark:bg-gray-800">
          <ModalHeader className="dark:text-white">Profilni Tahrirlash</ModalHeader>
          <ModalBody><div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <Avatar src={formData.avatar} className="w-24 h-24" />
            </div>
            <Input type="file" accept="image/*" label="Rasmni o'zgartirish" onChange={handleAvatarUpload} />
            <Input label="Ism" value={formData.name} onValueChange={(v) => setFormData({...formData, name: v})} />
            <Divider className="my-2 dark:border-gray-700" />
            <h3 className="font-semibold dark:text-gray-200">Parolni o'zgartirish</h3>
            <Input type="password" label="Joriy Parol" />
            <Input type="password" label="Yangi Parol" />
            <Input type="password" label="Yangi Parolni Tasdiqlang" />
          </div></ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsEditProfileModalOpen(false)}>Bekor qilish</Button>
            <Button color="primary" onPress={handleProfileUpdate}>Saqlash</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DoctorLayout;