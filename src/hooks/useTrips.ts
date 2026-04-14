import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { activeProfile } from '@/config';
import type { Trip } from '@/types';

function toDate(val: unknown): Date {
    if (val != null && typeof (val as Timestamp).toDate === 'function') {
        return (val as Timestamp).toDate();
    }
    return val as Date;
}

let _tripsCache: Trip[] | null = null;

/** Call this after any write to the trips collection so the next mount hits Firestore. */
export function invalidateTripsCache() {
    _tripsCache = null;
}

/**
 * Reads the `trips` collection from Firestore (owner == activeProfile, ordered by startDate).
 *
 * Firestore document fields: { name, flag, startDate, endDate, highlights, destinations, owner }
 *
 * Results are held in a module-level cache for the tab session. Call
 * `invalidateTripsCache()` before mounting to force a fresh network read.
 */
export function useTrips(): { trips: Trip[]; loading: boolean } {
    const [trips, setTrips] = useState<Trip[]>(_tripsCache ?? []);
    const [loading, setLoading] = useState(_tripsCache === null);

    useEffect(() => {
        if (_tripsCache !== null) {
            console.log(`[useTrips] serving ${_tripsCache.length} trips from memory cache`);
            return;
        }

        const q = query(collection(db, 'trips'), where('owner', '==', activeProfile), orderBy('startDate', 'asc'));

        getDocs(q)
            .then((snap) => {
                const source = snap.metadata.fromCache ? 'Firestore IndexedDB cache' : 'Firestore network';
                const result: Trip[] = snap.docs.map((doc) => {
                    const d = doc.data();
                    return {
                        name: d.name as string,
                        flag: d.flag as string,
                        startDate: toDate(d.startDate),
                        endDate: toDate(d.endDate),
                        highlights: (d.highlights ?? []) as string[],
                        destinations: (d.destinations ?? []) as Trip['destinations'],
                        owner: d.owner as string,
                    } satisfies Trip;
                });
                console.log(`[useTrips] fetched ${result.length} trips from ${source}`);
                _tripsCache = result;
                setTrips(result);
                setLoading(false);
            })
            .catch((err) => {
                console.error('[useTrips] failed to fetch trips:', err);
                setLoading(false);
            });
    }, []);

    return { trips, loading };
}
