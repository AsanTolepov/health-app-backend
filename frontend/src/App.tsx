// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context.tsx';
import { ThemeProvider } from './contexts/theme-context.tsx';
// --- YANGI QO'SHILGAN: Video Context ---
import { VideoProvider } from './contexts/VideoContext.tsx';

import ProtectedRoute from './components/protected-route.tsx';

// --- Barcha Sahifalar va Layout'larni Import Qilish ---

// Ommaviy sahifalar
import LoginPage from './pages/login.tsx';
import RegisterPage from './pages/register.tsx';

// Foydalanuvchi qismi
import UserLayout from './components/layout/user-layout.tsx';
import UserDashboard from './pages/user/dashboard.tsx';
import UserChat from './pages/user/chat.tsx';
import UserCalendar from './pages/user/calendar.tsx';
import UserRecords from './pages/user/health-records.tsx';
import UserMedications from './pages/user/medications.tsx';
import UserProfile from './pages/user/profile.tsx';
import SettingsPage from './pages/user/settings.tsx';
import HelpPage from './pages/user/help.tsx';

// Shifokor qismi
import DoctorLayout from './components/layout/doctor-layout.tsx';
import DoctorDashboard from './pages/doctor/dashboard.tsx';

// Admin qismi
import AdminLayout from './components/layout/admin-layout.tsx';
import AdminDashboard from './pages/admin/dashboard.tsx';
import UsersPage from './pages/admin/users.tsx';
import DoctorsPage from './pages/admin/doctors.tsx';
import AnalyticsPage from './pages/admin/analytics.tsx';

// --- Yordamchi Komponentlar (Har bir rol uchun marshrutlar guruhini yaratadi) ---

const UserRoutes = () => (
  <UserLayout>
    <Switch>
      <ProtectedRoute exact path="/user/dashboard" component={UserDashboard} role="user" />
      <ProtectedRoute exact path="/user/chat" component={UserChat} role="user" />
      <ProtectedRoute exact path="/user/calendar" component={UserCalendar} role="user" />
      <ProtectedRoute exact path="/user/records" component={UserRecords} role="user" />
      <ProtectedRoute exact path="/user/medications" component={UserMedications} role="user" />
      <ProtectedRoute exact path="/user/profile" component={UserProfile} role="user" />
      <ProtectedRoute exact path="/user/settings" component={SettingsPage} role="user" />
      <ProtectedRoute exact path="/user/help" component={HelpPage} role="user" />
      {/* Agar /user manziliga kirilsa, dashboardga yo'naltirish */}
      <Redirect from="/user" to="/user/dashboard" />
    </Switch>
  </UserLayout>
);

const DoctorRoutes = () => (
  <DoctorLayout>
    <Switch>
      <ProtectedRoute exact path="/doctor/dashboard" component={DoctorDashboard} role="doctor" />
      {/* Kelajakda bu yerga shifokorning boshqa sahifalari qo'shiladi */}
      <Redirect from="/doctor" to="/doctor/dashboard" />
    </Switch>
  </DoctorLayout>
);

const AdminRoutes = () => (
  <AdminLayout>
    <Switch>
      <ProtectedRoute exact path="/admin/dashboard" component={AdminDashboard} role="admin" />
      <ProtectedRoute exact path="/admin/users" component={UsersPage} role="admin" />
      <ProtectedRoute exact path="/admin/doctors" component={DoctorsPage} role="admin" />
      <ProtectedRoute exact path="/admin/analytics" component={AnalyticsPage} role="admin" />
      <Redirect from="/admin" to="/admin/dashboard" />
    </Switch>
  </AdminLayout>
);

// --- Asosiy App Komponenti ---
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          {/* 
             VideoProviderni AuthProvider ichiga joylashtirdik.
             Bu Dashboard va boshqa sahifalarda videodan foydalanish imkonini beradi.
          */}
          <VideoProvider>
            <Switch>
              {/* Ommaviy marshrutlar */}
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/register" component={RegisterPage} />
              
              {/* Rol guruhlari uchun alohida oddiy Route'lar */}
              {/* `ProtectedRoute` har bir guruhning ichida ishlaydi */}
              <Route path="/user" component={UserRoutes} />
              <Route path="/doctor" component={DoctorRoutes} />
              <Route path="/admin" component={AdminRoutes} />

              {/* Boshlang'ich va topilmagan sahifalar uchun yo'naltirish */}
              <Route exact path="/" render={() => <Redirect to="/login" />} />
              <Route path="*" render={() => <Redirect to="/login" />} />
            </Switch>
          </VideoProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;