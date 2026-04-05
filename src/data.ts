export interface TimelineEvent {
    date: Date;
    name: string;
    des?: string;
}

export interface TimelineYear {
    year: number;
    events: TimelineEvent[];
}

export const datingTimeline: TimelineYear[] = [
    {
        year: 2025,
        events: [
            {
                date: new Date('2025-08-26T12:00:00'),
                name: 'First text',
            },
            {
                date: new Date('2025-09-01T12:00:00'),
                name: 'First Met',
                des: 'Chiang Mai Thai restaurant',
            },
        ],
    },

    {
        year: 2026,
        events: [
            {
                date: new Date('2026-08-26T12:00:00'),
                name: 'First text',
            },
            {
                date: new Date('2026-09-01T12:00:00'),
                name: 'First Met',
                des: 'Chiang Mai Thai restaurant',
            },
        ],
    },
];
