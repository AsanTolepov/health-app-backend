// src/components/layout/user-layout.tsx

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context.tsx';
import { useTheme } from '../../contexts/theme-context.tsx'; // <-- YANGI
import { motion } from 'framer-motion';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme(); // <-- Global state'dan olinadi
  
  const handleLogout = () => { logout(); history.push('/login'); };
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
    { path: '/user/chat', label: 'Chat', icon: 'lucide:message-circle' },
    { path: '/user/calendar', label: 'Calendar', icon: 'lucide:calendar' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar maxWidth="xl" isBordered className="bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
        <NavbarBrand>
          <div onClick={() => history.push('/user/dashboard')} className="flex items-center gap-2 cursor-pointer">
            <Icon icon="lucide:heart-pulse" className="text-primary text-3xl" />
            <p className="font-bold text-inherit text-xl dark:text-white">Sog'liqni Tahlil</p>
          </div>
        </NavbarBrand>
        
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.path} isActive={isActive(item.path)}>
              <div onClick={() => history.push(item.path)} className={`flex items-center gap-2 cursor-pointer transition-colors ${isActive(item.path) ? 'text-primary font-semibold' : 'text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary'}`}>
                <Icon icon={item.icon} className="text-xl" />
                <span className="text-md">{item.label}</span>
              </div>
            </NavbarItem>
          ))}
        </NavbarContent>
        
        <NavbarContent justify="end" className="flex items-center gap-4">
          <Badge content="3" color="danger" shape="circle">
            <Button isIconOnly variant="light" aria-label="Notifications"><Icon icon="lucide:bell" className="text-2xl text-gray-600 dark:text-gray-300" /></Button>
          </Badge>
          
          <Dropdown>
            <DropdownTrigger><Button variant="light" className="dark:text-white" endContent={<Icon icon="lucide:chevron-down" />}>O'zbek</Button></DropdownTrigger>
            <DropdownMenu aria-label="Language selection"><DropdownItem key="uz">O'zbek</DropdownItem><DropdownItem key="en">English</DropdownItem><DropdownItem key="ru">Русский</DropdownItem></DropdownMenu>
          </Dropdown>
          
          <Button isIconOnly variant="light" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon icon={isDarkMode ? 'lucide:sun' : 'lucide:moon'} className="text-2xl text-gray-600 dark:text-gray-300" />
          </Button>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger><Avatar as="button" isBordered color="primary" size="md" src={user?.avatar || ''} /></DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="profile" startContent={<Icon icon="lucide:user" />} onClick={() => history.push('/user/profile')} description={user?.email}>Mening Profilim</DropdownItem>
              <DropdownItem key="settings" startContent={<Icon icon="lucide:settings" />} onClick={() => history.push('/user/settings')}>Sozlamalar</DropdownItem>
              <DropdownItem key="help" startContent={<Icon icon="lucide:help-circle" />} onClick={() => history.push('/user/help')}>Yordam</DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<Icon icon="lucide:log-out" />} onClick={handleLogout}>Chiqish</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      
      <main className="flex-grow p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{children}</motion.div>
      </main>
    </div>
  );
};

export default UserLayout;