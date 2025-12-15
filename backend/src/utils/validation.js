// Check if a time is within working hours
export const isTimeWithinWorkHours = (time, startTime, endTime) => {
  return time >= startTime && time < endTime;
};

// Convert time string HH:mm to minutes
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes to time string HH:mm
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Check if appointment overlaps with existing appointments
export const hasTimeConflict = (newStart, newEnd, existingAppointments) => {
  return existingAppointments.some(app => {
    const existingStart = timeToMinutes(app.time);
    const existingEnd = existingStart + app.duration;
    
    return (newStart < existingEnd && newEnd > existingStart);
  });
};

// Check if appointment is during a break
export const isTimeWithinBreak = (date, time, duration, breaks) => {
  const appointmentStart = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  appointmentStart.setHours(hours, minutes, 0);
  
  const appointmentEnd = new Date(appointmentStart);
  appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration);

  return breaks.some(breakItem => {
    const breakStart = new Date(breakItem.startTime);
    const breakEnd = new Date(breakItem.endTime);
    
    return (appointmentStart < breakEnd && appointmentEnd > breakStart);
  });
};

// Validate time format HH:mm
export const isValidTimeFormat = (time) => {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};
