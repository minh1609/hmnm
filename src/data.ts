export interface TimelineEvent {
    date: Date;
    name: string;
    des?: string;
}

export interface TimelineYear {
    description: string;
    events: TimelineEvent[];
}

export const datingTimeline: Record<number, TimelineYear> = {
    2025: {
        description: 'Beginning',
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
            {
                date: new Date('2025-09-27T12:00:00'),
                name: 'Nguyên 1 ngày với em, và cũng lần đầu giận',
                des: 'Downsview park marathon, ramen, conjuring',
            },
        ],
    },

    2026: {
        description: '',
        events: [
            {
                date: new Date('2026-01-01T12:00:00'),
                name: 'New Year',
                des: 'Xem bắn pháo hoa với Quinnie',
            },
            {
                date: new Date('2026-01-02T12:00:00'),
                name: 'Probation boyfriend',
            },
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
};
