import { useState, useRef, useEffect } from 'react';
import { Station, VehiclePosition, TrainPosition } from '../types/tfl';
import { findStationByLocation } from '../data/stations';

/**
 * Custom hook to calculate and animate train positions based on real-time data
 * @param trains - Array of vehicle positions from the TFL API
 * @param stations - Array of station data with coordinates
 * @returns Array of train positions with map coordinates
 */
export const useTrainPositions = (
  trains: VehiclePosition[] | undefined,
  stations: Station[]
): TrainPosition[] => {
  const [positions, setPositions] = useState<TrainPosition[]>([]);
  const prevPositionsRef = useRef<TrainPosition[]>([]);
  
  // Animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trains || !stations.length) return;

    const calculatePositions = () => {
      const newPositions = trains
        .map((train) => {
          // Find station based on current location
          let currentStation = findStationByLocation(
            train.currentLocation,
            stations
          );

          if (!currentStation && train.stationName) {
            // Try using stationName if provided
            currentStation = stations.find(
              (s) =>
                s.name.includes(
                  train.stationName.replace(' Underground Station', '')
                ) || train.stationName.includes(s.name)
            );
          }

          if (!currentStation) {
            // If still not found, try to place near destination
            const destinationName = train.destinationName.replace(
              ' Underground Station',
              ''
            );
            const destinationStation = stations.find(
              (s) =>
                s.name.includes(destinationName) ||
                destinationName.includes(s.name)
            );

            if (destinationStation) {
              return {
                id: train.id,
                vehicleId: train.vehicleId,
                x: destinationStation.x,
                y: destinationStation.y - 2,
                destinationName: train.destinationName,
                direction: train.direction,
                timeToStation: train.timeToStation,
                currentLocation: train.currentLocation,
              };
            }
            return null;
          }

          return {
            id: train.id,
            vehicleId: train.vehicleId,
            x: currentStation.x,
            y: currentStation.y,
            destinationName: train.destinationName,
            direction: train.direction,
            timeToStation: train.timeToStation,
            currentLocation: train.currentLocation,
          };
        })
        .filter((pos): pos is TrainPosition => pos !== null);

      // Interpolate positions for smooth animation if we have previous positions
      if (prevPositionsRef.current.length > 0) {
        const interpolated = newPositions.map((newPos) => {
          const prevPos = prevPositionsRef.current.find(
            (p) => p.id === newPos.id
          );
          if (prevPos) {
            // Apply a smooth transition
            return {
              ...newPos,
              x: newPos.x * 0.1 + prevPos.x * 0.9, // Gradual movement
              y: newPos.y * 0.1 + prevPos.y * 0.9,
            };
          }
          return newPos;
        });

        setPositions(interpolated);
      } else {
        setPositions(newPositions);
      }

      prevPositionsRef.current = newPositions;

      // Set up the next animation frame
      animationFrameRef.current = requestAnimationFrame(calculatePositions);
    };

    // Initial calculation
    calculatePositions();

    // Clean up animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trains, stations]);

  return positions;
};

export default useTrainPositions;
