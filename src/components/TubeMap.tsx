import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Train, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { fetchTrainPositions } from '../lib/api';
import { TrainPosition } from '../types/tfl';
import TrainBlock from './TrainBlock';
import useTrainPositions from '../hooks/useTrainPositions';
import { northernLineStations } from '../data/stations';

// Interface for zoom and pan state
interface ViewportState {
  scale: number;
  position: { x: number; y: number };
}

/**
 * TubeMap component displays the Northern line map with train positions
 */
const TubeMap: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<TrainPosition | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // State for zoom and pan
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    position: { x: 0, y: 0 }
  });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fetch train positions with SWR
  const { data: trains, error } = useSWR(
    'trainPositions',
    fetchTrainPositions,
    { refreshInterval: 10000 } // Refresh every 10 seconds
  );

  // Use our custom hook for smooth train animations
  const trainPositions = useTrainPositions(trains, northernLineStations);

  // Zoom functions
  const handleZoomIn = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.5, 10)
    }));
  };

  const handleZoomOut = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.5, 0.5)
    }));
  };

  const handleReset = () => {
    setViewport({
      scale: 1,
      position: { x: 0, y: 0 }
    });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Get mouse position relative to SVG
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    // Calculate point in SVG coordinates before zoom
    const pointXBeforeZoom = mouseX / viewport.scale - viewport.position.x;
    const pointYBeforeZoom = mouseY / viewport.scale - viewport.position.y;

    // Adjust scale based on wheel direction (smaller increments for smoother zoom)
    const zoomFactor = 1.05; // Reduced from 1.1 for finer control
    const newScale =
      e.deltaY < 0
        ? Math.min(viewport.scale * zoomFactor, 10) // Zoom in
        : Math.max(viewport.scale / zoomFactor, 0.5); // Zoom out

    // Calculate how the point would move after the zoom
    const pointXAfterZoom = mouseX / newScale - viewport.position.x;
    const pointYAfterZoom = mouseY / newScale - viewport.position.y;

    // Adjust position to keep the point under the mouse stable
    const newPosition = {
      x: viewport.position.x + (pointXAfterZoom - pointXBeforeZoom),
      y: viewport.position.y + (pointYAfterZoom - pointYBeforeZoom),
    };

    setViewport({
      scale: newScale,
      position: newPosition
    });
  };

  // Pan handling with improved smoothness
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    e.preventDefault();
    setDragging(true);
    setDragStart({
      x: e.clientX / viewport.scale - viewport.position.x,
      y: e.clientY / viewport.scale - viewport.position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const newPosition = {
      x: e.clientX / viewport.scale - dragStart.x,
      y: e.clientY / viewport.scale - dragStart.y,
    };
    setViewport(prev => ({
      ...prev,
      position: newPosition
    }));
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
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({
      x: e.touches[0].clientX / viewport.scale - viewport.position.x,
      y: e.touches[0].clientY / viewport.scale - viewport.position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    e.preventDefault(); // Prevent scrolling
    setViewport(prev => ({
      ...prev,
      position: {
        x: e.touches[0].clientX / prev.scale - dragStart.x,
        y: e.touches[0].clientY / prev.scale - dragStart.y,
      }
    }));
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  // Adjust station label size based on zoom
  const stationLabelSize = Math.max(2 / viewport.scale, 1);
  const stationCircleSize = Math.max(1 / viewport.scale, 0.5);
  const lineWidth = Math.max(1 / viewport.scale, 0.5);

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
          transform={`translate(${viewport.position.x}, ${viewport.position.y}) scale(${viewport.scale})`}
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
          {northernLineStations.map((station) => (
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
              scale={viewport.scale}
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

export default TubeMap;
