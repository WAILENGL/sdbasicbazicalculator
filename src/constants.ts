/**
 * BaZi Constants and Data Definitions
 */

export interface Stem {
  pinyin: string;
  hanzi: string;
  element: string;
  polarity: string;
  className: string;
}

export interface Branch {
  pinyin: string;
  hanzi: string;
  animal: string;
  element: string;
  className: string;
  hidden: number[];
}

export const CORRECT_STEMS: Stem[] = [
  { pinyin: 'Jia', hanzi: '甲', element: 'Wood', polarity: '+', className: 'text-wood-yang' },
  { pinyin: 'Yi', hanzi: '乙', element: 'Wood', polarity: '-', className: 'text-wood-yin' },
  { pinyin: 'Bing', hanzi: '丙', element: 'Fire', polarity: '+', className: 'text-fire-yang' },
  { pinyin: 'Ding', hanzi: '丁', element: 'Fire', polarity: '-', className: 'text-fire-yin' },
  { pinyin: 'Wu', hanzi: '戊', element: 'Earth', polarity: '+', className: 'text-earth-yang' },
  { pinyin: 'Ji', hanzi: '己', element: 'Earth', polarity: '-', className: 'text-earth-yin' },
  { pinyin: 'Geng', hanzi: '庚', element: 'Metal', polarity: '+', className: 'text-metal-yang' },
  { pinyin: 'Xin', hanzi: '辛', element: 'Metal', polarity: '-', className: 'text-metal-yin' },
  { pinyin: 'Ren', hanzi: '壬', element: 'Water', polarity: '+', className: 'text-water-yang' },
  { pinyin: 'Gui', hanzi: '癸', element: 'Water', polarity: '-', className: 'text-water-yin' },
];

export const BRANCHES: Branch[] = [
  { pinyin: 'Zi', hanzi: '子', animal: 'Rat', element: 'Water', className: 'text-water-yang', hidden: [9] },
  { pinyin: 'Chou', hanzi: '丑', animal: 'Ox', element: 'Earth', className: 'text-earth-yin', hidden: [5, 9, 7] },
  { pinyin: 'Yin', hanzi: '寅', animal: 'Tiger', element: 'Wood', className: 'text-wood-yang', hidden: [0, 2, 4] },
  { pinyin: 'Mao', hanzi: '卯', animal: 'Rabbit', element: 'Wood', className: 'text-wood-yin', hidden: [1] },
  { pinyin: 'Chen', hanzi: '辰', animal: 'Dragon', element: 'Earth', className: 'text-earth-yang', hidden: [4, 1, 9] },
  { pinyin: 'Si', hanzi: '巳', animal: 'Snake', element: 'Fire', className: 'text-fire-yin', hidden: [2, 4, 6] },
  { pinyin: 'Wu', hanzi: '午', animal: 'Horse', element: 'Fire', className: 'text-fire-yang', hidden: [3, 5] },
  { pinyin: 'Wei', hanzi: '未', animal: 'Goat', element: 'Earth', className: 'text-earth-yin', hidden: [5, 3, 1] },
  { pinyin: 'Shen', hanzi: '申', animal: 'Monkey', element: 'Metal', className: 'text-metal-yang', hidden: [6, 8, 4] },
  { pinyin: 'You', hanzi: '酉', animal: 'Rooster', element: 'Metal', className: 'text-metal-yin', hidden: [7] },
  { pinyin: 'Xu', hanzi: '戌', animal: 'Dog', element: 'Earth', className: 'text-earth-yang', hidden: [4, 7, 3] },
  { pinyin: 'Hai', hanzi: '亥', animal: 'Pig', element: 'Water', className: 'text-water-yin', hidden: [8, 0, 4] },
];

export const ELEMENT_CYCLES: Record<string, any> = {
  Wood: { produces: 'Fire', controls: 'Earth', producedBy: 'Water', controlledBy: 'Metal' },
  Fire: { produces: 'Earth', controls: 'Metal', producedBy: 'Wood', controlledBy: 'Water' },
  Earth: { produces: 'Metal', controls: 'Water', producedBy: 'Fire', controlledBy: 'Wood' },
  Metal: { produces: 'Water', controls: 'Wood', producedBy: 'Earth', controlledBy: 'Fire' },
  Water: { produces: 'Wood', controls: 'Fire', producedBy: 'Metal', controlledBy: 'Earth' },
};

export const TIMEZONES = [
  { label: 'UTC -08:00 Pacific Time', offset: -8 },
  { label: 'UTC -05:00 Eastern Time', offset: -5 },
  { label: 'UTC +00:00 London', offset: 0 },
  { label: 'UTC +01:00 Berlin', offset: 1 },
  { label: 'UTC +02:00 Madrid', offset: 2 },
  { label: 'UTC +02:00 Paris', offset: 2 },
  { label: 'UTC +03:00 Athens', offset: 3 },
  { label: 'UTC +03:00 Cairo', offset: 3 },
  { label: 'UTC +03:00 Istanbul', offset: 3 },
  { label: 'UTC +03:00 Baghdad', offset: 3 },
  { label: 'UTC +03:00 Moscow', offset: 3 },
  { label: 'UTC +04:00 Baku', offset: 4 },
  { label: 'UTC +04:00 Tehran', offset: 4 },
  { label: 'UTC +04:30 Kabul', offset: 4.5 },
  { label: 'UTC +05:00 Karachi', offset: 5 },
  { label: 'UTC +05:30 Kolkata', offset: 5.5 },
  { label: 'UTC +06:00 Tashkent', offset: 6 },
  { label: 'UTC +06:00 Almaty', offset: 6 },
  { label: 'UTC +06:00 Urumqi', offset: 6 },
  { label: 'UTC +07:00 Bangkok', offset: 7 },
  { label: 'UTC +07:00 Jakarta', offset: 7 },
  { label: 'UTC +07:30 Kuala Lumpur', offset: 7.5 },
  { label: 'UTC +08:00 Beijing', offset: 8 },
  { label: 'UTC +08:00 Singapore', offset: 8 },
  { label: 'UTC +08:00 Taipei', offset: 8 },
  { label: 'UTC +08:00 Hong Kong', offset: 8 },
  { label: 'UTC +09:00 Tokyo', offset: 9 },
  { label: 'UTC +09:00 Seoul', offset: 9 },
  { label: 'UTC +10:00 Sydney', offset: 10 },
];
