import { Station } from '../types/tfl';

// Northern Line stations with coordinates for the map
export const northernLineStations: Station[] = [
  // High Barnet Branch
  { id: '940GZZLUHBT', name: 'High Barnet', x: 50, y: 5 },
  { id: '940GZZLUTWG', name: 'Totteridge & Whetstone', x: 50, y: 10 },
  { id: '940GZZLUWFN', name: 'Woodside Park', x: 50, y: 15 },
  { id: '940GZZLUWOP', name: 'West Finchley', x: 50, y: 20 },
  { id: '940GZZLUFYC', name: 'Finchley Central', x: 50, y: 25 },
  { id: '940GZZLUEGW', name: 'East Finchley', x: 50, y: 30 },
  { id: '940GZZLUHGT', name: 'Highgate', x: 50, y: 35 },
  { id: '940GZZLUACY', name: 'Archway', x: 50, y: 40 },
  { id: '940GZZLUTFP', name: 'Tufnell Park', x: 50, y: 45 },
  { id: '940GZZLUKSH', name: 'Kentish Town', x: 50, y: 50 },
  
  // Mill Hill East Branch
  { id: '940GZZLUMHL', name: 'Mill Hill East', x: 65, y: 25 },
  
  // Edgware Branch
  { id: '940GZZLUEGW', name: 'Edgware', x: 30, y: 5 },
  { id: '940GZZLUBMY', name: 'Burnt Oak', x: 30, y: 10 },
  { id: '940GZZLUCND', name: 'Colindale', x: 30, y: 15 },
  { id: '940GZZLUHTD', name: 'Hendon Central', x: 30, y: 20 },
  { id: '940GZZLUBZP', name: 'Brent Cross', x: 30, y: 25 },
  { id: '940GZZLUGDG', name: 'Golders Green', x: 30, y: 30 },
  { id: '940GZZLUHMP', name: 'Hampstead', x: 30, y: 35 },
  { id: '940GZZLUBLM', name: 'Belsize Park', x: 30, y: 40 },
  { id: '940GZZLUCFM', name: 'Chalk Farm', x: 35, y: 45 },
  
  // Common Branch (Camden to Leicester Square)
  { id: '940GZZLUCTN', name: 'Camden Town', x: 40, y: 55 },
  { id: '940GZZLUMGT', name: 'Mornington Crescent', x: 40, y: 60 },
  { id: '940GZZLUEUS', name: 'Euston', x: 40, y: 65 },
  { id: '940GZZLUWRR', name: 'Warren Street', x: 40, y: 70 },
  { id: '940GZZLUGDG', name: 'Goodge Street', x: 40, y: 75 },
  { id: '940GZZLUTCR', name: 'Tottenham Court Road', x: 40, y: 80 },
  { id: '940GZZLULSQ', name: 'Leicester Square', x: 40, y: 85 },
  
  // Charing Cross Branch
  { id: '940GZZLUCHX', name: 'Charing Cross', x: 40, y: 90 },
  { id: '940GZZLUEMB', name: 'Embankment', x: 40, y: 95 },
  { id: '940GZZLUWLO', name: 'Waterloo', x: 40, y: 100 },
  
  // Bank Branch
  { id: '940GZZLUCHX', name: 'Bank', x: 60, y: 90 },
  { id: '940GZZLUBNK', name: 'Monument', x: 60, y: 95 },
  { id: '940GZZLULNB', name: 'London Bridge', x: 60, y: 100 },
  { id: '940GZZLUBOR', name: 'Borough', x: 60, y: 105 },
  
  // Common Southern Section
  { id: '940GZZLUKNG', name: 'Kennington', x: 50, y: 110 },
  { id: '940GZZLUOVL', name: 'Oval', x: 50, y: 115 },
  { id: '940GZZLUSKT', name: 'Stockwell', x: 50, y: 120 },
  { id: '940GZZLUCLP', name: 'Clapham North', x: 50, y: 125 },
  { id: '940GZZLUCPC', name: 'Clapham Common', x: 50, y: 130 },
  { id: '940GZZLUCSD', name: 'Clapham South', x: 50, y: 135 },
  { id: '940GZZLUBLM', name: 'Balham', x: 50, y: 140 },
  { id: '940GZZLUTBY', name: 'Tooting Bec', x: 50, y: 145 },
  { id: '940GZZLUTBY', name: 'Tooting Broadway', x: 50, y: 150 },
  { id: '940GZZLUCSD', name: 'Colliers Wood', x: 50, y: 155 },
  { id: '940GZZLUSFB', name: 'South Wimbledon', x: 50, y: 160 },
  { id: '940GZZLUMDN', name: 'Morden', x: 50, y: 165 },
];

// Mapping of station locations to coordinates for train positioning
export const stationPositions: Record<string, { x: number; y: number }> = 
  Object.fromEntries(
    northernLineStations.map(station => [station.id, { x: station.x, y: station.y }])
  );

// Define positions for sections of track
export const trackSections: Record<string, { x: number; y: number }> = {
  'Between Moorgate and Bank': { x: 55, y: 90 },
  'Between Bank and London Bridge': { x: 60, y: 97 },
  'Between Leicester Square and Charing Cross': { x: 40, y: 87 },
  'Between Charing Cross and Embankment': { x: 40, y: 92 },
  'Between Embankment and Waterloo': { x: 40, y: 97 },
  'Between Waterloo and Kennington': { x: 45, y: 105 },
  'Between London Bridge and Borough': { x: 60, y: 102 },
  'Between Borough and Kennington': { x: 55, y: 107 },
  'At Kennington Underground Station': { x: 50, y: 110 },
  'At platform': { x: 50, y: 110 },
  // Add more common locations
  'Approaching': { x: 50, y: 107 }, // Generic approaching
  'At': { x: 50, y: 110 }, // Generic at station
  'Leaving': { x: 50, y: 112 }, // Generic leaving
  'Between': { x: 50, y: 112 }, // Generic between stations
};

// Helper function to find station by location string
export const findStationByLocation = (
  locationStr: string, 
  stations: Station[]
): Station | null => {
  // Try to match by exact station name first
  for (const station of stations) {
    if (locationStr.includes(station.name)) {
      return station;
    }
  }

  // Handle "Between X and Y" cases
  if (locationStr.includes('Between')) {
    const parts = locationStr.replace('Between ', '').split(' and ');

    // Try to find both stations
    let station1: Station | null = null;
    let station2: Station | null = null;

    for (const station of stations) {
      if (parts[0].includes(station.name) || station.name.includes(parts[0])) {
        station1 = station;
      }
      if (parts[1]?.includes(station.name) || station.name.includes(parts[1] || '')) {
        station2 = station;
      }
    }

    if (station1 && station2) {
      // Create a midpoint between the two stations
      return {
        id: 'between',
        name: locationStr,
        x: (station1.x + station2.x) / 2,
        y: (station1.y + station2.y) / 2,
      };
    }
  }

  // If no match found, check if the location corresponds to any known track section
  for (const [section, position] of Object.entries(trackSections)) {
    if (locationStr.includes(section)) {
      return {
        id: `track-${section}`,
        name: locationStr,
        x: position.x,
        y: position.y,
      };
    }
  }

  return null;
};
