import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { activeProfile } from '@/config';
import type { Trip, TripType } from '@/types';

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
 * Firestore document fields: { name, flag, startDate, endDate, destinations, coordinates, type, owner }
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

        // Firestore's orderBy silently excludes docs missing the field.
        // Split into two queries: dated trips (server-ordered) + undated plans.
        const datedQ = query(
            collection(db, 'trips'),
            where('owner', '==', activeProfile),
            where('startDate', '!=', null),
            orderBy('startDate', 'asc'),
        );
        const undatedQ = query(
            collection(db, 'trips'),
            where('owner', '==', activeProfile),
            where('startDate', '==', null),
        );

        Promise.all([getDocs(datedQ), getDocs(undatedQ)])
            .then(([datedSnap, undatedSnap]) => {
                const source = datedSnap.metadata.fromCache ? 'Firestore IndexedDB cache' : 'Firestore network';
                const toTrip = (doc: (typeof datedSnap.docs)[0]): Trip => {
                    const d = doc.data();
                    return {
                        name: d.name as string,
                        flag: d.flag as string,
                        ...(d.startDate != null && { startDate: toDate(d.startDate) }),
                        ...(d.endDate != null && { endDate: toDate(d.endDate) }),
                        destinations: (d.destinations ?? []) as Trip['destinations'],
                        coordinates: (d.coordinates ?? [0, 0]) as Trip['coordinates'],
                        type: (d.type ?? 'trip') as TripType,
                        ...(d.notes != null && { notes: d.notes as string }),
                        owner: d.owner as string,
                    } satisfies Trip;
                };
                const result: Trip[] = [
                    ...datedSnap.docs.map(toTrip),
                    ...undatedSnap.docs.map(toTrip),
                ];
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
