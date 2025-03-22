import { VehiclePosition, LineStatus } from '../types/tfl';

const TFL_BASE_URL = 'https://api.tfl.gov.uk';

const buildUrl = (endpoint: string) => {
  const url = new URL(`${TFL_BASE_URL}${endpoint}`);

  return url.toString();
};

export const fetchTrainPositions = async (): Promise<VehiclePosition[]> => {
  try {
    // This endpoint gets arrivals for all stations on the Northern line
    const response = await fetch(buildUrl('/Line/northern/Arrivals'));

    if (!response.ok) {
      throw new Error(`Failed to fetch train positions: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching train positions:', error);
    throw error;
  }
};

export const fetchLineStatus = async (): Promise<LineStatus[]> => {
  try {
    const response = await fetch(buildUrl('/Line/northern/Status'));

    if (!response.ok) {
      throw new Error(`Failed to fetch line status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching line status:', error);
    throw error;
  }
};

export const fetchStationArrivals = async (
  stationId: string
): Promise<VehiclePosition[]> => {
  try {
    const response = await fetch(buildUrl(`/StopPoint/${stationId}/Arrivals`));

    if (!response.ok) {
      throw new Error(`Failed to fetch station arrivals: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching station arrivals:', error);
    throw error;
  }
};
