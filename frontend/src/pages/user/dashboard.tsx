// src/pages/user/dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useChat } from '../../contexts/chat-hook';

// --- YANGI IMPORT ---
import { useVideoContext } from '../../contexts/VideoContext';

// ... (healthData va appointments o'zgaruvchilari o'z joyida qoladi) ...
const healthData1Day = [ { name: '00:00', value: 130 }, { name: '04:00', value: 80 }, { name: '08:00', value: 152 }, { name: '12:00', value: 119 }, { name: '16:00', value: 141 }, { name: '20:00', value: 120 }, { name: '23:59', value: 163 },];
const healthData15Days = [ { name: 'Day 1', value: 138 }, { name: 'Day 3', value: 110 }, { name: 'Day 5', value: 142 }, { name: 'Day 7', value: 100 }, { name: 'Day 9', value: 151 }, { name: 'Day 12', value: 110 }, { name: 'Day 15', value: 148 },];
const healthData30Days = [ { name: 'Day 1', value: 120 }, { name: 'Day 5', value: 105 }, { name: 'Day 10', value: 132 }, { name: 'Day 15', value: 99 }, { name: 'Day 20', value: 121 }, { name: 'Day 25', value: 110 }, { name: 'Day 30', value: 138 },];
const healthData3Months = [ { name: 'Month 1', value: 120 }, { name: 'Month 1.5', value: 118 }, { name: 'Month 2', value: 122 }, { name: 'Month 2.5', value: 119 }, { name: 'Month 3', value: 121 },];
const appointments = [ { id: 'doc-007', doctorName: 'Dr. Aliyev', specialty: 'Cardiologist', date: '2023-09-15', time: '10:00', avatar: `https://www.shutterstock.com/image-illustration/vector-medical-icon-doctor-image-600nw-1635128152.jpg` }, { id: 'doc-008', doctorName: 'Dr. Karimov', specialty: 'Neurologist', date: '2023-09-18', time: '14:30', avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=3` }];
const initialReminders = [ { id: '1', title: 'Qon bosimiga qarshi dori qabul qiling', time: '08:00', isCompleted: true }, { id: '2', title: 'Ichimlik suvi (1.5L)', time: 'Kun davomida', isCompleted: false }, { id: '3', title: 'Kechki sayr (30 daqiqa)', time: '18:00', isCompleted: false }];
const smartwatchImages = [ 'https://images.ctfassets.net/mmeshd7gafk1/7ndpwOhRN52vOrPveYjyjY/dd322d5bb164624c05191bc2f7b88cb2/Garmin__FitBit_or_Apple_Watch-_Which_to_choose_.jpg', 'https://cdn.mos.cms.futurecdn.net/FEpwP7M89sBp5pGJnHJYDS.jpg', 'https://djd1xqjx2kdnv.cloudfront.net/photos/38/30/504562_26091_XXL.jpg',];

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState(initialReminders);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  
  // Video Call state
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);

  // --- YANGI: Contextdan video narsalarini olamiz ---
  const { 
      me, 
      callAccepted, 
      myVideo, 
      userVideo, 
      callEnded, 
      stream, 
      callUser, 
      leaveCall, 
      answerCall, 
      call 
  } = useVideoContext();

  // ID input (Vaqtinchalik: ID orqali qo'ng'iroq qilish uchun)
  const [idToCall, setIdToCall] = useState(''); 

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('1 week');
  const [healthData, setHealthData] = useState(healthData1Day); // Default data
  
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeChatRoomId, setActiveChatRoomId] = useState<string>('');
  
  const { messages, sendMessage } = useChat(activeChatRoomId);

  // Smartwatch rasmlari aylanishi
  useEffect(() => { if (connectModalOpen) { const interval = setInterval(() => { setCurrentImageIndex((prev) => (prev + 1) % smartwatchImages.length); }, 3000); return () => clearInterval(interval); } }, [connectModalOpen]);
  
  // Period o'zgarishi
  const handlePeriodSelect = (period:any) => { setSelectedPeriod(period); let newData; switch (period) { case '1 day': newData = healthData1Day; break; case '15 days': newData = healthData15Days; break; case '30 days': newData = healthData30Days; break; case '3 months': newData = healthData3Months; break; default: newData = healthData; } setHealthData(newData); setDetailsModalOpen(false); };

  const handleAddReminder = () => { if (newTitle && newTime) { const newReminder = { id: Date.now().toString(), title: newTitle, time: newTime, isCompleted: false }; setReminders([...reminders, newReminder]); setNewTitle(''); setNewTime(''); setShowModal(false); } };
  const handleToggleComplete = (id: string) => { setReminders(reminders.map(reminder => reminder.id === id ? { ...reminder, isCompleted: !reminder.isCompleted } : reminder )); };

  // --- VIDEO CALL FUNKSIYALARI ---
  const handleStartVideoCall = (doctor:any) => { 
      setSelectedDoctor(doctor); 
      setVideoCallOpen(true); 
      setIsCameraOn(true);
      // Haqiqiy loyihada bu yerda Doktorni ID sini backenddan olib `callUser(doctor.socketId)` qilish kerak.
      // Hozircha test uchun ID ni qo'lda kiritish maydonini ko'rsatamiz.
  };

  const handleToggleMute = () => { 
      setIsMuted(!isMuted); 
      if(stream) stream.getAudioTracks()[0].enabled = isMuted;
  };
  const handleToggleCamera = () => { 
      setIsCameraOn(!isCameraOn); 
      if(stream) stream.getVideoTracks()[0].enabled = !isCameraOn;
  };
  const handleSwapCameras = () => { setIsSwapped(!isSwapped); };
  
  // Qo'ng'iroq qilish (Test uchun ID orqali)
  const handleCallId = () => {
      if(idToCall) callUser(idToCall);
  };

  const handleEndCall = () => { 
      leaveCall();
      setVideoCallOpen(false); 
      setSelectedDoctor(null); 
  };
  
  // Incoming Call (Qo'ng'iroq kelganda avtomatik modal ochilishi mumkin yoki notification)
  useEffect(() => {
      if (call.isReceivedCall && !callAccepted) {
         setVideoCallOpen(true); // Qo'ng'iroq kelganda modalni ochamiz
      }
  }, [call]);

  // Chat
  const handleStartChat = (doctor:any) => {
    if (!user) return;
    const chatRoomId = [user.id, doctor.id].sort().join('-');
    setSelectedDoctor(doctor);
    setActiveChatRoomId(chatRoomId);
    setChatOpen(true);
  };
  const handleSendMessage = () => { if (newMessage.trim()) { sendMessage(newMessage); setNewMessage(''); } };

  // --- VIDEO ELEMENTLAR ---
  // Doktorni videosi (Remote Stream)
  const doctorVideo = ( 
    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white relative cursor-pointer overflow-hidden" onClick={handleSwapCameras}> 
         {callAccepted && !callEnded ? (
            <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
         ) : (
             <div className="text-center"> 
                <Icon icon="lucide:video" className="text-8xl mb-6 text-gray-500" /> 
                <p className="text-2xl">{call.isReceivedCall ? "Qo'ng'iroq kelmoqda..." : "Kuting..."}</p> 
                <p className="text-lg text-gray-400">{selectedDoctor?.specialty}</p> 
             </div> 
         )}
    </div> 
  );

  // O'zingizni videongiz (Local Stream)
  const userVideoElement = ( 
     <video playsInline muted ref={myVideo} autoPlay className="w-full h-32 bg-gray-800 rounded-lg object-cover" /> 
  );
  
  const userVideoWrapper = ( 
    <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center text-white relative cursor-pointer overflow-hidden" onClick={handleSwapCameras} > 
        {!isCameraOn && ( <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white"> <div className="text-center"> <Icon icon="lucide:video-off" className="text-3xl mb-1 text-gray-400" /> <p className="text-sm">Camera Off</p> </div> </div> )} 
        {/* Kamera o'chiq bo'lsa ham stream element turaveradi, faqat qora bo'ladi */}
        {userVideoElement} 
    </div> 
  );

  // Swapped versiyalari (Agar user katta ekranda ko'rinishni xohlasa)
  const swappedDoctorVideo = ( <div className="w-full h-32 bg-gray-900 rounded-lg flex items-center justify-center text-white relative cursor-pointer overflow-hidden" onClick={handleSwapCameras}> {callAccepted && !callEnded ? <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" /> : <p className="text-xs">Doctor</p>} </div> );
  const swappedUserVideo = ( <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-white relative cursor-pointer overflow-hidden" onClick={handleSwapCameras}> <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" /> </div> );

  return (
      <div className="flex flex-col gap-6">
        {/* Asosiy Dashboard Header */}
        <div className="flex flex-col gap-2"><h1 className="text-2xl font-bold">Salom, {user?.name}!</h1><p className="text-foreground-500">ID: {me} (Buni sherigingizga bering)</p></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}><Card className="h-full"><CardBody className="flex flex-col items-center justify-center gap-2 py-6"><div className="rounded-full bg-primary/10 p-3"><Icon icon="lucide:message-circle" className="text-primary text-2xl" /></div><h3 className="font-semibold">Shifokor bilan suhbat</h3><p className="text-foreground-500 text-sm text-center">Tibbiy maslahat oling</p><Button as={Link} to="/user/chat" color="primary" variant="flat" className="mt-2" endContent={<Icon icon="lucide:arrow-right" />}>Chatni boshlash</Button></CardBody></Card></motion.div>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}><Card className="h-full"><CardBody className="flex flex-col items-center justify-center gap-2 py-6"><div className="rounded-full bg-secondary/10 p-3"><Icon icon="lucide:calendar" className="text-secondary text-2xl" /></div><h3 className="font-semibold">Uchrashuvlar</h3><p className="text-foreground-500 text-sm text-center">Tashrifni rejalashtirish</p><Button as={Link} to="/user/calendar" color="secondary" variant="flat" className="mt-2" endContent={<Icon icon="lucide:arrow-right" />}>Kalendarni ko‘rish</Button></CardBody></Card></motion.div>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}><Card className="h-full"><CardBody className="flex flex-col items-center justify-center gap-2 py-6"><div className="rounded-full bg-success/10 p-3"><Icon icon="lucide:clipboard-list" className="text-success text-2xl" /></div><h3 className="font-semibold">Salomatlik qaydlari</h3><p className="text-foreground-500 text-sm text-center">Kasallik tarixini ko‘rish</p><Button as={Link} to="/user/records" color="success" variant="flat" className="mt-2" endContent={<Icon icon="lucide:arrow-right" />}>Qaydlarni ko‘rish</Button></CardBody></Card></motion.div>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}><Card className="h-full"><CardBody className="flex flex-col items-center justify-center gap-2 py-6"><div className="rounded-full bg-warning/10 p-3"><Icon icon="lucide:pill" className="text-warning text-2xl" /></div><h3 className="font-semibold">Dori vositalari</h3><p className="text-foreground-500 text-sm text-center">Dorilaringizni kuzating</p><Button as={Link} to="/user/medications" color="warning" variant="flat" className="mt-2" endContent={<Icon icon="lucide:arrow-right" />}>Dori vositalarini ko‘rish</Button></CardBody></Card></motion.div>
        </div>

        {/* Statistics and Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2"><CardHeader className="flex justify-between items-center"><h2 className="text-lg font-semibold">Salomatlik statistikasi</h2><Button variant="light" onPress={() => setConnectModalOpen(true)}>Smart soatlarni ulash</Button><Button variant="light" onPress={() => setDetailsModalOpen(true)}>Batafsil...</Button></CardHeader><CardBody><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="flex flex-col gap-1"><div className="flex justify-between items-center"><span className="text-foreground-500 text-sm">Qon bosimi</span><span className="text-primary font-medium">120/80</span></div><Progress size="sm" value={80} color="primary" className="mt-1"/></div><div className="flex flex-col gap-1"><div className="flex justify-between items-center"><span className="text-foreground-500 text-sm">Yurak urishi</span><span className="text-secondary font-medium">72 zarba/daq</span></div><Progress size="sm" value={72} color="secondary" className="mt-1"/></div><div className="flex flex-col gap-1"><div className="flex justify-between items-center"><span className="text-foreground-500 text-sm">Uyqu</span><span className="text-success font-medium">7.5 soat</span></div><Progress size="sm" value={75} color="success" className="mt-1"/></div></div><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={healthData}><XAxis dataKey="name" axisLine={false} tickLine={false} /><Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)' }} labelStyle={{ fontWeight: 'bold' }} /><Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div></CardBody></Card>
          <Card><CardHeader><h2 className="text-lg font-semibold">Kutilayotgan uchrashuvlar</h2></CardHeader><CardBody className="p-0"><div className="flex flex-col">{appointments.map((appointment, index) => (<React.Fragment key={appointment.id}><div className="p-4 flex items-center gap-4"><div className="flex-shrink-0"><img src={appointment.avatar} alt={appointment.doctorName} className="w-12 h-12 rounded-full object-cover" /></div><div className="flex-grow"><h3 className="font-medium">{appointment.doctorName}</h3><p className="text-foreground-500 text-sm">{appointment.specialty}</p><div className="flex items-center gap-2 mt-1 text-sm"><Icon icon="lucide:calendar" className="text-foreground-400" /><span>{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><Icon icon="lucide:clock" className="text-foreground-400 ml-2" /><span>{appointment.time}</span></div></div><div className="flex gap-2"><Button isIconOnly variant="light" color="primary" onPress={() => handleStartVideoCall(appointment)} className="hover:bg-primary/20 transition-colors"><Icon icon="lucide:video" /></Button><Button isIconOnly variant="light" color="success" onPress={() => handleStartChat(appointment)} className="hover:bg-success/20 transition-colors"><Icon icon="lucide:message-circle" /></Button></div></div>{index < appointments.length - 1 && <Divider />}</React.Fragment>))}{appointments.length === 0 && (<div className="p-6 text-center"><p className="text-foreground-500">Kelgusi uchrashuvlar mavjud emas</p></div>)}</div><div className="p-4 border-t border-divider"><Button as={Link} to="/user/calendar" color="primary" variant="flat" fullWidth endContent={<Icon icon="lucide:plus" />}>Uchrashuvni rejalashtirish</Button></div></CardBody></Card>
        </div>
        
        {/* Reminders */}
        <Card><CardHeader className="flex justify-between items-center"><h2 className="text-lg font-semibold">Bugungi salomatlikka oid eslatmalar</h2><Button variant="light" isIconOnly onPress={() => setShowModal(true)}><Icon icon="lucide:plus" /></Button></CardHeader><CardBody className="p-0"><div className="flex flex-col">{reminders.map((reminder, index) => (<React.Fragment key={reminder.id}><div className="p-4 flex items-center gap-4"><div className="flex-shrink-0"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${reminder.isCompleted ? 'bg-success/10' : 'bg-primary/10'}`}><Icon icon={reminder.isCompleted ? 'lucide:check' : 'lucide:bell'} className={reminder.isCompleted ? 'text-success' : 'text-primary'} /></div></div><div className="flex-grow"><h3 className={`font-medium ${reminder.isCompleted ? 'line-through text-foreground-400' : ''}`}>{reminder.title}</h3><p className="text-foreground-500 text-sm">{reminder.time}</p></div><Button isIconOnly variant="light" color={reminder.isCompleted ? 'success' : 'primary'} onPress={() => handleToggleComplete(reminder.id)}><Icon icon={reminder.isCompleted ? 'lucide:check' : 'lucide:circle'} /></Button></div>{index < reminders.length - 1 && <Divider />}</React.Fragment>))}</div></CardBody></Card>
        
        {/* --- MODALLAR --- */}
        <Modal isOpen={connectModalOpen} onOpenChange={setConnectModalOpen} placement="center"><ModalContent><ModalHeader>Smart soatlarni ulash</ModalHeader><ModalBody><img src={smartwatchImages[currentImageIndex]} alt="Smartwatch" className="w-full h-48 object-cover rounded-lg" /><div className="mt-4"><h3 className="font-semibold">Smart soatni qanday ulash mumkin</h3><p className="text-sm mt-2">1. Garmin Connect ilovasini oching.</p><p className="text-sm">2. Yana {'>'} Sozlamalar {'>'} Ilovalarni ulash {'>'} Apple Health rukniga kiring.</p></div></ModalBody><ModalFooter><Button variant="light" onPress={() => setConnectModalOpen(false)}>Close</Button></ModalFooter></ModalContent></Modal>
        <Modal isOpen={detailsModalOpen} onOpenChange={setDetailsModalOpen} placement="center"><ModalContent><ModalHeader>Select Period</ModalHeader><ModalBody><Button fullWidth onPress={() => handlePeriodSelect('1 day')}>1 Kunlik</Button><Button fullWidth onPress={() => handlePeriodSelect('15 days')}>15 Kunlik</Button></ModalBody><ModalFooter><Button variant="light" onPress={() => setDetailsModalOpen(false)}>Cancel</Button></ModalFooter></ModalContent></Modal>
        <Modal isOpen={showModal} onOpenChange={setShowModal} placement="center"><ModalContent><ModalHeader>Yangi eslatma yaratish</ModalHeader><ModalBody><Input label="Title" placeholder="Enter reminder title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} /><Input label="Time" placeholder="Enter time (e.g. 08:00)" value={newTime} onChange={(e) => setNewTime(e.target.value)} /></ModalBody><ModalFooter><Button variant="light" onPress={() => setShowModal(false)}>Cancel</Button><Button color="primary" onPress={handleAddReminder}>Save</Button></ModalFooter></ModalContent></Modal>
        
        {/* --- VIDEO CALL MODAL (HAQIQIY) --- */}
        <Modal isOpen={videoCallOpen} onOpenChange={setVideoCallOpen} size="full" className="p-0">
            <ModalContent className="flex flex-col h-full">
                <ModalHeader className="flex justify-between items-center bg-blue-600 text-white">
                    <div className="flex items-center gap-2">
                        {selectedDoctor && <img src={selectedDoctor?.avatar} alt={selectedDoctor?.doctorName} className="w-8 h-8 rounded-full" />}
                        <h3 className="font-semibold">Video Call {call.name ? `from ${call.name}` : (selectedDoctor ? `with ${selectedDoctor.doctorName}` : "")}</h3>
                    </div>
                </ModalHeader>
                <ModalBody className="flex-1 flex flex-row gap-4 p-4 bg-black">
                    {/* Katta Video Ekrani */}
                    <div className="w-5/6 h-full relative">
                        {isSwapped ? swappedUserVideo : doctorVideo}
                    </div>
                    
                    {/* O'ng panel: Kichik video va knopkalar */}
                    <div className="w-1/6 flex flex-col gap-4">
                        {/* Kichik Video */}
                        <div className="h-32 relative">
                            {isSwapped ? swappedDoctorVideo : userVideoWrapper}
                        </div>
                        
                        {/* Boshqaruv tugmalari */}
                        <div className="flex flex-col gap-2 bg-gray-800 p-3 rounded-lg">
                            {/* Agar qo'ng'iroq kelayotgan bo'lsa va hali javob berilmagan bo'lsa */}
                            {call.isReceivedCall && !callAccepted && (
                                <Button color="success" variant="shadow" onPress={answerCall} className="justify-center animate-pulse" startContent={<Icon icon="lucide:phone-incoming" />}>
                                    Javob berish
                                </Button>
                            )}

                            {/* Qo'ng'iroq qilish uchun vaqtinchalik ID kiritish joyi */}
                            {!callAccepted && !call.isReceivedCall && (
                                <div className="flex flex-col gap-1 mb-2">
                                    <Input size="sm" placeholder="ID kiritish..." value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
                                    <Button size="sm" color="primary" onPress={handleCallId}>Call ID</Button>
                                </div>
                            )}

                            <Button color={isMuted ? 'danger' : 'primary'} variant="flat" onPress={handleToggleMute} className="justify-center" startContent={<Icon icon={isMuted ? "lucide:mic-off" : "lucide:mic"} />}>{isMuted ? 'Unmute' : 'Mute'}</Button>
                            <Button color={isCameraOn ? 'primary' : 'danger'} variant="flat" onPress={handleToggleCamera} className="justify-center" startContent={<Icon icon={isCameraOn ? "lucide:video" : "lucide:video-off"} />}>{isCameraOn ? 'Camera On' : 'Camera Off'}</Button>
                            <Button color="secondary" variant="flat" className="justify-center" startContent={<Icon icon="lucide:share-2" />}>Share Screen</Button>
                            <Button color="success" variant="flat" className="justify-center" startContent={<Icon icon="lucide:message-circle" />} onPress={() => { setVideoCallOpen(false); handleStartChat(selectedDoctor); }}>Chat</Button>
                            
                            {/* Qo'ng'iroqni tugatish */}
                            <Button color="danger" variant="shadow" className="justify-center mt-2" onPress={handleEndCall} startContent={<Icon icon="lucide:phone-off" />}>
                                End Call
                            </Button>
                        </div>
                        <div className="bg-gray-700 p-2 rounded-lg text-white text-sm"><p><strong>Mening ID:</strong> {me}</p><p><strong>Sifat:</strong> HD</p></div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        
        {/* Chat Modal */}
        <Modal isOpen={chatOpen} onOpenChange={setChatOpen} size="full" className="p-0" hideCloseButton>
            <ModalContent className="flex flex-col h-full bg-white dark:bg-gray-900">
                <ModalHeader className="flex justify-between items-center border-b dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <img src={selectedDoctor?.avatar} alt={selectedDoctor?.doctorName} className="w-10 h-10 rounded-full" />
                        <div><h3 className="font-semibold text-lg">{selectedDoctor?.doctorName}</h3><p className="text-sm text-gray-500">{selectedDoctor?.specialty}</p></div>
                    </div>
                    <Button isIconOnly variant="light" onPress={() => setChatOpen(false)}><Icon icon="lucide:x" className="w-6 h-6"/></Button>
                </ModalHeader>
                <ModalBody className="p-0 flex flex-col flex-1">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
                        {messages.map((message, index) => (
                           <div key={index} className={`flex items-end gap-2 ${message.authorId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                {message.authorId !== user?.id && <img src={selectedDoctor?.avatar} className="w-6 h-6 rounded-full mb-1" alt="Doctor"/>}
                                <div className={`flex flex-col ${message.authorId === user?.id ? 'items-end' : 'items-start'}`}><div className={`inline-block py-2 px-4 rounded-2xl max-w-md ${message.authorId === user?.id ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}><p>{message.text}</p></div><p className="text-xs text-gray-400 mt-1 px-1">{message.time}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700"><div className="flex items-center gap-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800"><Input placeholder="Xabar yozing..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-transparent border-none focus:ring-0 px-4" /><Button isIconOnly color="primary" onPress={handleSendMessage} isDisabled={!newMessage.trim()} className="rounded-full"><Icon icon="lucide:send" /></Button></div></div>
                </ModalBody>
            </ModalContent>
        </Modal>
      </div>
  );
};

export default UserDashboard;