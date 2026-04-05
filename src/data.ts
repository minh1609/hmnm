interface TimelineEvent {
    date: Date;
    name: string;
    des?: string;
}

interface TimelineYear {
    year: number;
    events: TimelineEvent[];
}

export let datingTimeline: TimelineYear[] = [
    {
        year: 2025,
        events: [
            {
                date: new Date('2025-08-26'),
                name: 'First text',
            },
            {
                date: new Date('2025-09-01'),
                name: 'First Met',
                des: 'Chiang Mai Thai restaurant',
            },
        ],
    },

    {
        year: 2026,
        events: [
            {
                date: new Date('2026-08-26'),
                name: 'First text',
            },
            {
                date: new Date('2026-09-01'),
                name: 'First Met',
                des: 'Chiang Mai Thai restaurant',
            },
        ],
    },
];
