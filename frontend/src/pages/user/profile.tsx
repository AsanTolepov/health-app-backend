// src/pages/user/profile.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Tabs, Tab, Avatar, Divider, Badge, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context.tsx';
import { motion } from 'framer-motion';

// Interfeyslar va mock ma'lumotlar
interface HealthRecord { id: string; date: string; type: string; doctor: string; description: string; documents?: { name: string; url: string }[]; }
interface DoctorRating { id: string; doctorName: string; specialty: string; date: string; rating: number; comment: string; avatar: string; }

const initialHealthRecords: HealthRecord[] = [
  { id: '1', date: '2023-08-15', type: 'Umumiy tekshiruv', doctor: 'Dr. Azimov', description: 'Yillik salomatlik tekshiruvi. Qon bosimi va yurak urishi me\'yorda.', documents: [{name: 'tahlil-natijasi.pdf', url: '#'}] },
  { id: '2', date: '2023-07-10', type: 'Stomatolog ko\'rigi', doctor: 'Dr. Karimova', description: 'Tishlarni tozalash va tekshirish. Muammo topilmadi.', documents: [] },
  { id: '3', date: '2023-06-05', type: 'Ko\'z tekshiruvi', doctor: 'Dr. Rahimov', description: 'Ko\'rish qobiliyatini tekshirish. Ko\'zoynak retsepti yangilandi.', documents: [] }
];
const doctorRatings: DoctorRating[] = [
  { id: '1', doctorName: 'Dr. Azimov', specialty: 'Kardiolog', date: '2023-08-15', rating: 5, comment: 'Ajoyib shifokor, juda sinchkov va professional.', avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=2` },
  { id: '2', doctorName: 'Dr. Karimova', specialty: 'Stomatolog', date: '2023-07-10', rating: 4, comment: 'Yaxshi tajriba, ohista ishladilar va hamma narsani tushuntirdilar.', avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=3` }
];

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '+998 90 123 4567', birthdate: '1990-01-01', gender: 'Male', bloodType: 'A+', allergies: 'Mavjud emas', chronicConditions: 'Mavjud emas', avatar: '' });
  const [savedMessage, setSavedMessage] = useState('');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<HealthRecord, 'id'>>({ date: '', type: '', doctor: '', description: '', documents: [] });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email, avatar: user.avatar || '' }));
    }
  }, [user]);
  
  const handleInputChange = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setFormData(prev => ({ ...prev, avatar: reader.result as string })); }; reader.readAsDataURL(file); } };
  const handleSaveProfile = () => { if (user) { updateUser({ name: formData.name, avatar: formData.avatar, email: formData.email }); } setIsEditing(false); setSavedMessage('Ma\'lumotlar muvaffaqiyatli saqlandi!'); setTimeout(() => setSavedMessage(''), 3000); };
  const handleNewRecordChange = (key: string, value: string) => setNewRecord(prev => ({ ...prev, [key]: value }));

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploadedDocs = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file) // Vaqtinchalik URL yaratish
      }));
      setNewRecord(prev => ({ ...prev, documents: [...(prev.documents || []), ...uploadedDocs] }));
    }
  };

  const handleAddRecord = () => {
    const recordToAdd: HealthRecord = { ...newRecord, id: Date.now().toString() };
    setHealthRecords(prev => [recordToAdd, ...prev]);
    setShowUploadModal(false);
    setNewRecord({ date: '', type: '', doctor: '', description: '', documents: [] });
  };
  
  const renderStarRating = (rating: number) => ( <div className="flex"> {[1, 2, 3, 4, 5].map(star => <Icon key={star} icon="lucide:star" className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} />)} </div> );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-gray-500 dark:text-gray-400">Shaxsiy ma'lumotlar va salomatlik qaydlarini boshqarish</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit bg-white dark:bg-gray-800">
          <CardBody className="flex flex-col items-center gap-4 p-6">
            <Avatar src={formData.avatar} className="w-24 h-24 text-large" isBordered color="primary" />
            <div className="text-center">
              <h2 className="text-xl font-bold dark:text-white">{formData.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
            </div>
            <Divider className="my-2 dark:border-gray-700" />
            <div className="w-full text-left">
              <h3 className="font-semibold mb-3 dark:text-white">Qisqa ma'lumot</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><Icon icon="lucide:calendar" className="text-gray-500" /><span className="text-sm dark:text-gray-300">{new Date().getFullYear() - new Date(formData.birthdate).getFullYear()} yosh</span></div>
                <div className="flex items-center gap-3"><Icon icon="lucide:droplet" className="text-gray-500" /><span className="text-sm dark:text-gray-300">Qon guruhi: {formData.bloodType}</span></div>
                <div className="flex items-center gap-3"><Icon icon="lucide:phone" className="text-gray-500" /><span className="text-sm dark:text-gray-300">{formData.phone}</span></div>
                <div className="flex items-center gap-3"><Icon icon="lucide:map-pin" className="text-gray-500" /><span className="text-sm dark:text-gray-300">Toshkent, O'zbekiston</span></div>
              </div>
            </div>
            <Divider className="my-2 dark:border-gray-700" />
            <div className="w-full text-left">
              <h3 className="font-semibold mb-3 dark:text-white">Favqulodda vaziyatda bog'lanish</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><Icon icon="lucide:user" className="text-gray-500" /><span className="text-sm dark:text-gray-300">Asan Tolepov</span></div>
                <div className="flex items-center gap-3"><Icon icon="lucide:phone" className="text-gray-500" /><span className="text-sm dark:text-gray-300">+998-88-562-21-06</span></div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800">
          <CardHeader>
            <Tabs aria-label="Profile tabs" selectedKey={selectedTab} onSelectionChange={setSelectedTab as any}>
              <Tab key="personal" title="Shaxsiy ma'lumotlar" />
              <Tab key="medical" title="Tibbiy qaydlar" />
              <Tab key="ratings" title="Shifokor baholari" />
            </Tabs>
          </CardHeader>
          <CardBody>
            {selectedTab === 'personal' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center"><h3 className="text-lg font-semibold dark:text-white">Shaxsiy tafsilotlar</h3>{!isEditing ? (<Button color="primary" variant="flat" onPress={() => setIsEditing(true)} startContent={<Icon icon="lucide:edit-3" />}>Tahrirlash</Button>) : (<div className="flex gap-2"><Button variant="light" color="danger" onPress={() => setIsEditing(false)}>Bekor qilish</Button><Button color="primary" onPress={handleSaveProfile}>Saqlash</Button></div>)}</div>
                {savedMessage && <p className="text-green-500 animate-pulse">{savedMessage}</p>}
                {isEditing ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="file" accept="image/*" onChange={handleAvatarUpload} label="Rasm yuklash" />
                    <Input label="To'liq ism" value={formData.name} onValueChange={(v) => handleInputChange('name', v)} />
                    <Input label="Email" type="email" value={formData.email} onValueChange={(v) => handleInputChange('email', v)} />
                    <Input label="Telefon raqam" value={formData.phone} onValueChange={(v) => handleInputChange('phone', v)} />
                    <Input label="Tug'ilgan sana" type="date" value={formData.birthdate} onValueChange={(v) => handleInputChange('birthdate', v)} />
                    <Input label="Jins" value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)} />
                    <Input label="Qon guruhi" value={formData.bloodType} onValueChange={(v) => handleInputChange('bloodType', v)} />
                    <Input label="Allergiyalar" value={formData.allergies} onValueChange={(v) => handleInputChange('allergies', v)} className="md:col-span-2" />
                    <Input label="Surunkali kasalliklar" value={formData.chronicConditions} onValueChange={(v) => handleInputChange('chronicConditions', v)} className="md:col-span-2" />
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm dark:text-gray-300">
                    <div><p className="text-gray-500 dark:text-gray-400">To'liq ism</p><p>{formData.name}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Email</p><p>{formData.email}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Telefon raqam</p><p>{formData.phone}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Tug'ilgan sana</p><p>{new Date(formData.birthdate).toLocaleDateString()}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Jins</p><p>{formData.gender}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Qon guruhi</p><p>{formData.bloodType}</p></div>
                    <div className="md:col-span-2"><p className="text-gray-500 dark:text-gray-400">Allergiyalar</p><p>{formData.allergies}</p></div>
                    <div className="md:col-span-2"><p className="text-gray-500 dark:text-gray-400">Surunkali kasalliklar</p><p>{formData.chronicConditions}</p></div>
                  </div>
                )}
              </div>
            )}
            
            {selectedTab === 'medical' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center"><h3 className="text-lg font-semibold dark:text-white">Tibbiy Qaydlar</h3><Button color="primary" variant="flat" startContent={<Icon icon="lucide:upload" />} onPress={() => setShowUploadModal(true)}>Qayd yuklash</Button></div>
                <div className="space-y-4">
                  {healthRecords.map(record => (
                    <motion.div key={record.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start"><div className="flex items-center gap-2"><h4 className="font-semibold dark:text-white">{record.type}</h4><Badge color="default" variant="flat">{new Date(record.date).toLocaleDateString()}</Badge></div><p className="text-sm text-gray-500 dark:text-gray-400">Dr: {record.doctor}</p></div>
                      <p className="mt-2 text-sm dark:text-gray-300">{record.description}</p>
                      {record.documents && record.documents.length > 0 && (<div className="mt-3"><p className="text-sm font-medium mb-2 dark:text-gray-300">Hujjatlar:</p><div className="flex flex-wrap gap-2">{record.documents.map((doc, index) => (<a key={index} href={doc.url} download={doc.name} className="flex items-center gap-1 bg-primary/10 p-2 rounded-md text-primary text-sm hover:bg-primary/20"><Icon icon="lucide:file-text" />{doc.name}</a>))}</div></div>)}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTab === 'ratings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center"><h3 className="text-lg font-semibold dark:text-white">Shifokorlarga Baholar va Sharhlar</h3></div>
                <div className="space-y-4">
                  {doctorRatings.map(rating => (
                    <motion.div key={rating.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex gap-4"><img src={rating.avatar} alt={rating.doctorName} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div><h4 className="font-semibold dark:text-white">{rating.doctorName}</h4><p className="text-gray-500 dark:text-gray-400 text-sm">{rating.specialty} • {new Date(rating.date).toLocaleDateString()}</p></div>
                            <div>{renderStarRating(rating.rating)}</div>
                          </div>
                          <p className="mt-2 text-sm italic dark:text-gray-300">"{rating.comment}"</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div className="text-center mt-4"><Button color="primary" variant="flat" startContent={<Icon icon="lucide:plus" />}>Yangi baho qo'shish</Button></div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={showUploadModal} onOpenChange={setShowUploadModal} placement="center">
        <ModalContent className="dark:bg-gray-800">
          {(onClose) => (<>
              <ModalHeader className="dark:text-white">Yangi Tibbiy Qayd Yuklash</ModalHeader>
              <ModalBody>
                <Input label="Sana" type="date" value={newRecord.date} onValueChange={(v) => handleNewRecordChange('date', v)} />
                <Input label="Turi" placeholder="Masalan: Qon tahlili" value={newRecord.type} onValueChange={(v) => handleNewRecordChange('type', v)} />
                <Input label="Shifokor" placeholder="Dr. Familya" value={newRecord.doctor} onValueChange={(v) => handleNewRecordChange('doctor', v)} />
                <Input label="Tavsif" value={newRecord.description} onValueChange={(v) => handleNewRecordChange('description', v)} />
                <Input type="file" label="Hujjatlarni yuklash" multiple onChange={handleDocumentUpload} />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Bekor qilish</Button>
                <Button color="primary" onPress={handleAddRecord}>Saqlash</Button>
              </ModalFooter>
          </>)}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfilePage;