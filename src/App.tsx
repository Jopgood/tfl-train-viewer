import TubeMap from './components/TubeMap';
import LiveStatus from './components/LiveStatus';
import { Ungroup as Underground } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#000000] text-white p-4">
        <div className="container mx-auto flex items-center gap-2">
          <Underground className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Northern Line Live Tracker</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <TubeMap />
          </div>
          <div>
            <LiveStatus />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>Data provided by Transport for London</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
