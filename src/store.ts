import { create } from 'zustand';

interface AppState {
    showCelebration: boolean;
    setShowCelebration: (value: boolean) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    resetting: boolean;
    setResetting: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    showCelebration: false,
    setShowCelebration: (value) => set({ showCelebration: value }),
    loading: true,
    setLoading: (value) => set({ loading: value }),
    resetting: false,
    setResetting: (value) => set({ resetting: value }),
}));
