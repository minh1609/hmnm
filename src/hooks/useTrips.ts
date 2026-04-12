import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { trips as staticTrips } from '@/data';
import type { Trip } from '@/types';

function toDate(val: unknown): Date {
    if (val != null && typeof (val as Timestamp).toDate === 'function') {
        return (val as Timestamp).toDate();
    }
    return val as Date;
}

/**
 * Reads the `trips` collection from Firestore (owner == 'mindy', ordered by startDate).
 * Falls back to the static data file if the collection is empty or unreachable.
 *
 * Firestore document fields: { name, flag, startDate, endDate, highlights, destinations, owner }
 */
export function useTrips(): Trip[] {
    const [trips, setTrips] = useState<Trip[]>(staticTrips);

    useEffect(() => {
        const q = query(collection(db, 'trips'), where('owner', '==', 'mindy'), orderBy('startDate', 'asc'));

        getDocs(q)
            .then((snap) => {
                if (snap.empty) return;
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
                setTrips(result);
            })
            .catch(() => {});
    }, []);

    return trips;
}
