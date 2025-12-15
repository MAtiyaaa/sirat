// Mushaf page ranges for all 114 surahs (based on the standard Medina Mushaf)
export const SURAH_PAGES: Record<number, { start: number; end: number }> = {
  1: { start: 1, end: 1 },
  2: { start: 2, end: 49 },
  3: { start: 50, end: 76 },
  4: { start: 77, end: 106 },
  5: { start: 106, end: 127 },
  6: { start: 128, end: 150 },
  7: { start: 151, end: 176 },
  8: { start: 177, end: 186 },
  9: { start: 187, end: 207 },
  10: { start: 208, end: 221 },
  11: { start: 221, end: 235 },
  12: { start: 235, end: 248 },
  13: { start: 249, end: 255 },
  14: { start: 255, end: 261 },
  15: { start: 262, end: 267 },
  16: { start: 267, end: 281 },
  17: { start: 282, end: 293 },
  18: { start: 293, end: 304 },
  19: { start: 305, end: 312 },
  20: { start: 312, end: 321 },
  21: { start: 322, end: 331 },
  22: { start: 332, end: 341 },
  23: { start: 342, end: 349 },
  24: { start: 350, end: 359 },
  25: { start: 359, end: 366 },
  26: { start: 367, end: 376 },
  27: { start: 377, end: 385 },
  28: { start: 385, end: 396 },
  29: { start: 396, end: 404 },
  30: { start: 404, end: 410 },
  31: { start: 411, end: 414 },
  32: { start: 415, end: 417 },
  33: { start: 418, end: 427 },
  34: { start: 428, end: 434 },
  35: { start: 434, end: 440 },
  36: { start: 440, end: 445 },
  37: { start: 446, end: 452 },
  38: { start: 453, end: 458 },
  39: { start: 458, end: 467 },
  40: { start: 467, end: 476 },
  41: { start: 477, end: 482 },
  42: { start: 483, end: 489 },
  43: { start: 489, end: 495 },
  44: { start: 496, end: 498 },
  45: { start: 499, end: 502 },
  46: { start: 502, end: 506 },
  47: { start: 507, end: 510 },
  48: { start: 511, end: 515 },
  49: { start: 515, end: 517 },
  50: { start: 518, end: 520 },
  51: { start: 520, end: 523 },
  52: { start: 523, end: 525 },
  53: { start: 526, end: 528 },
  54: { start: 528, end: 531 },
  55: { start: 531, end: 534 },
  56: { start: 534, end: 537 },
  57: { start: 537, end: 541 },
  58: { start: 542, end: 545 },
  59: { start: 545, end: 548 },
  60: { start: 549, end: 551 },
  61: { start: 551, end: 552 },
  62: { start: 553, end: 554 },
  63: { start: 554, end: 555 },
  64: { start: 556, end: 557 },
  65: { start: 558, end: 559 },
  66: { start: 560, end: 561 },
  67: { start: 562, end: 564 },
  68: { start: 564, end: 566 },
  69: { start: 566, end: 568 },
  70: { start: 568, end: 570 },
  71: { start: 570, end: 571 },
  72: { start: 572, end: 573 },
  73: { start: 574, end: 575 },
  74: { start: 575, end: 577 },
  75: { start: 577, end: 578 },
  76: { start: 578, end: 580 },
  77: { start: 580, end: 581 },
  78: { start: 582, end: 583 },
  79: { start: 583, end: 584 },
  80: { start: 585, end: 585 },
  81: { start: 586, end: 586 },
  82: { start: 587, end: 587 },
  83: { start: 587, end: 589 },
  84: { start: 589, end: 590 },
  85: { start: 590, end: 591 },
  86: { start: 591, end: 591 },
  87: { start: 591, end: 592 },
  88: { start: 592, end: 592 },
  89: { start: 593, end: 594 },
  90: { start: 594, end: 594 },
  91: { start: 595, end: 595 },
  92: { start: 595, end: 596 },
  93: { start: 596, end: 596 },
  94: { start: 596, end: 596 },
  95: { start: 597, end: 597 },
  96: { start: 597, end: 597 },
  97: { start: 598, end: 598 },
  98: { start: 598, end: 599 },
  99: { start: 599, end: 599 },
  100: { start: 599, end: 600 },
  101: { start: 600, end: 600 },
  102: { start: 600, end: 600 },
  103: { start: 601, end: 601 },
  104: { start: 601, end: 601 },
  105: { start: 601, end: 601 },
  106: { start: 602, end: 602 },
  107: { start: 602, end: 602 },
  108: { start: 602, end: 602 },
  109: { start: 603, end: 603 },
  110: { start: 603, end: 603 },
  111: { start: 603, end: 603 },
  112: { start: 604, end: 604 },
  113: { start: 604, end: 604 },
  114: { start: 604, end: 604 },
};

// Convert Western numerals to Eastern Arabic numerals
export const toArabicNumerals = (num: number): string => {
  return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
};

// Get page range display string
export const getPageRangeDisplay = (surahNumber: number, language: 'ar' | 'en'): string => {
  const pages = SURAH_PAGES[surahNumber];
  if (!pages) return '';
  
  if (language === 'ar') {
    if (pages.start === pages.end) {
      return `صفحة ${toArabicNumerals(pages.start)}`;
    }
    return `صفحات ${toArabicNumerals(pages.start)}-${toArabicNumerals(pages.end)}`;
  }
  
  if (pages.start === pages.end) {
    return `Page ${pages.start}`;
  }
  return `Pages ${pages.start}-${pages.end}`;
};

// Get Juz number for a surah (approximate - based on starting position)
export const SURAH_JUZ: Record<number, number> = {
  1: 1, 2: 1, 3: 3, 4: 4, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11,
  11: 11, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 16, 20: 16,
  21: 17, 22: 17, 23: 18, 24: 18, 25: 18, 26: 19, 27: 19, 28: 20, 29: 20, 30: 21,
  31: 21, 32: 21, 33: 21, 34: 22, 35: 22, 36: 22, 37: 23, 38: 23, 39: 23, 40: 24,
  41: 24, 42: 25, 43: 25, 44: 25, 45: 25, 46: 26, 47: 26, 48: 26, 49: 26, 50: 26,
  51: 26, 52: 27, 53: 27, 54: 27, 55: 27, 56: 27, 57: 27, 58: 28, 59: 28, 60: 28,
  61: 28, 62: 28, 63: 28, 64: 28, 65: 28, 66: 28, 67: 29, 68: 29, 69: 29, 70: 29,
  71: 29, 72: 29, 73: 29, 74: 29, 75: 29, 76: 29, 77: 29, 78: 30, 79: 30, 80: 30,
  81: 30, 82: 30, 83: 30, 84: 30, 85: 30, 86: 30, 87: 30, 88: 30, 89: 30, 90: 30,
  91: 30, 92: 30, 93: 30, 94: 30, 95: 30, 96: 30, 97: 30, 98: 30, 99: 30, 100: 30,
  101: 30, 102: 30, 103: 30, 104: 30, 105: 30, 106: 30, 107: 30, 108: 30, 109: 30, 110: 30,
  111: 30, 112: 30, 113: 30, 114: 30,
};

export const getJuzDisplay = (surahNumber: number, language: 'ar' | 'en'): string => {
  const juz = SURAH_JUZ[surahNumber];
  if (!juz) return '';
  
  if (language === 'ar') {
    return `الجزء ${toArabicNumerals(juz)}`;
  }
  return `Juz ${juz}`;
};
