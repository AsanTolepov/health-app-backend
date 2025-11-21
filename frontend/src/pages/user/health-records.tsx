// src/pages/user/health-records.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Divider, Badge, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
// import UserLayout from '../../components/layout/user-layout'; // <-- BU QATORNI O'CHIRAMIZ
import { motion } from 'framer-motion';

// Interfeyslar va mock ma'lumotlar o'zgarishsiz qoladi
interface Record { id: string; date: string; type: string; description: string; doctor: string; additionalInfo?: string; }
const initialRecords: Record[] = [
  { id: '1', date: '2023-09-01', type: 'Tekshiruv', description: 'Yillik jismoniy imtihon', doctor: 'Dr. Azimov' },
  { id: '2', date: '2023-08-15', type: 'Blood Test', description: 'Routine blood work', doctor: 'Dr. Karimova' },
];

const HealthRecords: React.FC = () => {
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [newRecord, setNewRecord] = useState({ type: '', description: '', doctor: '', additionalInfo: '' });
  const [editRecord, setEditRecord] = useState<Record | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  useEffect(() => { const saved = localStorage.getItem('healthRecords'); if (saved) setRecords(JSON.parse(saved)); }, []);

  const addRecord = () => {
    const newRecordData = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...newRecord };
    const updated = [...records, newRecordData];
    setRecords(updated);
    localStorage.setItem('healthRecords', JSON.stringify(updated));
    setNewRecord({ type: '', description: '', doctor: '', additionalInfo: '' });
    setIsAddModalOpen(false);
  };

  const updateRecord = () => {
    if (editRecord) {
      const updatedRecords = records.map((r) => r.id === editRecord.id ? editRecord : r);
      setRecords(updatedRecords);
      localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
      setEditRecord(null);
      setIsEditModalOpen(false);
    }
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('healthRecords', JSON.stringify(updated));
    setIsDeleteConfirmOpen(false);
    setRecordToDelete(null);
  };

  const filteredRecords = records.filter(r => 
    r.type.toLowerCase().includes(search.toLowerCase()) || 
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    (r.additionalInfo?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    // <UserLayout> tegi olib tashlandi
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Salomatlik tarixi</h1>
      
      <Card>
        <CardHeader className="flex justify-between items-center p-4">
          <Input 
            placeholder="Qaydlarni qidirish..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="max-w-xs"
            startContent={<Icon icon="lucide:search" className="text-gray-400" />}
          />
          <Button color="primary" onPress={() => setIsAddModalOpen(true)} startContent={<Icon icon="lucide:plus" />}>
            Qayd kiritish
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <motion.div 
                  key={record.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-lg">{record.type}</h3>
                      <Badge color="default" variant="flat">{record.date}</Badge>
                    </div>
                    <p className="text-gray-700">{record.description}</p>
                    {record.additionalInfo && <p className="text-sm text-gray-500 mt-1"><strong>Qo‘shimcha:</strong> {record.additionalInfo}</p>}
                    <p className="text-sm text-gray-500 mt-2"><strong>Doktor:</strong> {record.doctor}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      isIconOnly 
                      variant="light" 
                      onPress={() => { setEditRecord(record); setIsEditModalOpen(true); }}
                      title="Tahrirlash"
                    >
                      <Icon icon="lucide:edit" className="text-gray-600"/>
                    </Button>
                    <Button 
                      isIconOnly 
                      variant="light" 
                      color="danger"
                      onPress={() => { setRecordToDelete(record.id); setIsDeleteConfirmOpen(true); }}
                      title="O'chirish"
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-6">Hech qanday qayd topilmadi</p>
            )}
          </div>
        </CardBody>
      </Card>
      
      <Button variant="flat" color="primary" fullWidth startContent={<Icon icon="lucide:download" />}>
        Barcha yozuvlarni eksport qilish
      </Button>
      
      {/* Add Record Modal */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Yangi qayd qo‘shish</ModalHeader>
              <ModalBody>
                <Input label="Turi" placeholder="Masalan: Tekshiruv" value={newRecord.type} onValueChange={(v) => setNewRecord({ ...newRecord, type: v })} className="mb-4" />
                <Input label="Tavsif" placeholder="Qaydni tasvirlab bering" value={newRecord.description} onValueChange={(v) => setNewRecord({ ...newRecord, description: v })} className="mb-4" />
                <Input label="Doktor" placeholder="Doktor ismi" value={newRecord.doctor} onValueChange={(v) => setNewRecord({ ...newRecord, doctor: v })} className="mb-4" />
                <Input label="Qo‘shimcha ma‘lumot" placeholder="Qo‘shimcha izohlar (ixtiyoriy)" value={newRecord.additionalInfo} onValueChange={(v) => setNewRecord({ ...newRecord, additionalInfo: v })} />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Bekor qilish</Button>
                <Button color="primary" onPress={addRecord}>Saqlash</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Record Modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Qaydni tahrirlash</ModalHeader>
              <ModalBody>
                <Input label="Turi" value={editRecord?.type || ''} onValueChange={(v) => setEditRecord(p => ({...p!, type: v} as Record))} className="mb-4" />
                <Input label="Tavsif" value={editRecord?.description || ''} onValueChange={(v) => setEditRecord(p => ({...p!, description: v} as Record))} className="mb-4" />
                <Input label="Doktor" value={editRecord?.doctor || ''} onValueChange={(v) => setEditRecord(p => ({...p!, doctor: v} as Record))} className="mb-4" />
                <Input label="Qo‘shimcha ma‘lumot" value={editRecord?.additionalInfo || ''} onValueChange={(v) => setEditRecord(p => ({...p!, additionalInfo: v} as Record))} />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Bekor qilish</Button>
                <Button color="primary" onPress={updateRecord}>Yangilash</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>O'chirishni tasdiqlash</ModalHeader>
              <ModalBody>
                <p>Ushbu qaydni o'chirishni xohlaysizmi? Bu amal qaytarib bo'lmaydi.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Bekor qilish</Button>
                <Button color="danger" onPress={() => recordToDelete && deleteRecord(recordToDelete)}>O'chirish</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
    // </UserLayout> tegi olib tashlandi
  );
};

export default HealthRecords;