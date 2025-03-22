// types/tfl.ts
export interface PredictionTiming {
  $type: string;
  countdownServerAdjustment: string;
  source: string;
  insert?: string;
  read?: string;
  sent?: string;
  received?: string;
}

export interface VehiclePosition {
  $type: string;
  id: string;
  bearing: string;
  currentLocation: string;
  destinationName: string;
  destinationNaptanId: string;
  direction: string;
  expectedArrival: string;
  lineId: string;
  lineName: string;
  modeName: string;
  naptanId: string;
  operationType: number;
  platformName: string;
  stationName: string;
  timeToLive: string;
  timeToStation: number;
  timestamp: string;
  timing: PredictionTiming;
  towards: string;
  vehicleId: string;
}

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

export interface LineStatus {
  $type: string;
  id: string;
  name: string;
  modeName: string;
  lineStatuses: LineStatusDetail[];
}

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
}

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
