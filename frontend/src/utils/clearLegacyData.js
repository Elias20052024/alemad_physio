/**
 * Utility to clear old/stale localStorage data
 * Run once to migrate from localStorage to database-only mode
 */

export const clearLegacyData = () => {
  // Keep only essential auth data
  const essentialKeys = [
    'token',
    'userId',
    'userRole',
    'userName',
    'userEmail',
    'isLoggedIn',
    'adminPortalTab'
  ];

  // Get all localStorage keys
  const allKeys = Object.keys(localStorage);

  // Remove anything that's not essential (old booking data, etc.)
  allKeys.forEach(key => {
    if (!essentialKeys.includes(key)) {
      console.log(`🗑️  Removing: ${key}`);
      localStorage.removeItem(key);
    }
  });

  console.log('✅ Legacy data cleared! All future data will come from the database.');
};

/**
 * Run this in browser console to clean up:
 * import { clearLegacyData } from '@/utils/clearLegacyData'
 * clearLegacyData()
 */
