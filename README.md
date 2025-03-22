# TFL Northern Line Train Viewer

A real-time visualization tool for tracking trains on the Transport for London (TFL) Northern Line.

## Features

- Interactive SVG-based map of the Northern Line with all stations
- Real-time train positions updated from the TFL API
- Live service status updates
- Train details with arrival predictions
- Zoomable and pannable map for easy navigation
- Mobile-responsive design

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- SWR for data fetching
- Lucide React for icons
- Vite for build system

## Project Structure

```
src/
  components/        # React components
    LiveStatus.tsx   # Line status and upcoming train info
    TrainBlock.tsx   # Individual train visualization
    TubeMap.tsx      # Interactive map component
  data/
    stations.ts      # Northern line station data
  hooks/
    useTrainPositions.ts  # Custom hook for train positioning
  lib/
    api.ts           # TFL API client functions
  types/
    tfl.ts           # TypeScript definitions
  App.tsx            # Main app component
  main.tsx           # App entry point
```

## Setup and Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

## API Usage

This application uses the Transport for London (TFL) Unified API to fetch:
- Real-time train arrivals
- Line status information
- Station details

## License

Created with StackBlitz ⚡️
