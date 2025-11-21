// src/pages/admin/doctors.tsx
import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

// Doctor type va mock ma'lumotlar
interface Doctor {
  id: string; name: string; specialty: string; email: string; phone: string;
  status: 'active' | 'pending' | 'rejected';
  rating: number; consultations: number; joinDate: string; avatar: string;
}
const mockDoctors: Doctor[] = Array.from({ length: 30 }, (_, i) => ({
  id: `doctor-${i + 1}`, name: `Dr. ${['Azimov', 'Karimova', 'Rahimov', 'Usmanova', 'Yusupov'][i % 5]} ${i + 1}`,
  specialty: ['Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'General Practitioner'][i % 5],
  email: `doctor${i + 1}@example.com`, phone: `+998 9${i % 10} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
  status: ['active', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as 'active' | 'pending' | 'rejected',
  rating: parseFloat((3 + Math.random() * 2).toFixed(1)), consultations: Math.floor(Math.random() * 100) + 1,
  joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${i % 20 + 20}`
}));

const DoctorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const rowsPerPage = 10;
  const [newDoctorForm, setNewDoctorForm] = React.useState({ name: '', specialty: '', email: '', phone: '' });

  const filteredDoctors = React.useMemo(() => {
    return mockDoctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);
  
  const paginatedDoctors = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDoctors.slice(start, end);
  }, [filteredDoctors, currentPage]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const getStatusColor = (status: string) => ({ active: 'success', pending: 'warning', rejected: 'danger' }[status] || 'default');
  const handleInputChange = (key: string, value: string) => setNewDoctorForm(prev => ({ ...prev, [key]: value }));
  const handleAddDoctor = () => { console.log('Adding new doctor:', newDoctorForm); setNewDoctorForm({ name: '', specialty: '', email: '', phone: '' }); onOpenChange(); };
  const renderStarRating = (rating: number) => (
    <div className="flex items-center"><div className="flex">{[1, 2, 3, 4, 5].map((star) => (<Icon key={star} icon="lucide:star" className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'} width={16}/>))}</div><span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span></div>
  );
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Doctors Management</h1>
        <p className="text-foreground-500">View and manage all doctors in the system</p>
      </div>
      
      <Card>
        <CardHeader><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full"><Input placeholder="Search doctors..." value={searchQuery} onValueChange={setSearchQuery} startContent={<Icon icon="lucide:search" />} className="w-full sm:max-w-xs" /><div className="flex gap-2"><Dropdown><DropdownTrigger><Button variant="flat" endContent={<Icon icon="lucide:chevron-down" />}>Status: {statusFilter}</Button></DropdownTrigger><DropdownMenu aria-label="Status filter" onAction={(key) => setStatusFilter(key as string)}><DropdownItem key="all">All</DropdownItem><DropdownItem key="active">Active</DropdownItem><DropdownItem key="pending">Pending</DropdownItem><DropdownItem key="rejected">Rejected</DropdownItem></DropdownMenu></Dropdown><Button color="primary" endContent={<Icon icon="lucide:plus" />} onPress={onOpen}>Add Doctor</Button></div></div></CardHeader>
        <CardBody>
          <Table aria-label="Doctors table" bottomContent={<div className="flex justify-center"><Pagination total={Math.ceil(filteredDoctors.length / rowsPerPage)} page={currentPage} onChange={setCurrentPage} /></div>} removeWrapper>
            <TableHeader><TableColumn>DOCTOR</TableColumn><TableColumn>SPECIALTY</TableColumn><TableColumn>EMAIL</TableColumn><TableColumn>STATUS</TableColumn><TableColumn>RATING</TableColumn><TableColumn>CONSULTATIONS</TableColumn><TableColumn>JOIN DATE</TableColumn><TableColumn>ACTIONS</TableColumn></TableHeader>
            <TableBody emptyContent="No doctors found">
              {paginatedDoctors.map((doctor) => (
                <TableRow key={doctor.id}><TableCell><div className="flex items-center gap-3"><Avatar src={doctor.avatar} name={doctor.name} size="sm" /><span>{doctor.name}</span></div></TableCell><TableCell>{doctor.specialty}</TableCell><TableCell>{doctor.email}</TableCell><TableCell><Chip color={getStatusColor(doctor.status) as any} variant="flat" size="sm">{doctor.status}</Chip></TableCell><TableCell>{renderStarRating(doctor.rating)}</TableCell><TableCell>{doctor.consultations}</TableCell><TableCell>{formatDate(doctor.joinDate)}</TableCell><TableCell><div className="flex gap-1 items-center"><Button isIconOnly size="sm" variant="light"><Icon icon="lucide:eye" /></Button><Button isIconOnly size="sm" variant="light"><Icon icon="lucide:edit" /></Button>{doctor.status === 'pending' && <Button isIconOnly size="sm" variant="light" color="success"><Icon icon="lucide:check" /></Button>}<Button isIconOnly size="sm" variant="light" color="danger"><Icon icon="lucide:x" /></Button></div></TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-primary/10 p-3"><Icon icon="lucide:stethoscope" className="text-primary text-2xl" /></div><div><p className="text-sm">Total Doctors</p><h3 className="text-2xl font-bold">{mockDoctors.length}</h3></div></CardBody></Card><Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-success/10 p-3"><Icon icon="lucide:check-circle" className="text-success text-2xl" /></div><div><p className="text-sm">Active Doctors</p><h3 className="text-2xl font-bold">{mockDoctors.filter(d => d.status === 'active').length}</h3></div></CardBody></Card><Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-warning/10 p-3"><Icon icon="lucide:clock" className="text-warning text-2xl" /></div><div><p className="text-sm">Pending</p><h3 className="text-2xl font-bold">{mockDoctors.filter(d => d.status === 'pending').length}</h3></div></CardBody></Card><Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-secondary/10 p-3"><Icon icon="lucide:message-circle" className="text-secondary text-2xl" /></div><div><p className="text-sm">Consultations</p><h3 className="text-2xl font-bold">{mockDoctors.reduce((s, d) => s + d.consultations, 0)}</h3></div></CardBody></Card></div>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}><ModalContent>{(onClose) => (<><ModalHeader>Add New Doctor</ModalHeader><ModalBody><div className="flex flex-col gap-4"><Input label="Full Name" value={newDoctorForm.name} onValueChange={(v) => handleInputChange('name', v)} /><Input label="Specialty" value={newDoctorForm.specialty} onValueChange={(v) => handleInputChange('specialty', v)} /><Input label="Email" type="email" value={newDoctorForm.email} onValueChange={(v) => handleInputChange('email', v)} /><Input label="Phone" value={newDoctorForm.phone} onValueChange={(v) => handleInputChange('phone', v)} /></div></ModalBody><ModalFooter><Button variant="flat" onPress={onClose}>Cancel</Button><Button color="primary" onPress={handleAddDoctor}>Add Doctor</Button></ModalFooter></>)}</ModalContent></Modal>
    </div>
  );
};

export default DoctorsPage;