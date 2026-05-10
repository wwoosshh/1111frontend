import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import CreateRoomPage from './pages/CreateRoomPage.jsx';
import RoomEntryPage from './pages/RoomEntryPage.jsx';
import ProfileSelectPage from './pages/ProfileSelectPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import AllAvailablePage from './pages/AllAvailablePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/room/new" element={<CreateRoomPage />} />
      <Route path="/room/:roomId" element={<RoomEntryPage />} />
      <Route path="/room/:roomId/profile" element={<ProfileSelectPage />} />
      <Route path="/room/:roomId/calendar" element={<CalendarPage />} />
      <Route path="/room/:roomId/all" element={<AllAvailablePage />} />
    </Routes>
  );
}
