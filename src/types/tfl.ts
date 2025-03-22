/**
 * Timing information for a prediction
 */
export interface PredictionTiming {
  $type: string;
  countdownServerAdjustment: string;
  source: string;
  insert?: string;
  read?: string;
  sent?: string;
  received?: string;
}

/**
 * Vehicle position data from TFL API
 */
export interface VehiclePosition {
  $type: string;
  id: string;
  bearing: string;
  currentLocation: string;
  destinationName: string;
  destinationNaptanId: string;
  direction: string; // 'inbound' or 'outbound'
  expectedArrival: string;
  lineId: string;
  lineName: string;
  modeName: string;
  naptanId: string;
  operationType: number;
  platformName: string;
  stationName: string;
  timeToLive: string;
  timeToStation: number; // in seconds
  timestamp: string;
  timing: PredictionTiming;
  towards: string;
  vehicleId: string;
}

/**
 * Status details for a line
 */
export interface LineStatusDetail {
  $type: string;
  statusSeverity: number;
  statusSeverityDescription: string;
  reason?: string;
  disruption?: {
    $type: string;
    category: string;
    categoryDescription: string;
    description: string;
  };
}

/**
 * Line status information
 */
export interface LineStatus {
  $type: string;
  id: string;
  name: string;
  modeName: string;
  lineStatuses: LineStatusDetail[];
}

/**
 * Station information with map coordinates
 */
export interface Station {
  id: string;
  name: string;
  x: number; // x-coordinate on the map
  y: number; // y-coordinate on the map
}

/**
 * Train position with coordinates for display on map
 */
export interface TrainPosition {
  id: string;
  vehicleId: string;
  x: number;
  y: number;
  destinationName: string;
  direction: string;
  timeToStation: number;
  currentLocation: string;
}
