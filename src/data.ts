export interface TimelineEvent {
    date: Date;
    name: string;
    des?: string | string[];
}

export interface TimelineYear {
    description: string;
    events: TimelineEvent[];
}

export const datingTimeline: Record<number, TimelineYear> = {
    2025: {
        description: 'A new Beginning',
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
                name: 'Đi chơi nguyên ngày, và cũng lần đầu giận nhau',
                des: 'Chạy marathon ở Downsview park, lần đầu ăn ramen, rồi đi xem Conjuring, ăn mì lạnh TnT nữa',
            },
            {
                date: new Date('2025-10-03T12:00:00'),
                name: 'Humber Collegue in Lakeshore',
            },
            {
                date: new Date('2025-10-03T12:00:00'),
                name: 'Activision',
                des: 'Em che cánh cửa kim loại để anh đỡ giật',
            },
            {
                date: new Date('2025-10-29T12:00:00'),
                name: '🍧',
                des: 'Lần đầu ăn Bingsu, lúc về còn buộc dây giày cho anh luôn 😮',
            },
            {
                date: new Date('2025-10-30T12:00:00'),
                name: 'Halloween 🎃',
                des: 'Ăn Mochi Donut ở Sherway, 😈',
            },
            {
                date: new Date('2025-11-01T12:00:00'),
                name: 'Kelso Conservation Area',
                des: [
                    'Chairlift dài nhất Bắc Mỹ',
                    'Đi Square One lần đầu, ăn xiên',
                    'Về còn khen anh nữa luôn',
                    'Ngày cuối cùng ấm áp để đi chơi',
                ],
            },
            {
                date: new Date('2025-11-01T12:00:00'),
                name: '🎂 ❄️',
                des: [
                    'Chairlift dài nhất Bắc Mỹ',
                    'Đi Square One lần đầu, ăn xiên',
                    'Về còn khen anh nữa luôn',
                    'Ngày cuối cùng ấm áp để đi chơi',
                ],
            },
        ],
    },

    2026: {
        description: 'Breaking and Returning.',
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
