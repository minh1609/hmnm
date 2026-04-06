import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { TripsPage } from '@/pages/TripsPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trips" element={<TripsPage />} />
        </Routes>
    );
}

export default App;
