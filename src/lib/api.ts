import { VehiclePosition, LineStatus } from '../types/tfl';

const TFL_BASE_URL = 'https://api.tfl.gov.uk';

/**
 * Build a TFL API URL
 * @param endpoint - API endpoint path
 * @returns Fully qualified TFL API URL
 */
const buildUrl = (endpoint: string): string => {
  const url = new URL(`${TFL_BASE_URL}${endpoint}`);
  return url.toString();
};

/**
 * Generic fetch function with error handling
 * @param url - URL to fetch
 * @returns Promise with parsed JSON response
 */
const fetchFromTfl = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Fetch error: ${url}`, error);
    throw error;
  }
};

/**
 * Fetch train positions for the Northern line
 */
export const fetchTrainPositions = async (): Promise<VehiclePosition[]> => {
  return fetchFromTfl<VehiclePosition[]>(buildUrl('/Line/northern/Arrivals'));
};

/**
 * Fetch current status of the Northern line
 */
export const fetchLineStatus = async (): Promise<LineStatus[]> => {
  return fetchFromTfl<LineStatus[]>(buildUrl('/Line/northern/Status'));
};

/**
 * Fetch arrivals for a specific station
 * @param stationId - TFL station ID
 */
export const fetchStationArrivals = async (
  stationId: string
): Promise<VehiclePosition[]> => {
  return fetchFromTfl<VehiclePosition[]>(buildUrl(`/StopPoint/${stationId}/Arrivals`));
};
