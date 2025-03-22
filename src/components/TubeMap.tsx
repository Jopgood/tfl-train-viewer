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

const ZoomableTubeMap = ({ stations }) => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const svgRef = useRef(null);

  // State for zoom and pan
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { data: trains, error } = useSWR(
    'trainPositions',
    fetchTrainPositions,
    { refreshInterval: 10000 } // Refresh every 10 seconds
  );

  // Use our custom hook for smooth train animations
  const trainPositions = useTrainPositions(trains, stations);

  // Zoom functions
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.5, 10));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.5, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();

    // Get mouse position relative to SVG
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    // Calculate point in SVG coordinates before zoom
    const pointXBeforeZoom = mouseX / scale - position.x;
    const pointYBeforeZoom = mouseY / scale - position.y;

    // Adjust scale based on wheel direction (smaller increments for smoother zoom)
    const zoomFactor = 1.05; // Reduced from 1.1 for finer control
    const newScale =
      e.deltaY < 0
        ? Math.min(scale * zoomFactor, 10) // Zoom in
        : Math.max(scale / zoomFactor, 0.5); // Zoom out

    // Calculate how the point would move after the zoom
    const pointXAfterZoom = mouseX / newScale - position.x;
    const pointYAfterZoom = mouseY / newScale - position.y;

    // Adjust position to keep the point under the mouse stable
    const newPosition = {
      x: position.x + (pointXAfterZoom - pointXBeforeZoom),
      y: position.y + (pointYAfterZoom - pointYBeforeZoom),
    };

    setScale(newScale);
    setPosition(newPosition);
  };

  // Pan handling with improved smoothness
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    e.preventDefault();
    setDragging(true);
    setDragStart({
      x: e.clientX / scale - position.x,
      y: e.clientY / scale - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const newPosition = {
      x: e.clientX / scale - dragStart.x,
      y: e.clientY / scale - dragStart.y,
    };
    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Add mouse up event listener to window to handle mouse release outside the component
  useEffect(() => {
    const handleWindowMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({
      x: e.touches[0].clientX / scale - position.x,
      y: e.touches[0].clientY / scale - position.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging || e.touches.length !== 1) return;
    e.preventDefault(); // Prevent scrolling
    setPosition({
      x: e.touches[0].clientX / scale - dragStart.x,
      y: e.touches[0].clientY / scale - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  // Adjust station label size based on zoom
  const stationLabelSize = Math.max(2 / scale, 1);
  const stationCircleSize = Math.max(1 / scale, 0.5);
  const lineWidth = Math.max(1 / scale, 0.5);

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading train positions: {error.message}
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={handleReset}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          title="Reset View"
        >
          <Maximize size={20} />
        </button>
      </div>

      {/* SVG Map */}
      <svg
        ref={svgRef}
        className="w-full h-[800px] touch-none"
        viewBox="0 0 100 170"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        {/* Transform group for zoom and pan */}
        <g
          transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
        >
          {/* Northern Line Paths */}
          {/* High Barnet to Camden */}
          <path
            d="M 50,5 L 50,55"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />
          {/* Mill Hill East Branch */}
          <path
            d="M 50,25 L 65,25"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />
          {/* Edgware to Camden */}
          <path
            d="M 30,5 L 30,45 L 40,55"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />
          {/* Camden to Leicester Square */}
          <path
            d="M 40,55 L 40,85"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />
          {/* Bank Branch */}
          <path
            d="M 40,85 L 60,90 L 60,105 L 50,110"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />
          {/* Charing Cross Branch */}
          <path
            d="M 40,85 L 40,100 L 50,110"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />
          {/* Southern Section */}
          <path
            d="M 50,110 L 50,165"
            stroke="#000000"
            strokeWidth={lineWidth}
            fill="none"
          />

          {/* Stations */}
          {stations.map((station) => (
            <g key={station.id}>
              <circle
                cx={station.x}
                cy={station.y}
                r={stationCircleSize}
                className="fill-white stroke-black"
                strokeWidth={lineWidth / 2}
              />
              <text
                x={station.x + 2}
                y={station.y}
                fontSize={stationLabelSize}
                className="fill-black"
                dominantBaseline="middle"
              >
                {station.name}
              </text>
            </g>
          ))}

          {/* Train Blocks */}
          {trainPositions.map((train) => (
            <TrainBlock
              key={train.id}
              x={train.x}
              y={train.y}
              train={train}
              onClick={() => setSelectedTrain(train)}
              isSelected={selectedTrain?.id === train.id}
              scale={scale}
            />
          ))}
        </g>
      </svg>

      {/* Information panel for selected train */}
      {selectedTrain && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md max-w-xs z-10 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Train className="w-5 h-5" />
            <h3 className="font-bold">Train {selectedTrain.vehicleId}</h3>
            <button
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedTrain(null)}
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Current Location:</strong> {selectedTrain.currentLocation}
            </p>
            <p>
              <strong>Destination:</strong> {selectedTrain.destinationName}
            </p>
            <p>
              <strong>Arrival:</strong>{' '}
              {Math.round(selectedTrain.timeToStation / 60)} minutes
            </p>
            <p>
              <strong>Direction:</strong>
              {selectedTrain.direction === 'inbound'
                ? ' Southbound'
                : ' Northbound'}
            </p>
          </div>
        </div>
      )}

      {/* Active trains counter */}
      <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm z-10">
        {trainPositions.length} Active Trains
      </div>

      {/* Last updated indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 z-10">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ZoomableTubeMap;
