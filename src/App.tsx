import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import GaragePage from './pages/GaragePage';
import WinnersPage from './pages/WinnersPage';

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/garage" replace />} />
          <Route path="/garage" element={<GaragePage />} />
          <Route path="/winners" element={<WinnersPage />} />
        </Routes>
      </main>
    </div>
  );
}
