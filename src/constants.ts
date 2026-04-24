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
  { pinyin: 'Chou', hanzi: '丑', animal: 'Ox', element: 'Earth', className: 'text-earth-yin', hidden: [9, 7, 5] },
  { pinyin: 'Yin', hanzi: '寅', animal: 'Tiger', element: 'Wood', className: 'text-wood-yang', hidden: [4, 2, 0] },
  { pinyin: 'Mao', hanzi: '卯', animal: 'Rabbit', element: 'Wood', className: 'text-wood-yin', hidden: [1] },
  { pinyin: 'Chen', hanzi: '辰', animal: 'Dragon', element: 'Earth', className: 'text-earth-yang', hidden: [1, 9, 4] },
  { pinyin: 'Si', hanzi: '巳', animal: 'Snake', element: 'Fire', className: 'text-fire-yin', hidden: [4, 6, 2] },
  { pinyin: 'Wu', hanzi: '午', animal: 'Horse', element: 'Fire', className: 'text-fire-yang', hidden: [3, 5] },
  { pinyin: 'Wei', hanzi: '未', animal: 'Goat', element: 'Earth', className: 'text-earth-yin', hidden: [3, 1, 5] },
  { pinyin: 'Shen', hanzi: '申', animal: 'Monkey', element: 'Metal', className: 'text-metal-yang', hidden: [4, 8, 6] },
  { pinyin: 'You', hanzi: '酉', animal: 'Rooster', element: 'Metal', className: 'text-metal-yin', hidden: [7] },
  { pinyin: 'Xu', hanzi: '戌', animal: 'Dog', element: 'Earth', className: 'text-earth-yang', hidden: [7, 3, 4] },
  { pinyin: 'Hai', hanzi: '亥', animal: 'Pig', element: 'Water', className: 'text-water-yin', hidden: [4, 0, 8] },
];

export const ELEMENT_CYCLES: Record<string, any> = {
  Wood: { produces: 'Fire', controls: 'Earth', producedBy: 'Water', controlledBy: 'Metal' },
  Fire: { produces: 'Earth', controls: 'Metal', producedBy: 'Wood', controlledBy: 'Water' },
  Earth: { produces: 'Metal', controls: 'Water', producedBy: 'Fire', controlledBy: 'Wood' },
  Metal: { produces: 'Water', controls: 'Wood', producedBy: 'Earth', controlledBy: 'Fire' },
  Water: { produces: 'Wood', controls: 'Fire', producedBy: 'Metal', controlledBy: 'Earth' },
};
