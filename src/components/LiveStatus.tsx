// LiveStatus.tsx
import React, { useState } from 'react';
import { Train } from 'lucide-react';
import useSWR from 'swr';
import { fetchLineStatus, fetchTrainPositions } from '../lib/api';
import { LineStatus, VehiclePosition } from '../types/tfl';
import TrainBlock from './TrainBlock';

// Define positions for key stations on the Northern line
// These would be coordinates matching your map's layout
const stationPositions: Record<string, { x: number; y: number }> = {
  '940GZZLUKNG': { x: 150, y: 300 }, // Kennington
  '940GZZLUMDN': { x: 150, y: 400 }, // Morden
  '940GZZLUMGT': { x: 200, y: 150 }, // Moorgate
  '940GZZLUBKR': { x: 180, y: 180 }, // Bank
  // Add more stations as needed
};

// Define positions for sections of track
const trackSections: Record<string, { x: number; y: number }> = {
  'Between Moorgate and Bank': { x: 190, y: 165 },
  'Between Bank and London Bridge': { x: 200, y: 210 },
  'At Kennington Underground Station': { x: 150, y: 300 },
  'At platform': { x: 150, y: 290 },
  // Add more track sections as needed
};

const LiveStatus: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<VehiclePosition | null>(
    null
  );

  const { data: status, error: statusError } = useSWR<LineStatus[]>(
    'lineStatus',
    fetchLineStatus,
    { refreshInterval: 60000 } // Refresh every minute
  );

  const { data: trains } = useSWR<VehiclePosition[]>(
    'trainPositions',
    fetchTrainPositions,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  if (statusError) {
    return (
      <div className="p-4 text-red-600">
        Error loading line status: {statusError.message}
      </div>
    );
  }

  const lineStatus =
    status?.[0]?.lineStatuses?.[0]?.statusSeverityDescription || 'Loading...';
  const activeTrains = trains?.length || 0;

  // Function to determine train position based on current location or station
  const getTrainPosition = (train: VehiclePosition) => {
    // Check if train is at a known station
    if (train.naptanId && stationPositions[train.naptanId]) {
      return stationPositions[train.naptanId];
    }

    // Check if train is on a known track section
    for (const [section, position] of Object.entries(trackSections)) {
      if (train.currentLocation.includes(section)) {
        return position;
      }
    }

    // Fallback position if location is unknown
    return { x: 100, y: 100 };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Train className="w-6 h-6" />
        <h2 className="text-xl font-bold">Northern Line Status</h2>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="font-medium">Service Status</span>
          <span
            className={`${
              lineStatus === 'Good Service'
                ? 'text-green-600'
                : 'text-orange-500'
            }`}
          >
            {lineStatus}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="font-medium">Active Trains</span>
          <span className="bg-black text-white px-2 py-1 rounded">
            {activeTrains}
          </span>
        </div>
      </div>

      {/* Train Details Section */}
      {selectedTrain && (
        <div className="p-3 bg-gray-100 rounded-md mb-4">
          <h3 className="font-bold mb-2">Train Details</h3>
          <p className="text-sm">ID: {selectedTrain.vehicleId}</p>
          <p className="text-sm">Location: {selectedTrain.currentLocation}</p>
          <p className="text-sm">
            Destination: {selectedTrain.destinationName}
          </p>
          <p className="text-sm">Platform: {selectedTrain.platformName}</p>
          <p className="text-sm">
            Arrival: {Math.round(selectedTrain.timeToStation / 60)} mins
          </p>
          <button
            className="mt-2 text-xs bg-gray-200 px-2 py-1 rounded"
            onClick={() => setSelectedTrain(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Train List Section */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Next Trains</h3>
        <div className="space-y-2">
          {trains?.slice(0, 3).map((train) => (
            <div key={train.id} className="p-2 bg-gray-50 rounded text-sm">
              <div className="font-medium">{train.destinationName}</div>
              <div className="text-gray-600">
                {train.currentLocation} • {Math.round(train.timeToStation / 60)}{' '}
                mins
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default LiveStatus;
