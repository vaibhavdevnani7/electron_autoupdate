import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Kbar } from './kbar/kbar';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kbar />} />
      </Routes>
    </Router>
  );
}
