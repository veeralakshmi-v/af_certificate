import type { IDCardData } from '../types/idcard';

const STORAGE_KEY = 'alphafly_id_cards_v1';

export const INITIAL_ID_CARDS: IDCardData[] = [
  {
    id: 'AF-ID-2026-001',
    studentName: 'AARTHI R',
    courseName: 'TALLY',
    studentContact: '7397165195',
    emergencyPhone: '9384266256',
    dob: '03/20/2002',
    bloodGroup: 'B+ve',
    address: '6380245526',
    photoUrl: '/id_card_assets/sample_student_photo.jpg',
    qrCodeUrl: 'https://www.alphafly.in/verify/id/AF-ID-2026-001',
    issueDate: '2026-01-10',
    validUntil: '2026-12-31',
  },
  {
    id: 'AF-ID-2026-002',
    studentName: 'SANGERTH.A',
    courseName: 'PYTHON FULL STACK',
    studentContact: '9842154789',
    emergencyPhone: '9443126589',
    dob: '05/14/2003',
    bloodGroup: 'O+ve',
    address: 'No 15, North Street, Theni',
    photoUrl: '/id_card_assets/sample_student_photo.jpg',
    qrCodeUrl: 'https://www.alphafly.in/verify/id/AF-ID-2026-002',
    issueDate: '2026-02-01',
    validUntil: '2026-12-31',
  },
];

export const loadIDCards = (): IDCardData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ID_CARDS));
      return INITIAL_ID_CARDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ID_CARDS;
  } catch (e) {
    console.error('Failed to load ID cards from storage:', e);
    return INITIAL_ID_CARDS;
  }
};

export const saveIDCards = (cards: IDCardData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save ID cards to storage:', e);
  }
};

export const generateNextIDCardNumber = (cards: IDCardData[]): string => {
  const year = new Date().getFullYear();
  const maxNum = cards.reduce((max, card) => {
    const match = card.id.match(/AF-ID-\d+-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return Math.max(max, num);
    }
    return max;
  }, 0);

  const nextNum = String(maxNum + 1).padStart(3, '0');
  return `AF-ID-${year}-${nextNum}`;
};
