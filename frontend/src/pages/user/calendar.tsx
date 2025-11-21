// src/pages/user/calendar.tsx

import React from 'react';
import { Card, CardBody, CardHeader, Button, Badge, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
// UserLayout importi olib tashlandi
import { motion } from 'framer-motion';

// Interfeyslar va mock ma'lumotlar o'zgarishsiz qoladi
interface CalendarEvent { id: string; title: string; date: string; time: string; type: 'appointment' | 'vaccination' | 'checkup'; doctor?: string; location?: string; status: 'upcoming' | 'completed' | 'cancelled'; }
const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'General Checkup', date: '2023-09-15', time: '10:00', type: 'appointment', doctor: 'Dr. Azimov', location: 'Central Clinic, Room 305', status: 'upcoming' },
  { id: '2', title: 'Flu Vaccination', date: '2023-09-18', time: '14:30', type: 'vaccination', location: 'City Hospital', status: 'upcoming' },
  { id: '3', title: 'Blood Test', date: '2023-09-10', time: '09:15', type: 'checkup', location: 'Medical Lab', status: 'completed' },
];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateCalendarDays = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    days.push({
      day: i, date: date, isToday: i === today.getDate(),
      hasEvent: calendarEvents.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      })
    });
  }
  return days;
};

const CalendarPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState('all');
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const calendarDays = generateCalendarDays();
  
  const filteredEvents = React.useMemo(() => {
    if (selectedTab === 'all') { return calendarEvents; }
    return calendarEvents.filter(event => event.type === selectedTab);
  }, [selectedTab]);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const getEventTypeIcon = (type: string) => { switch (type) { case 'appointment': return 'lucide:stethoscope'; case 'vaccination': return 'lucide:syringe'; case 'checkup': return 'lucide:clipboard-check'; default: return 'lucide:calendar'; } };
  const getEventStatusBadge = (status: string) => { switch (status) { case 'upcoming': return <Badge color="primary">Upcoming</Badge>; case 'completed': return <Badge color="success">Completed</Badge>; case 'cancelled': return <Badge color="danger">Cancelled</Badge>; default: return null; } };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Health Calendar</h1>
        <p className="text-foreground-500">Manage your appointments, vaccinations, and checkups</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
            <Card className="h-auto">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <div className="flex gap-2"><Button variant="light" isIconOnly><Icon icon="lucide:chevron-left" /></Button><Button variant="light" isIconOnly><Icon icon="lucide:chevron-right" /></Button></div>
              </CardHeader>
              <CardBody className="p-2">
                {/* ========================================================================= */}
                {/* XATO AYNAN SHU YERDA EDI: Ortiqcha `<` belgisi olib tashlandi           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-7 mb-1">{daysOfWeek.map((day) => (<div key={day} className="text-center text-xs font-medium">{day}</div>))}</div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} onClick={() => setSelectedDate(day.date)} className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer ${day.isToday ? 'bg-primary text-white' : day.hasEvent ? 'bg-primary/10' : 'hover:bg-gray-100'}`}>
                      <span className={`text-sm ${day.isToday ? 'font-bold' : ''}`}>{day.day}</span>
                      {day.hasEvent && !day.isToday && (<div className="w-1 h-1 rounded-full bg-primary mt-1"></div>)}
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><h2 className="text-lg font-semibold">Health Reminders</h2></CardHeader>
              <CardBody className="p-4 overflow-y-auto"><div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-warning/10 flex-shrink-0 flex items-center justify-center"><Icon icon="lucide:bell" className="text-warning" /></div><div className="flex-grow"><h3>Annual Health Checkup</h3><p className="text-sm">Due in 2 weeks</p></div><Button size="sm" color="primary" variant="flat">Schedule</Button></div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-success/10 flex-shrink-0 flex items-center justify-center"><Icon icon="lucide:pill" className="text-success" /></div><div className="flex-grow"><h3>Medication Refill</h3><p className="text-sm">Due in 5 days</p></div><Button size="sm" color="primary" variant="flat">Remind Me</Button></div>
              </div></CardBody>
            </Card>
        </div>
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-lg font-semibold">Health Events</h2>
              <Button color="primary" endContent={<Icon icon="lucide:plus" />}>Add Event</Button>
            </div>
            <Tabs aria-label="Event types" selectedKey={selectedTab} onSelectionChange={setSelectedTab as any} className="mt-4" fullWidth>
              <Tab key="all" title="All" /><Tab key="appointment" title="Appoint." /><Tab key="vaccination" title="Vaccine" /><Tab key="checkup" title="Checkups" />
            </Tabs>
          </CardHeader>
          <CardBody className="p-0">
            <div className="flex flex-col max-h-[500px] overflow-y-auto">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`p-4 border-b last:border-b-0 ${event.status === 'completed' ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10`}><Icon icon={getEventTypeIcon(event.type)} className={`text-primary`} /></div>
                      <div className="flex-grow"><div className="flex justify-between items-start"><h3 className="font-medium">{event.title}</h3>{getEventStatusBadge(event.status)}</div><p className="text-sm mt-1">{formatDate(event.date)} • {event.time}</p>{event.doctor && (<p className="text-sm mt-1">Doctor: {event.doctor}</p>)}{event.location && (<p className="text-sm mt-1">Location: {event.location}</p>)}</div>
                    </div>
                  </motion.div>
                ))
              ) : ( <div className="p-6 text-center"><p>No events found</p></div> )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;