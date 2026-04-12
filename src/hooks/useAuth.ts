import { useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export interface AuthState {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isGf: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGf, setIsGf] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                try {
                    const snap = await getDoc(doc(db, 'users', u.uid));
                    const role = snap.exists() ? snap.data()?.role : undefined;
                    setIsAdmin(role === 'admin');
                    setIsGf(role === 'gf');
                } catch {
                    setIsAdmin(false);
                    setIsGf(false);
                }
            } else {
                setIsAdmin(false);
                setIsGf(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return { user, loading, isAdmin, isGf, signIn, signOut };
}
