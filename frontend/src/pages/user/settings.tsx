// src/pages/user/settings.tsx

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Divider, Switch, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    news: false,
    messages: true,
  });

  const menuItems = [
    { key: 'account', label: 'Hisob', icon: 'lucide:user' },
    { key: 'notifications', label: 'Bildirishnomalar', icon: 'lucide:bell' },
    { key: 'security', label: 'Xavfsizlik', icon: 'lucide:shield' },
    { key: 'language', label: 'Til va Mintaqa', icon: 'lucide:globe' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Hisob Sozlamalari</h2>
            <Card className="dark:bg-gray-800">
              <CardBody className="space-y-4">
                <div>
                  <h3 className="font-medium dark:text-gray-200">Profil ma'lumotlari</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Shaxsiy ma'lumotlaringizni o'zgartirish uchun profil sahifasiga o'ting.</p>
                  <Button as="a" href="/user/profile" color="primary" variant="flat">Profilni Tahrirlash</Button>
                </div>
                <Divider className="dark:border-gray-700" />
                <div>
                  <h3 className="font-medium dark:text-gray-200">Hisobni o'chirish</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Bu amal qaytarib bo'lmaydi. Barcha ma'lumotlaringiz butunlay o'chiriladi.</p>
                  <Button color="danger" variant="bordered">Hisobni O'chirish</Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Bildirishnomalar</h2>
            <Card className="dark:bg-gray-800">
              <CardBody className="space-y-4 divide-y dark:divide-gray-700">
                <div className="flex justify-between items-center pt-2">
                  <div><h3 className="font-medium dark:text-gray-200">Uchrashuv eslatmalari</h3><p className="text-sm text-gray-500 dark:text-gray-400">Yaqinlashayotgan uchrashuvlar haqida xabar.</p></div>
                  <Switch isSelected={notifications.appointments} onChange={() => setNotifications(p => ({...p, appointments: !p.appointments}))} />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div><h3 className="font-medium dark:text-gray-200">Dori qabul qilish vaqti</h3><p className="text-sm text-gray-500 dark:text-gray-400">Dori ichish kerakligi haqida eslatma.</p></div>
                  <Switch isSelected={notifications.medications} onChange={() => setNotifications(p => ({...p, medications: !p.medications}))} />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div><h3 className="font-medium dark:text-gray-200">Yangiliklar va takliflar</h3><p className="text-sm text-gray-500 dark:text-gray-400">Platforma yangiliklari haqida ma'lumot.</p></div>
                  <Switch isSelected={notifications.news} onChange={() => setNotifications(p => ({...p, news: !p.news}))} />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Xavfsizlik</h2>
            <Card className="dark:bg-gray-800">
              <CardBody className="space-y-4">
                <h3 className="font-medium dark:text-gray-200">Parolni o'zgartirish</h3>
                <Input type="password" label="Joriy parol" />
                <Input type="password" label="Yangi parol" />
                <Input type="password" label="Yangi parolni tasdiqlang" />
                <Button color="primary">Parolni Yangilash</Button>
              </CardBody>
            </Card>
          </motion.div>
        );
       case 'language':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Til va Mintaqa</h2>
            <Card className="dark:bg-gray-800">
              <CardBody className="space-y-4">
                <Select label="Interfeys tili" defaultSelectedKeys={["uz"]}>
                    <SelectItem key="uz">O'zbek (Lotin)</SelectItem>
                    <SelectItem key="en">English (US)</SelectItem>
                    <SelectItem key="ru">Русский</SelectItem>
                </Select>
                 <Select label="Vaqt mintaqasi" defaultSelectedKeys={["tashkent"]}>
                    <SelectItem key="tashkent">Asia/Tashkent (GMT+5)</SelectItem>
                </Select>
              </CardBody>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold dark:text-white">Sozlamalar</h1>
        <p className="text-gray-500 dark:text-gray-400">Hisobingiz va platforma sozlamalarini boshqaring</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Chap menyu */}
        <Card className="md:col-span-1 h-fit bg-white dark:bg-gray-800">
          <CardBody className="p-2">
            <div className="flex flex-col gap-1">
              {menuItems.map(item => (
                <Button
                  key={item.key}
                  fullWidth
                  justify="start"
                  variant={activeSection === item.key ? 'solid' : 'light'}
                  color={activeSection === item.key ? 'primary' : 'default'}
                  startContent={<Icon icon={item.icon} className="text-lg" />}
                  onPress={() => setActiveSection(item.key)}
                  className="p-6 text-md dark:text-gray-200"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* O'ng kontent */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;