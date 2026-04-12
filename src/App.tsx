import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { TripsPage } from '@/pages/TripsPage';

function App() {
    const location = useLocation();
    const animClass = 'page-enter-fade';

    return (
        <div key={location.key} className={animClass}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/trips" element={<TripsPage />} />
            </Routes>
        </div>
    );
}

export default App;
