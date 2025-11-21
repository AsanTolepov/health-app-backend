// src/pages/doctor/dashboard.tsx

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Avatar, Badge, Divider, Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context';
import { motion } from 'framer-motion';
import { useChat } from '../../contexts/chat-hook';

const appointments = [
    { id: 'user-123', patientName: 'Lola Turdiyeva', time: '14:00 - 14:30', type: 'video', status: 'upcoming', avatar: 'https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg', reason: 'Yurakdagi og\'riq' },
    { id: 'user-456', patientName: 'Zarina Aliyeva', time: '15:00 - 15:15', type: 'chat', status: 'upcoming', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2', reason: 'Retseptni yangilash' },
    { id: 'user-789', patientName: 'Bekzod Karimov', time: '16:30 - 17:00', type: 'video', status: 'upcoming', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3', reason: 'Qon bosimi nazorati' },
    { id: 'user-abc', patientName: 'Faruh Yoldoshov', time: '11:00 - 11:30', type: 'video', status: 'completed', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=4', reason: 'Umumiy tekshiruv' },
    { id: 'user-def', patientName: 'Jasur Berdiyorov', time: '10:00 - 10:15', type: 'chat', status: 'completed', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=5', reason: 'Tahlil natijalari' },
];

const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed'>('upcoming');
    
    const [videoCallOpen, setVideoCallOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [activeChatRoomId, setActiveChatRoomId] = useState<string>('');
    
    const { messages, sendMessage } = useChat(activeChatRoomId);

    const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
    const completedAppointments = appointments.filter(a => a.status === 'completed');
    const appointmentsToShow = selectedTab === 'upcoming' ? upcomingAppointments : completedAppointments;

    const handleStartVideoCall = (patient: any) => {
        setSelectedPatient(patient);
        setVideoCallOpen(true);
    };

    const handleStartChat = (patient: any) => {
        if (!user) return;
        const chatRoomId = [user.id, patient.id].sort().join('-');
        
        setSelectedPatient(patient);
        setActiveChatRoomId(chatRoomId);
        setChatOpen(true);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold dark:text-white">Salom, {user?.name}!</h1>
                <p className="text-gray-500 dark:text-gray-400">Bugungi ish jadvalingiz va bemorlar ro'yxatiga xush kelibsiz.</p>
            </div>

            {/* ... (Bu qismda o'zgarish yo'q, shuning uchun qisqartirildi) ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-gray-800"><CardBody className="text-center p-6"><Icon icon="lucide:calendar-check" className="text-4xl text-primary mx-auto mb-2" /><h3 className="text-3xl font-bold dark:text-white">{upcomingAppointments.length}</h3><p className="text-gray-500 dark:text-gray-400">Kutilayotgan uchrashuvlar</p></CardBody></Card>
                <Card className="bg-white dark:bg-gray-800"><CardBody className="text-center p-6"><Icon icon="lucide:users" className="text-4xl text-green-500 mx-auto mb-2" /><h3 className="text-3xl font-bold dark:text-white">124</h3><p className="text-gray-500 dark:text-gray-400">Jami bemorlar</p></CardBody></Card>
                <Card className="bg-white dark:bg-gray-800"><CardBody className="text-center p-6"><Icon icon="lucide:message-square" className="text-4xl text-yellow-500 mx-auto mb-2" /><h3 className="text-3xl font-bold dark:text-white">5</h3><p className="text-gray-500 dark:text-gray-400">Yangi xabarlar</p></CardBody></Card>
                <Card className="bg-white dark:bg-gray-800"><CardBody className="text-center p-6"><Icon icon="lucide:star" className="text-4xl text-orange-500 mx-auto mb-2" /><h3 className="text-3xl font-bold dark:text-white">4.8/5</h3><p className="text-gray-500 dark:text-gray-400">O'rtacha reyting</p></CardBody></Card>
            </div>
            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <Tabs aria-label="Appointments" color="primary" selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as any)}>
                        <Tab key="upcoming" title={<div className="flex items-center space-x-2"><Icon icon="lucide:calendar-clock" /><span>Kutilayotganlar ({upcomingAppointments.length})</span></div>} />
                        <Tab key="completed" title={<div className="flex items-center space-x-2"><Icon icon="lucide:check-circle-2" /><span>Yakunlanganlar ({completedAppointments.length})</span></div>} />
                    </Tabs>
                </CardHeader>
                <CardBody className="p-0">
                    <div className="divide-y dark:divide-gray-700">
                        {appointmentsToShow.map((app, index) => (
                            <motion.div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                                <div className="flex items-center gap-4">
                                    <Avatar src={app.avatar} size="lg" />
                                    <div>
                                        <h3 className="font-semibold dark:text-white">{app.patientName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Sabab: <span className="font-medium">{app.reason}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-semibold dark:text-white">{app.time}</p>
                                        <Badge color={app.type === 'video' ? 'primary' : 'success'} variant="flat">{app.type === 'video' ? 'Video Qo\'ng\'iroq' : 'Chat'}</Badge>
                                    </div>
                                    <Divider orientation="vertical" className="h-10 mx-2" />
                                    <Button isIconOnly variant="flat" color="primary" title="Video qo'ng'iroqni boshlash" onPress={() => handleStartVideoCall(app)}><Icon icon="lucide:video" className="text-xl"/></Button>
                                    <Button isIconOnly variant="flat" color="success" title="Chatni ochish" onPress={() => handleStartChat(app)}><Icon icon="lucide:message-circle" className="text-xl"/></Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                     {appointmentsToShow.length === 0 && (<p className="text-center text-gray-500 p-8">Bu bo'limda uchrashuvlar mavjud emas.</p>)}
                </CardBody>
            </Card>

            {/* --- O'ZGARISH: Video Call Modal endi to'liq ekranda ochiladi --- */}
            <Modal isOpen={videoCallOpen} onOpenChange={setVideoCallOpen} size="full" className="p-0">
                <ModalContent className="flex flex-col h-full dark:bg-gray-900">
                    <ModalHeader className="flex justify-between items-center border-b dark:border-gray-700">
                        <h3 className="font-semibold text-lg dark:text-white">Video qo'ng'iroq: {selectedPatient?.patientName}</h3>
                         <Button isIconOnly variant="light" onPress={() => setVideoCallOpen(false)}><Icon icon="lucide:x" className="w-6 h-6"/></Button>
                    </ModalHeader>
                    <ModalBody className="flex-1 flex items-center justify-center bg-black text-white">
                        <div className="text-center">
                            <Icon icon="lucide:video" className="text-8xl mb-6 text-gray-500" />
                            <p className="text-2xl">Bemorning video tasviri</p>
                            <p className="text-lg text-gray-400">Aloqa o'rnatilmoqda...</p>
                        </div>
                    </ModalBody>
                    <ModalFooter className="border-t dark:border-gray-700">
                        <Button color="danger" variant="flat" onPress={() => setVideoCallOpen(false)} startContent={<Icon icon="lucide:phone-off"/>}>
                            Qo'ng'iroqni yakunlash
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* --- O'ZGARISH: Chat Modal endi to'liq ekranda ochiladi va dizayni yangilandi --- */}
            <Modal isOpen={chatOpen} onOpenChange={setChatOpen} size="full" className="p-0">
                <ModalContent className="flex flex-col h-full bg-white dark:bg-gray-900">
                     <ModalHeader className="flex justify-between items-center border-b dark:border-gray-700">
                        <div className="flex items-center gap-3">
                           <img src={selectedPatient?.avatar} alt={selectedPatient?.patientName} className="w-10 h-10 rounded-full" />
                           <div>
                               <h3 className="font-semibold text-lg dark:text-white">{selectedPatient?.patientName}</h3>
                               <p className="text-sm text-gray-500">Bemor</p>
                           </div>
                        </div>
                        <Button isIconOnly variant="light" onPress={() => setChatOpen(false)}><Icon icon="lucide:x" className="w-6 h-6"/></Button>
                    </ModalHeader>
                     <ModalBody className="p-0 flex flex-col flex-1">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.authorId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.authorId !== user?.id && <img src={selectedPatient?.avatar} className="w-6 h-6 rounded-full mb-1" alt="Patient"/>}
                                    <div className={`flex flex-col ${msg.authorId === user?.id ? 'items-end' : 'items-start'}`}>
                                        <div className={`inline-block py-2 px-4 rounded-2xl max-w-md ${msg.authorId === user?.id ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 px-1">{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                            <div className="flex items-center gap-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                                <Input
                                    placeholder="Xabar yozing..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-transparent border-none focus:ring-0 px-4 dark:text-white"
                                />
                                <Button
                                    isIconOnly
                                    color="primary"
                                    onPress={handleSendMessage}
                                    isDisabled={!newMessage.trim()}
                                    className="rounded-full"
                                >
                                    <Icon icon="lucide:send" />
                                </Button>
                            </div>
                        </div>
                     </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};
export default DoctorDashboard;