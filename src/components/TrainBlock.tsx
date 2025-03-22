import React from 'react';
import { TrainPosition } from '../types/tfl';

interface TrainBlockProps {
  x: number;
  y: number;
  train: TrainPosition;
  onClick: () => void;
  isSelected: boolean;
  scale: number;
}

/**
 * SVG-based train block component showing a train's position on the map
 */
const TrainBlock: React.FC<TrainBlockProps> = ({ 
  x, 
  y, 
  train, 
  onClick, 
  isSelected, 
  scale 
}) => {
  const minutesToArrival = Math.round(train.timeToStation / 60);

  // Smaller block size for better visual
  const blockWidth = 4;
  const blockHeight = 4;

  // Adjust font size based on zoom level
  const fontSize = Math.max(1.2 / scale, 0.6);
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
      {/* Train block background */}
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
        {train.vehicleId.slice(-3)}
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

export default TrainBlock;
