import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { timelineEvents as staticEvents, yearDescriptions as staticYearDescriptions } from '@/data';
import type { TimelineEvent, TimelineYear } from '@/types';
import { activeProfile } from '@/config';

function toDate(val: unknown): Date {
    if (val != null && typeof (val as Timestamp).toDate === 'function') {
        return (val as Timestamp).toDate();
    }
    return val as Date;
}

function groupByYear(
    events: TimelineEvent[],
    descriptions: Record<number, string>,
): Record<number, TimelineYear> {
    const result: Record<number, TimelineYear> = {};
    for (const event of events) {
        const year = event.date.getFullYear();
        if (!result[year]) {
            result[year] = { description: descriptions[year] ?? '', events: [] };
        }
        result[year].events.push(event);
    }
    return result;
}

/**
 * Reads flat `timeline_events` documents from Firestore (owner == activeProfile, ordered by date).
 * Falls back to static data if the collection is empty or unreachable.
 *
 * Firestore document fields: { date, name, des?, burstIcon?, owner }
 */
export function useTimeline(): Record<number, TimelineYear> {
    const [timeline, setTimeline] = useState<Record<number, TimelineYear>>(() =>
        groupByYear(staticEvents, staticYearDescriptions),
    );

    useEffect(() => {
        const q = query(
            collection(db, 'timeline_events'),
            where('owner', '==', activeProfile),
            orderBy('date', 'asc'),
        );

        getDocs(q)
            .then((snap) => {
                if (snap.empty) return;
                const events: TimelineEvent[] = snap.docs.map((doc) => {
                    const d = doc.data();
                    const event: TimelineEvent = {
                        date: toDate(d.date),
                        name: d.name as string,
                        owner: d.owner as string,
                    };
                    if (d.des != null) event.des = d.des as string | string[];
                    if (d.burstIcon != null) event.burstIcon = d.burstIcon as string;
                    return event;
                });
                setTimeline(groupByYear(events, staticYearDescriptions));
            })
            .catch(() => {});
    }, []);

    return timeline;
}
