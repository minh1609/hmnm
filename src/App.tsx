import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { TripsPage } from '@/pages/TripsPage';
import { WybmgfPage } from '@/pages/WybmgfPage';
import { redirectTarget } from '@/config';

function App() {
    const location = useLocation();
    const animClass = 'page-enter-fade';

    return (
        <div key={location.key} className={animClass}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/wybmgf" element={<WybmgfPage />} />
                <Route path="/redirect" element={<Navigate to={redirectTarget} replace />} />
            </Routes>
        </div>
    );
}

export default App;
