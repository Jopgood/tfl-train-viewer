import { Station, StationPositionMap, TrackSectionMap } from '../types/tfl';

// Northern Line stations with their coordinates on the SVG map
export const northernLineStations: Station[] = [
  { id: 'high-barnet', name: 'High Barnet', x: 50, y: 5 },
  { id: 'totteridge', name: 'Totteridge & Whetstone', x: 50, y: 10 },
  { id: 'woodside-park', name: 'Woodside Park', x: 50, y: 15 },
  { id: 'west-finchley', name: 'West Finchley', x: 50, y: 20 },
  { id: 'mill-hill-east', name: 'Mill Hill East', x: 65, y: 25 },
  { id: 'finchley-central', name: 'Finchley Central', x: 50, y: 25 },
  { id: 'east-finchley', name: 'East Finchley', x: 50, y: 30 },
  { id: 'highgate', name: 'Highgate', x: 50, y: 35 },
  { id: 'archway', name: 'Archway', x: 50, y: 40 },
  { id: 'tufnell-park', name: 'Tufnell Park', x: 50, y: 45 },
  { id: 'kentish-town', name: 'Kentish Town', x: 50, y: 50 },
  
  { id: 'edgware', name: 'Edgware', x: 30, y: 5 },
  { id: 'burnt-oak', name: 'Burnt Oak', x: 30, y: 10 },
  { id: 'colindale', name: 'Colindale', x: 30, y: 15 },
  { id: 'hendon-central', name: 'Hendon Central', x: 30, y: 20 },
  { id: 'brent-cross', name: 'Brent Cross', x: 30, y: 25 },
  { id: 'golders-green', name: 'Golders Green', x: 30, y: 30 },
  { id: 'hampstead', name: 'Hampstead', x: 30, y: 35 },
  { id: 'belsize-park', name: 'Belsize Park', x: 30, y: 40 },
  { id: 'chalk-farm', name: 'Chalk Farm', x: 30, y: 45 },
  
  { id: 'camden-town', name: 'Camden Town', x: 40, y: 55 },
  { id: 'mornington-crescent', name: 'Mornington Crescent', x: 40, y: 60 },
  { id: 'euston', name: 'Euston', x: 40, y: 65 },
  { id: 'warren-street', name: 'Warren Street', x: 40, y: 70 },
  { id: 'goodge-street', name: 'Goodge Street', x: 40, y: 75 },
  { id: 'tottenham-court-road', name: 'Tottenham Court Road', x: 40, y: 80 },
  { id: 'leicester-square', name: 'Leicester Square', x: 40, y: 85 },
  
  // Charing Cross branch
  { id: 'charing-cross', name: 'Charing Cross', x: 40, y: 90 },
  { id: 'embankment', name: 'Embankment', x: 40, y: 95 },
  { id: 'waterloo', name: 'Waterloo', x: 45, y: 100 },
  
  // Bank branch
  { id: 'moorgate', name: 'Moorgate', x: 60, y: 85 },
  { id: 'bank', name: 'Bank', x: 60, y: 90 },
  { id: 'london-bridge', name: 'London Bridge', x: 60, y: 95 },
  { id: 'borough', name: 'Borough', x: 60, y: 100 },
  { id: 'elephant-castle', name: 'Elephant & Castle', x: 55, y: 105 },
  
  // Common southern section
  { id: 'kennington', name: 'Kennington', x: 50, y: 110 },
  { id: 'oval', name: 'Oval', x: 50, y: 115 },
  { id: 'stockwell', name: 'Stockwell', x: 50, y: 120 },
  { id: 'clapham-north', name: 'Clapham North', x: 50, y: 125 },
  { id: 'clapham-common', name: 'Clapham Common', x: 50, y: 130 },
  { id: 'clapham-south', name: 'Clapham South', x: 50, y: 135 },
  { id: 'balham', name: 'Balham', x: 50, y: 140 },
  { id: 'tooting-bec', name: 'Tooting Bec', x: 50, y: 145 },
  { id: 'tooting-broadway', name: 'Tooting Broadway', x: 50, y: 150 },
  { id: 'colliers-wood', name: 'Colliers Wood', x: 50, y: 155 },
  { id: 'south-wimbledon', name: 'South Wimbledon', x: 50, y: 160 },
  { id: 'morden', name: 'Morden', x: 50, y: 165 },
];

// Create a mapping for TfL station IDs (NaPTAN codes) to coordinates
export const stationPositions: StationPositionMap = {
  // High Barnet branch
  '940GZZLUHBT': { x: 50, y: 5 },  // High Barnet
  '940GZZLUTAW': { x: 50, y: 10 }, // Totteridge & Whetstone
  '940GZZLUWOP': { x: 50, y: 15 }, // Woodside Park
  '940GZZLUWFN': { x: 50, y: 20 }, // West Finchley
  '940GZZLUMHL': { x: 65, y: 25 }, // Mill Hill East
  '940GZZLUFYC': { x: 50, y: 25 }, // Finchley Central
  '940GZZLUEFY': { x: 50, y: 30 }, // East Finchley
  '940GZZLUHGT': { x: 50, y: 35 }, // Highgate
  '940GZZLUACY': { x: 50, y: 40 }, // Archway
  '940GZZLUTFP': { x: 50, y: 45 }, // Tufnell Park
  '940GZZLUKSH': { x: 50, y: 50 }, // Kentish Town
  
  // Edgware branch
  '940GZZLUEGW': { x: 30, y: 5 },  // Edgware
  '940GZZLUBTK': { x: 30, y: 10 }, // Burnt Oak
  '940GZZLUCDN': { x: 30, y: 15 }, // Colindale
  '940GZZLUHNC': { x: 30, y: 20 }, // Hendon Central
  '940GZZLUBTX': { x: 30, y: 25 }, // Brent Cross
  '940GZZLUGDG': { x: 30, y: 30 }, // Golders Green
  '940GZZLUHMP': { x: 30, y: 35 }, // Hampstead
  '940GZZLUBZP': { x: 30, y: 40 }, // Belsize Park
  '940GZZLUCFM': { x: 30, y: 45 }, // Chalk Farm
  
  // Camden and central section
  '940GZZLUCTN': { x: 40, y: 55 }, // Camden Town
  '940GZZLUMTC': { x: 40, y: 60 }, // Mornington Crescent
  '940GZZLUEUS': { x: 40, y: 65 }, // Euston
  '940GZZLUWRR': { x: 40, y: 70 }, // Warren Street
  '940GZZLUGDG': { x: 40, y: 75 }, // Goodge Street
  '940GZZLUTCR': { x: 40, y: 80 }, // Tottenham Court Road
  '940GZZLULSQ': { x: 40, y: 85 }, // Leicester Square
  
  // Charing Cross branch
  '940GZZLUCHX': { x: 40, y: 90 }, // Charing Cross
  '940GZZLUEMB': { x: 40, y: 95 }, // Embankment
  '940GZZLUWLO': { x: 45, y: 100 }, // Waterloo
  
  // Bank branch
  '940GZZLUMGT': { x: 60, y: 85 }, // Moorgate
  '940GZZLUBKR': { x: 60, y: 90 }, // Bank
  '940GZZLULNB': { x: 60, y: 95 }, // London Bridge
  '940GZZLUBOR': { x: 60, y: 100 }, // Borough
  '940GZZLUEAC': { x: 55, y: 105 }, // Elephant & Castle
  
  // Common southern section
  '940GZZLUKNG': { x: 50, y: 110 }, // Kennington
  '940GZZLUOVL': { x: 50, y: 115 }, // Oval
  '940GZZLUSKW': { x: 50, y: 120 }, // Stockwell
  '940GZZLUCPN': { x: 50, y: 125 }, // Clapham North
  '940GZZLUCPC': { x: 50, y: 130 }, // Clapham Common
  '940GZZLUCPS': { x: 50, y: 135 }, // Clapham South
  '940GZZLUBLM': { x: 50, y: 140 }, // Balham
  '940GZZLUTBC': { x: 50, y: 145 }, // Tooting Bec
  '940GZZLUTBY': { x: 50, y: 150 }, // Tooting Broadway
  '940GZZLUCSD': { x: 50, y: 155 }, // Colliers Wood
  '940GZZLUSWN': { x: 50, y: 160 }, // South Wimbledon
  '940GZZLUMDN': { x: 50, y: 165 }, // Morden
};

// Define positions for sections of track
export const trackSections: TrackSectionMap = {
  'Between Moorgate and Bank': { x: 60, y: 87.5 },
  'Between Bank and London Bridge': { x: 60, y: 92.5 },
  'Between London Bridge and Borough': { x: 60, y: 97.5 },
  'Between Borough and Elephant & Castle': { x: 57.5, y: 102.5 },
  'Between Elephant & Castle and Kennington': { x: 52.5, y: 107.5 },
  
  'Between Leicester Square and Charing Cross': { x: 40, y: 87.5 },
  'Between Charing Cross and Embankment': { x: 40, y: 92.5 },
  'Between Embankment and Waterloo': { x: 42.5, y: 97.5 },
  'Between Waterloo and Kennington': { x: 47.5, y: 105 },
  
  'At Kennington Underground Station': { x: 50, y: 110 },
  'At platform': { x: 50, y: 110 },
  // Central section
  'Between Camden Town and Euston': { x: 40, y: 60 },
  'Between Euston and Warren Street': { x: 40, y: 67.5 },
  'Between Warren Street and Goodge Street': { x: 40, y: 72.5 },
  'Between Goodge Street and Tottenham Court Road': { x: 40, y: 77.5 },
  'Between Tottenham Court Road and Leicester Square': { x: 40, y: 82.5 },
  // Add more track sections as needed
};
