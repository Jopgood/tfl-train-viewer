import React, { useState } from 'react';
import { Train } from 'lucide-react';
import useSWR from 'swr';
import { fetchLineStatus, fetchTrainPositions } from '../lib/api';
import { LineStatus, VehiclePosition } from '../types/tfl';

/**
 * LiveStatus component shows real-time information about Northern Line status
 * and upcoming trains in a sidebar
 */
const LiveStatus: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<VehiclePosition | null>(null);

  // Fetch line status with SWR
  const { data: status, error: statusError } = useSWR<LineStatus[]>(
    'lineStatus',
    fetchLineStatus,
    { refreshInterval: 60000 } // Refresh every minute
  );

  // Fetch train positions with SWR
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

  // Get current line status
  const lineStatus =
    status?.[0]?.lineStatuses?.[0]?.statusSeverityDescription || 'Loading...';
  const activeTrains = trains?.length || 0;

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
          {!trains && <div className="text-gray-500">Loading trains...</div>}
          
          {trains?.length === 0 && (
            <div className="text-gray-500">No trains currently available</div>
          )}
          
          {trains?.slice(0, 5).map((train) => (
            <button
              key={train.id}
              className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm text-left transition-colors"
              onClick={() => setSelectedTrain(train)}
            >
              <div className="font-medium">{train.destinationName}</div>
              <div className="text-gray-600 text-xs">
                {train.currentLocation} • {Math.round(train.timeToStation / 60)}{' '}
                mins
              </div>
            </button>
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
