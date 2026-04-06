import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { TripsPage } from '@/pages/TripsPage';

const routeOrder: Record<string, number> = { '/': 0, '/trips': 1 };

// Module-level so it persists across key-forced remounts during navigation
let _prevPathname = '';

function App() {
    const location = useLocation();

    // const prevOrder = routeOrder[_prevPathname] ?? -1;
    // const nextOrder = routeOrder[location.pathname] ?? 0;

    let animClass: string;
    // if (prevOrder === -1) {
    //     animClass = 'page-enter-fade';
    // } else if (nextOrder >= prevOrder) {
    //     animClass = 'page-enter-forward';
    // } else {
    //     animClass = 'page-enter-backward';
    // }

    animClass = 'page-enter-fade';

    _prevPathname = location.pathname;

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
