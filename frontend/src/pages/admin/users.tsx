// src/pages/admin/users.tsx
import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

// User type va mock ma'lumotlar
interface User {
  id: string; name: string; email: string; phone: string;
  status: 'active' | 'inactive' | 'blocked';
  registrationDate: string; lastActivity: string; avatar: string;
}
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`, name: `User ${i + 1}`, email: `user${i + 1}@example.com`,
  phone: `+998 9${i % 10} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
  status: ['active', 'inactive', 'blocked'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'blocked',
  registrationDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  lastActivity: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${i % 20}`
}));

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const rowsPerPage = 10;
  
  const filteredUsers = React.useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);
  
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage]);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  const getStatusColor = (status: string) => ({ active: 'success', inactive: 'warning', blocked: 'danger' }[status] || 'default');
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-foreground-500">View and manage all users in the system</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="w-full sm:max-w-xs"
            />
            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" endContent={<Icon icon="lucide:chevron-down" />}>
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Status filter" onAction={(key) => setStatusFilter(key as string)}>
                  <DropdownItem key="all">All</DropdownItem>
                  <DropdownItem key="active">Active</DropdownItem>
                  <DropdownItem key="inactive">Inactive</DropdownItem>
                  <DropdownItem key="blocked">Blocked</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button color="primary" endContent={<Icon icon="lucide:plus" />}>
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="Users table" bottomContent={<div className="flex justify-center"><Pagination total={Math.ceil(filteredUsers.length / rowsPerPage)} page={currentPage} onChange={setCurrentPage} /></div>} removeWrapper>
            <TableHeader>
              <TableColumn>USER</TableColumn><TableColumn>EMAIL</TableColumn><TableColumn>PHONE</TableColumn>
              <TableColumn>STATUS</TableColumn><TableColumn>REGISTRATION DATE</TableColumn><TableColumn>LAST ACTIVITY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No users found">
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell><div className="flex items-center gap-3"><Avatar src={user.avatar} name={user.name} size="sm" /><span>{user.name}</span></div></TableCell>
                  <TableCell>{user.email}</TableCell><TableCell>{user.phone}</TableCell>
                  <TableCell><Chip color={getStatusColor(user.status) as any} variant="flat" size="sm">{user.status}</Chip></TableCell>
                  <TableCell>{formatDate(user.registrationDate)}</TableCell><TableCell>{formatDate(user.lastActivity)}</TableCell>
                  <TableCell><div className="flex gap-2"><Button isIconOnly size="sm" variant="light"><Icon icon="lucide:eye" /></Button><Button isIconOnly size="sm" variant="light"><Icon icon="lucide:edit" /></Button><Button isIconOnly size="sm" variant="light" color="danger"><Icon icon="lucide:trash" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-primary/10 p-3"><Icon icon="lucide:users" className="text-primary text-2xl" /></div><div><p className="text-foreground-500 text-sm">Total Users</p><h3 className="text-2xl font-bold">{mockUsers.length}</h3></div></CardBody></Card>
        <Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-success/10 p-3"><Icon icon="lucide:user-check" className="text-success text-2xl" /></div><div><p className="text-foreground-500 text-sm">Active Users</p><h3 className="text-2xl font-bold">{mockUsers.filter(user => user.status === 'active').length}</h3></div></CardBody></Card>
        <Card><CardBody className="flex items-center gap-4"><div className="rounded-full bg-danger/10 p-3"><Icon icon="lucide:user-x" className="text-danger text-2xl" /></div><div><p className="text-foreground-500 text-sm">Blocked Users</p><h3 className="text-2xl font-bold">{mockUsers.filter(user => user.status === 'blocked').length}</h3></div></CardBody></Card>
      </div>
    </div>
  );
};

export default UsersPage;