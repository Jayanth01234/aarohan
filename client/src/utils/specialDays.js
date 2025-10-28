// Configuration for special days, holidays, and festivals
// This can be extended with actual API data or database

export const SPECIAL_DAYS_2025 = {
  // National Holidays (India)
  '2025-01-26': { type: 'holiday', name: 'Republic Day', crowdMultiplier: 2.0 },
  '2025-08-15': { type: 'holiday', name: 'Independence Day', crowdMultiplier: 2.0 },
  '2025-10-02': { type: 'holiday', name: 'Gandhi Jayanti', crowdMultiplier: 1.8 },
  
  // Major Hindu Festivals
  '2025-03-14': { type: 'festival', name: 'Holi', crowdMultiplier: 2.5 },
  '2025-03-30': { type: 'festival', name: 'Ram Navami', crowdMultiplier: 2.2 },
  '2025-04-13': { type: 'festival', name: 'Ugadi', crowdMultiplier: 2.0 },
  '2025-04-14': { type: 'festival', name: 'Baisakhi', crowdMultiplier: 2.0 },
  '2025-08-16': { type: 'festival', name: 'Janmashtami', crowdMultiplier: 2.5 },
  '2025-09-03': { type: 'festival', name: 'Ganesh Chaturthi', crowdMultiplier: 2.8 },
  '2025-10-02': { type: 'festival', name: 'Navratri Start', crowdMultiplier: 2.3 },
  '2025-10-11': { type: 'festival', name: 'Dussehra', crowdMultiplier: 2.5 },
  '2025-10-20': { type: 'festival', name: 'Diwali', crowdMultiplier: 3.0 },
  '2025-11-05': { type: 'festival', name: 'Chhath Puja', crowdMultiplier: 2.2 },
  
  // Other Religious Days
  '2025-12-25': { type: 'holiday', name: 'Christmas', crowdMultiplier: 1.5 },
  '2025-04-13': { type: 'festival', name: 'Mahavir Jayanti', crowdMultiplier: 1.8 },
  
  // Temple-specific special days (customize as needed)
  '2025-01-14': { type: 'special', name: 'Makar Sankranti', crowdMultiplier: 2.0 },
  '2025-02-26': { type: 'special', name: 'Maha Shivaratri', crowdMultiplier: 2.5 },
  '2025-05-23': { type: 'special', name: 'Buddha Purnima', crowdMultiplier: 1.8 },
};

export const DAY_TYPES = {
  normal: { label: 'Normal Day', color: '#10b981', multiplier: 1.0 },
  weekend: { label: 'Weekend', color: '#3b82f6', multiplier: 1.4 },
  holiday: { label: 'Holiday', color: '#f59e0b', multiplier: 1.8 },
  festival: { label: 'Festival', color: '#ef4444', multiplier: 2.5 },
  special: { label: 'Special Day', color: '#8b5cf6', multiplier: 2.0 }
};

/**
 * Get day type for a given date
 * @param {Date} date 
 * @returns {string} Day type: 'normal', 'weekend', 'holiday', 'festival', 'special'
 */
export const getDayType = (date) => {
  const dateStr = formatDate(date);
  
  // Check if it's a special day
  if (SPECIAL_DAYS_2025[dateStr]) {
    return SPECIAL_DAYS_2025[dateStr].type;
  }
  
  // Check if it's a weekend
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'weekend';
  }
  
  return 'normal';
};

/**
 * Get special day info for a given date
 * @param {Date} date 
 * @returns {Object|null} Special day info or null
 */
export const getSpecialDayInfo = (date) => {
  const dateStr = formatDate(date);
  return SPECIAL_DAYS_2025[dateStr] || null;
};

/**
 * Get crowd multiplier for a given date
 * @param {Date} date 
 * @returns {number} Crowd multiplier
 */
export const getCrowdMultiplier = (date) => {
  const dayType = getDayType(date);
  const specialDay = getSpecialDayInfo(date);
  
  if (specialDay) {
    return specialDay.crowdMultiplier;
  }
  
  return DAY_TYPES[dayType].multiplier;
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get all special days in a given month
 * @param {number} year 
 * @param {number} month (0-11)
 * @returns {Array} Array of special days
 */
export const getSpecialDaysInMonth = (year, month) => {
  const specialDays = [];
  
  Object.entries(SPECIAL_DAYS_2025).forEach(([dateStr, info]) => {
    const [y, m] = dateStr.split('-').map(Number);
    if (y === year && m === month + 1) {
      specialDays.push({
        date: dateStr,
        ...info
      });
    }
  });
  
  return specialDays;
};

/**
 * Predict crowd level for a specific date and time
 * @param {Date} date 
 * @param {number} hour (0-23)
 * @returns {number} Predicted crowd percentage (0-100)
 */
export const predictCrowdLevel = (date, hour) => {
  // Base hourly profile (6 AM to 6 PM)
  const hourlyProfile = {
    6: 30, 7: 40, 8: 50, 9: 70, 10: 85, 11: 90,
    12: 85, 13: 75, 14: 70, 15: 80, 16: 85, 17: 75, 18: 50
  };
  
  const baseLevel = hourlyProfile[hour] || 20;
  const multiplier = getCrowdMultiplier(date);
  
  return Math.min(100, Math.round(baseLevel * multiplier));
};
