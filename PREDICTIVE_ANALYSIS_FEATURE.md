# Predictive Analysis Feature

## Overview
The Predictive Analysis feature helps visitors plan their temple visits by providing crowd predictions based on special days, holidays, weekends, and festivals.

## Features

### 📅 Interactive Calendar
- **Color-coded days** showing different crowd levels
- **Special day indicators** with festival/holiday names
- **Click to select** any date for detailed predictions
- **Legend** explaining day types and crowd multipliers

### 📊 Hourly Predictions
- **Hour-by-hour crowd forecasts** (6 AM - 6 PM)
- **Peak time identification** - when to avoid
- **Best time recommendations** - optimal visiting hours
- **Visual charts** with color-coded intensity

### 🎉 Special Days Configuration
The system recognizes multiple types of special days:

#### Day Types & Crowd Multipliers:
- **Normal Days**: 1.0x (baseline)
- **Weekends**: 1.4x (40% more visitors)
- **Holidays**: 1.8x (80% more visitors)
- **Festivals**: 2.5x (150% more visitors)
- **Special Days**: 2.0x (100% more visitors)

#### Configured Special Days (2025):
- **National Holidays**: Republic Day, Independence Day, Gandhi Jayanti
- **Major Festivals**: Holi, Diwali, Dussehra, Janmashtami, Ganesh Chaturthi, etc.
- **Religious Days**: Maha Shivaratri, Ram Navami, Buddha Purnima, etc.

## Usage

### Frontend (React)

#### Navigate to Predictions Page
```
http://localhost:3000/predict
```

#### Two View Modes:
1. **Calendar View** - Interactive calendar with hourly predictions
2. **Monthly Overview** - Statistics and planning tips

#### Components Created:
- `PredictiveCalendar.js` - Interactive calendar component
- `DayPredictionChart.js` - Hourly prediction chart
- `specialDays.js` (utils) - Configuration and logic

### Backend API

#### Get Predictions for a Specific Day
```bash
GET /api/predict/day?date=2025-10-20
```

**Response:**
```json
{
  "date": "2025-10-20",
  "dayType": "festival",
  "specialDay": {
    "type": "festival",
    "name": "Diwali",
    "crowdMultiplier": 3.0
  },
  "predictions": [
    { "hour": 6, "time": "6:00", "crowdLevel": 90 },
    { "hour": 7, "time": "7:00", "crowdLevel": 100 },
    ...
  ]
}
```

#### Get Predictions for a Date Range
```bash
GET /api/predict/range?startDate=2025-10-01&endDate=2025-10-31
```

**Response:**
```json
{
  "predictions": [
    {
      "date": "2025-10-01",
      "dayType": "normal",
      "specialDay": null,
      "predictions": [...]
    },
    ...
  ]
}
```

#### Get All Special Days
```bash
GET /api/predict/special-days
```

**Optional filters:**
```bash
GET /api/predict/special-days?year=2025&month=10
```

**Response:**
```json
{
  "specialDays": [
    {
      "date": "2025-10-20",
      "type": "festival",
      "name": "Diwali",
      "crowdMultiplier": 3.0
    },
    ...
  ]
}
```

## Customization

### Adding New Special Days

#### Frontend: `client/src/utils/specialDays.js`
```javascript
export const SPECIAL_DAYS_2025 = {
  '2025-12-31': { 
    type: 'special', 
    name: 'New Year Eve', 
    crowdMultiplier: 2.0 
  },
  // Add more dates...
};
```

#### Backend: `server/src/utils/specialDays.js`
```javascript
const SPECIAL_DAYS_2025 = {
  '2025-12-31': { 
    type: 'special', 
    name: 'New Year Eve', 
    crowdMultiplier: 2.0 
  },
  // Add more dates...
};
```

### Adjusting Crowd Multipliers

Modify the `DAY_TYPES` object to change base multipliers:

```javascript
export const DAY_TYPES = {
  normal: { label: 'Normal Day', multiplier: 1.0 },
  weekend: { label: 'Weekend', multiplier: 1.4 },
  holiday: { label: 'Holiday', multiplier: 1.8 },
  festival: { label: 'Festival', multiplier: 2.5 },
  special: { label: 'Special Day', multiplier: 2.0 }
};
```

### Customizing Hourly Profiles

Edit the `predictCrowdLevel` function to adjust base hourly patterns:

```javascript
const hourlyProfile = {
  6: 30,  // 6 AM - 30% base crowd
  7: 40,  // 7 AM - 40% base crowd
  8: 50,  // 8 AM - 50% base crowd
  // ... customize as needed
};
```

## Testing

### Start the Backend Server
```bash
cd server
npm run dev
```

### Start the Frontend
```bash
cd client
npm start
```

### Test API Endpoints
```bash
# Test day prediction
curl "http://localhost:5000/api/predict/day?date=2025-10-20"

# Test special days
curl "http://localhost:5000/api/predict/special-days"

# Test range prediction
curl "http://localhost:5000/api/predict/range?startDate=2025-10-01&endDate=2025-10-07"
```

### Navigate to Predict Page
Open browser: `http://localhost:3000/predict`

## Key Benefits

1. **Better Planning** - Visitors can choose optimal times to visit
2. **Reduced Overcrowding** - Distributes visitors across different time slots
3. **Enhanced Experience** - Less waiting time, better temple experience
4. **Data-Driven** - Based on historical patterns and special day multipliers
5. **User-Friendly** - Intuitive calendar interface with visual indicators

## Future Enhancements

- **Weather Integration** - Factor in weather conditions
- **Real-time Adjustments** - Update predictions based on actual crowd data
- **Machine Learning** - Train models on historical data for better accuracy
- **Push Notifications** - Alert users about crowd changes
- **Booking Integration** - Direct booking from prediction page
- **Multi-year Support** - Extend beyond 2025

## Files Modified/Created

### Frontend
- ✅ `client/src/pages/Predict.js` - Enhanced with calendar view
- ✅ `client/src/components/PredictiveCalendar.js` - New calendar component
- ✅ `client/src/components/DayPredictionChart.js` - New chart component
- ✅ `client/src/utils/specialDays.js` - Configuration and utilities

### Backend
- ✅ `server/src/index.js` - Added prediction API endpoints
- ✅ `server/src/utils/specialDays.js` - Backend utilities

## Support

For issues or questions about the predictive analysis feature, please refer to the main README or contact the development team.
