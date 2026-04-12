import { useState, useEffect } from 'react';
import { collection, getDocs, type Timestamp } from 'firebase/firestore';
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
 * Reads the `trips` collection from Firestore.
 *
 * Expected Firestore document layout:
 *   Collection: "trips"
 *   Document ID: any (e.g. trip slug)
 *   Fields:
 *     name: string
 *     flag: string
 *     startDate: Timestamp
 *     endDate: Timestamp
 *     highlights: string[]
 *     destinations: Array<{ name: string, googleMapLink?: string }>
 *
 * Results are sorted by startDate ascending.
 * Falls back to the static data file if the collection is empty or unreachable.
 */
export function useTrips(): Trip[] {
    const [trips, setTrips] = useState<Trip[]>(staticTrips);

    useEffect(() => {
        getDocs(collection(db, 'trips'))
            .then((snap) => {
                if (snap.empty) return;
                const result: Trip[] = snap.docs
                    .map((doc) => {
                        const d = doc.data();
                        return {
                            name: d.name as string,
                            flag: d.flag as string,
                            startDate: toDate(d.startDate),
                            endDate: toDate(d.endDate),
                            highlights: (d.highlights ?? []) as string[],
                            destinations: (d.destinations ?? []) as Trip['destinations'],
                        } satisfies Trip;
                    })
                    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
                setTrips(result);
            })
            .catch(() => {});
    }, []);

    return trips;
}
