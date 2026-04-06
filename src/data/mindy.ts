import type { Trip, TimelineYear } from '@/types';

export const trips: Trip[] = [
    {
        name: 'Kelso và mái nhà xưa của em',
        flag: '🇨🇦',
        startDate: new Date('2025-11-01T00:00:00'),
        endDate: new Date('2025-11-01T00:00:00'),
        highlights: [],
        destinations: [
            {
                name: 'Kelso Conservation Area',
                googleMapLink:
                    'https://google.com/maps/place/Kelso+Conservation+Area/data=!4m2!3m1!1s0x0:0x56d75ac4d5609c57?sa=X&ved=1t:2428&ictx=111',
            },
            {
                name: 'Square One Missisauga',
                googleMapLink:
                    'https://google.com/maps/search/square+one/@43.5930011,-79.6424732,17z?entry=s&sa=X&ved=1t%3A199789',
            },
        ],
    },
];

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
                des: ['Chiang Mai Thai restaurant', 'Em mặc áo khoác trắng, makeup hơi lỗi, vẫn cute 😍'],
            },
            {
                date: new Date('2025-09-27T12:00:00'),
                name: 'Đi chơi nguyên ngày, và cũng lần đầu giận nhau',
                des: [
                    'Marathon 🏃‍➡️ ở Downsview park',
                    'Lần đầu ăn Ramen 🍜',
                    'Xem Conjuring',
                    'Giận nhau và đến TnT ăn mì lạnh',
                ],
            },
            {
                date: new Date('2025-10-03T12:00:00'),
                name: 'Humber College in Lakeshore',
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
                des: 'Ăn Mochi Donut 🍩 ở Sherway, thấy custome Halloween của em',
            },
            {
                date: new Date('2025-11-01T12:00:00'),
                name: 'Kelso Conservation Area',
                des: [
                    'Chairlift 🚡 dài nhất Bắc Mỹ',
                    'Đi Square One lần đầu, ăn xiên 🍖',
                    'Về còn khen anh nữa luôn',
                    'Ngày cuối cùng ấm áp ☀️ để đi chơi',
                ],
            },
            {
                date: new Date('2025-11-09T12:00:00'),
                name: 'Birthday 🎂 và Tuyết đầu mùa ❄️',
                des: [
                    'Không biết mong ước của hai đứa có thành thật hông',
                    'Hôm đấy còn giận vì anh đòi đến nhà chơi',
                    'Đi nặn gốm, mỗi đứa 1 cái bát 🐧',
                ],
                burstIcon: '🎂',
            },
            {
                date: new Date('2025-11-13T12:00:00'),
                name: '📞 😈',
                des: 'Em gọi điện cho anh, phát hiện em nghịch ghê',
            },
            {
                date: new Date('2025-11-19T12:00:00'),
                name: "International Men's Day - 🥖",
                des: 'Đi ăn Gyubee sau khi giận vì 🥖, em tặng thịt khâu nhục và kem tay',
            },
            {
                date: new Date('2025-12-16T12:00:00'),
                name: 'Bữa cơm đầu ở nhà em 🏠',
                des: ['Chả trứng, canh rau, thịt heo quay', 'Lần đầu em nấu sau bao lâu'],
            },
            {
                date: new Date('2025-12-24T12:00:00'),
                name: 'Chirstmas 🎄',
                des: ['Bánh cuốn', 'First 💋', '1 bị quà 🎁 đem về '],
                burstIcon: '💋',
            },
            {
                date: new Date('2025-12-27T12:00:00'),
                name: 'Anh move đến nhà mới 🏠',
                des: 'Do em tìm hộ, từ giờ được gần em hơn rồi',
            },
        ],
    },

    2026: {
        description: 'Breaking and Returning.',
        events: [
            {
                date: new Date('2026-01-01T12:00:00'),
                name: 'New Year',
                des: 'Xem Fireworks 🎇 ở Downtown với Quinnie, 💋',
                burstIcon: '💥',
            },
            {
                date: new Date('2026-01-02T12:00:00'),
                name: 'Probation boyfriend',
                des: 'Got demoted after a few days 😢',
            },
            {
                date: new Date('2026-01-29T12:00:00'),
                name: 'Anh về 🇻🇳',
                des: 'May lúc em ra tiễn không tặng thêm anh cái thư 😮‍💨',
            },
            {
                date: new Date('2026-02-02T12:00:00'),
                name: 'Gặp mẹ 🌼 ',
            },
            {
                date: new Date('2026-02-14T12:00:00'),
                name: 'Valentine 💝 remote',
                des: ['🧁 🎂, 1 macaron, 🌷', '🧋 🍪'],
                burstIcon: '❤️',
            },
            {
                date: new Date('2026-02-17T12:00:00'),
                name: 'TẾT 🧧 ✨',
                des: [
                    'Mừng tuổi anh $100 luôn, nhìu nhất từ trước tới giờ 🤑',
                    'Anh giấu em đồng xu 🪙  2000 trong phòng trước lúc anh bay, ngạc nhiên hông?',
                ],
                burstIcon: '🧧',
            },
            {
                date: new Date('2026-02-28T12:00:00'),
                name: 'Anh quay lại 🇨🇦',
                des: 'Mang cho em bạn Twinkle Twinkle',
                burstIcon: '🍁',
            },
            {
                date: new Date('2026-03-04T12:00:00'),
                name: 'Lần đâu đi uống cafe ☕️ buổi sáng ☀️',
                des: 'Tối trước mua nhầm cốc ube 🍠 to, rồi bị nhạt quá 😅',
            },
            {
                date: new Date('2026-03-14T12:00:00'),
                name: '🤍 Valentine ',
                des: 'Bất ngờ xuất hiện dưới nhà anh, rồi tặng anh hộp Chocolate 🍫 💜',
                burstIcon: '🤍',
            },
            {
                date: new Date('2026-03-16T12:00:00'),
                name: 'Office job 💼 đầu tiên',
                des: 'Cuối cùng ước mơ bao lâu của em thành hiện thực rồi',
            },
            {
                date: new Date('2026-03-20T12:00:00'),
                name: 'Bắt đầu 3 ngày chay tịnh 🥗',
                des: [
                    'Cảm ơn các cụ phù hộ lấy Job Offer 📃',
                    'Ăn Bean Curd, nhưng mua nhầm sauce có tôm khô',
                    '💤 🏠',
                ],
                burstIcon: '🍑',
            },
            {
                date: new Date('2026-03-20T12:00:00'),
                name: 'Em pack lunch 🍱 cho anh đi làm',
            },
            {
                date: new Date('2026-04-03T12:00:00'),
                name: 'Trời ấm, mình đi chơi hồ, và ăn Krispy Kream 🍩',
            },
        ],
    },
};
