import { useState, useEffect } from 'react';
import { collection, getDocs, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { datingTimeline as staticTimeline } from '@/data';
import type { TimelineYear } from '@/types';

// Firestore stores dates as Timestamp objects; convert them back to Date.
function toDate(val: unknown): Date {
    if (val != null && typeof (val as Timestamp).toDate === 'function') {
        return (val as Timestamp).toDate();
    }
    return val as Date;
}

/**
 * Reads the `timeline` collection from Firestore.
 *
 * Expected Firestore document layout:
 *   Collection: "timeline"
 *   Document ID: year as string, e.g. "2025"
 *   Fields:
 *     description: string
 *     events: Array<{
 *       date: Timestamp,
 *       name: string,
 *       des?: string | string[],
 *       burstIcon?: string
 *     }>
 *
 * Falls back to the static data file if the collection is empty or unreachable.
 */
export function useTimeline(): Record<number, TimelineYear> {
    const [timeline, setTimeline] = useState<Record<number, TimelineYear>>(staticTimeline);

    useEffect(() => {
        getDocs(collection(db, 'timeline'))
            .then((snap) => {
                if (snap.empty) return;
                const result: Record<number, TimelineYear> = {};
                snap.forEach((doc) => {
                    const d = doc.data();
                    result[Number(doc.id)] = {
                        description: d.description as string,
                        events: (d.events as Record<string, unknown>[]).map((e) => ({
                            date: toDate(e.date),
                            name: e.name as string,
                            ...(e.des != null && { des: e.des as string | string[] }),
                            ...(e.burstIcon != null && { burstIcon: e.burstIcon as string }),
                        })),
                    };
                });
                setTimeline(result);
            })
            .catch(() => {});
    }, []);

    return timeline;
}
