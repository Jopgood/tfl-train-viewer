import React, { useMemo, useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Train, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { fetchTrainPositions } from '../lib/api';
import { Station, VehiclePosition, TrainPosition } from '../types/tfl';

// Define the SVG-based train block component with smaller size
const TrainBlock = ({ x, y, train, onClick, isSelected, scale }) => {
  const directionArrow = train.direction === 'inbound' ? '↓' : '↑';
  const minutesToArrival = Math.round(train.timeToStation / 60);

  // Smaller block size (was 6x6, now 4x4)
  const blockWidth = 4;
  const blockHeight = 4;

  // Adjust font size based on zoom level - smaller base sizes
  const fontSize = Math.max(1.2 / scale, 0.6);
  const symbolSize = Math.max(1.4 / scale, 0.7);
  const strokeWidth = 0.2 / scale;

  return (
    <g
      transform={`translate(${x - blockWidth / 2}, ${y - blockHeight / 2})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={`transition-transform duration-300 ${
        isSelected ? 'scale-110' : ''
      }`}
    >
      {/* Background */}
      <rect
        width={blockWidth}
        height={blockHeight}
        fill="black"
        rx="0.7"
        ry="0.7"
      />

      {/* Train ID */}
      <text
        x={blockWidth / 2}
        y={blockHeight / 3}
        fill="white"
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {train.vehicleId}
      </text>

      {/* Minutes */}
      <text
        x={blockWidth / 2}
        y={(blockHeight * 2) / 3 + 0.2}
        fill="white"
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {minutesToArrival}m
      </text>

      {/* Direction indicator (small triangle) */}
      <polygon
        points={
          train.direction === 'inbound'
            ? `${blockWidth - 0.8},${blockHeight - 0.8} ${blockWidth - 0.2},${
                blockHeight - 0.8
              } ${blockWidth - 0.5},${blockHeight - 0.2}`
            : `${blockWidth - 0.8},${blockHeight - 0.2} ${blockWidth - 0.2},${
                blockHeight - 0.2
              } ${blockWidth - 0.5},${blockHeight - 0.8}`
        }
        fill="white"
      />

      {/* Selection indicator */}
      {isSelected && (
        <rect
          x="-0.2"
          y="-0.2"
          width={blockWidth + 0.4}
          height={blockHeight + 0.4}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          rx="0.9"
          ry="0.9"
        />
      )}
    </g>
  );
};

// Helper function to find station by location string with improved matching
const findStationByLocation = (locationStr, stations) => {
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
    let station1 = null;
    let station2 = null;

    for (const station of stations) {
      if (parts[0].includes(station.name) || station.name.includes(parts[0])) {
        station1 = station;
      }
      if (parts[1].includes(station.name) || station.name.includes(parts[1])) {
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

  return null;
};

// Calculate train positions and handle animation smoothly
const useTrainPositions = (trains, stations) => {
  const [positions, setPositions] = useState([]);
  const prevPositionsRef = useRef([]);

  useEffect(() => {
    if (!trains) return;

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
        .filter((pos) => pos !== null);

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
    };

    calculatePositions();

    // Set up animation frame for smooth updates
    const animationInterval = setInterval(calculatePositions, 1000); // Update every second

    return () => clearInterval(animationInterval);
  }, [trains, stations]);

  return positions;
};
