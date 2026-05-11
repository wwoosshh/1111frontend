import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MyRoomsPage from './pages/MyRoomsPage.jsx';
import CreateRoomPage from './pages/CreateRoomPage.jsx';
import AddRoomPage from './pages/AddRoomPage.jsx';
import JoinRoomPage from './pages/JoinRoomPage.jsx';
import ProfileSelectPage from './pages/ProfileSelectPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import AllAvailablePage from './pages/AllAvailablePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

const Protected = ({ children }) => <RequireAuth>{children}</RequireAuth>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/rooms" element={<Protected><MyRoomsPage /></Protected>} />
      <Route path="/room/new" element={<Protected><CreateRoomPage /></Protected>} />
      <Route path="/room/add" element={<Protected><AddRoomPage /></Protected>} />
      <Route path="/room/:roomId/join" element={<Protected><JoinRoomPage /></Protected>} />
      <Route path="/room/:roomId/profile" element={<Protected><ProfileSelectPage /></Protected>} />
      <Route path="/room/:roomId/calendar" element={<Protected><CalendarPage /></Protected>} />
      <Route path="/room/:roomId/all" element={<Protected><AllAvailablePage /></Protected>} />
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
    </Routes>
  );
}
