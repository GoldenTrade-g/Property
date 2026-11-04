import { useState } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Building2,
  Layers,
  Info
} from 'lucide-react';
import { mapZones, properties } from '../data/properties';

type ZoneType = 'all' | 'green' | 'blue' | 'red';

export default function MapView() {
  const [activeFilter, setActiveFilter] = useState<ZoneType>('all');
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  const filteredZones = activeFilter === 'all' 
    ? mapZones 
    : mapZones.filter(z => z.type === activeFilter);

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'green': return 'rgba(16, 185, 129, 0.3)';
      case 'blue': return 'rgba(6, 182, 212, 0.3)';
      case 'red': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(16, 185, 129, 0.3)';
    }
  };

  const getZoneBorder = (type: string) => {
    switch (type) {
      case 'green': return 'rgba(16, 185, 129, 0.6)';
      case 'blue': return 'rgba(6, 182, 212, 0.6)';
      case 'red': return 'rgba(239, 68, 68, 0.6)';
      default: return 'rgba(16, 185, 129, 0.6)';
    }
  };

  const getZoneLabel = (type: string) => {
    switch (type) {
      case 'green': return 'High Demand';
      case 'blue': return 'Upcoming Infra';
      case 'red': return 'Risk Zone';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Legend & Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Smart Investment Map — NCR Region
            </h3>
            <p className="text-xs text-gray-400 mt-1">Color-coded heatmap showing demand zones, infrastructure & risk areas</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === 'all' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Zones
            </button>
            <button
              onClick={() => setActiveFilter('green')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeFilter === 'green' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Green
            </button>
            <button
              onClick={() => setActiveFilter('blue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeFilter === 'blue' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Blue
            </button>
            <button
              onClick={() => setActiveFilter('red')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeFilter === 'red' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 bg-red-400 rounded-full" /> Red
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/60" />
            <span className="text-xs text-gray-400">High Rental Demand / Low Vacancy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500/30 border border-cyan-500/60" />
            <span className="text-xs text-gray-400">Upcoming Infrastructure (Metro/Airport)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500/60" />
            <span className="text-xs text-gray-400">Legal Litigation / Acquisition Risk</span>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="relative w-full h-[500px] bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b7280" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Roads/Highways */}
          <svg className="absolute inset-0 w-full h-full">
            {/* NH-48 */}
            <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="#4b5563" strokeWidth="2" strokeDasharray="8 4" />
            <text x="50%" y="48%" fill="#6b7280" fontSize="10" textAnchor="middle">NH-48</text>
            
            {/* Yamuna Expressway */}
            <line x1="70%" y1="30%" x2="85%" y2="80%" stroke="#4b5563" strokeWidth="2" strokeDasharray="8 4" />
            <text x="80%" y="55%" fill="#6b7280" fontSize="10" textAnchor="middle">Yamuna Exp.</text>
            
            {/* Dwarka Expressway */}
            <line x1="15%" y1="40%" x2="35%" y2="65%" stroke="#4b5563" strokeWidth="2" strokeDasharray="8 4" />
            <text x="22%" y="55%" fill="#6b7280" fontSize="10" textAnchor="middle">Dwarka Exp.</text>

            {/* Metro Line */}
            <line x1="30%" y1="30%" x2="70%" y2="50%" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="50%" y="38%" fill="#818cf8" fontSize="9" textAnchor="middle">🚇 Metro Extension</text>
          </svg>

          {/* Zone Circles */}
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ 
                left: `${zone.x}%`, 
                top: `${zone.y}%`,
              }}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <div 
                className="rounded-full transition-all duration-300"
                style={{ 
                  width: `${zone.radius * 2}px`, 
                  height: `${zone.radius * 2}px`,
                  backgroundColor: getZoneColor(zone.type),
                  border: `2px solid ${getZoneBorder(zone.type)}`,
                  transform: hoveredZone === zone.id ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className={`w-4 h-4 mx-auto mb-0.5 ${
                      zone.type === 'green' ? 'text-emerald-400' : 
                      zone.type === 'blue' ? 'text-cyan-400' : 'text-red-400'
                    }`} />
                    <span className="text-[9px] text-white font-medium whitespace-nowrap">{zone.name}</span>
                  </div>
                </div>
              </div>
              
              {/* Tooltip */}
              {hoveredZone === zone.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl z-10">
                  <p className="text-xs font-bold text-white">{zone.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{zone.label}</p>
                  <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                    zone.type === 'green' ? 'bg-emerald-500/10 text-emerald-400' :
                    zone.type === 'blue' ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {zone.type === 'green' && <TrendingUp className="w-3 h-3" />}
                    {zone.type === 'blue' && <Building2 className="w-3 h-3" />}
                    {zone.type === 'red' && <AlertTriangle className="w-3 h-3" />}
                    {getZoneLabel(zone.type)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Property Markers */}
          {properties.map((prop, idx) => {
            const positions = [
              { x: 62, y: 30 },
              { x: 28, y: 38 },
              { x: 45, y: 72 },
              { x: 55, y: 45 },
              { x: 72, y: 55 },
              { x: 38, y: 68 },
            ];
            const pos = positions[idx] || { x: 50, y: 50 };
            return (
              <div
                key={prop.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className="relative group">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${prop.imageGradient} flex items-center justify-center shadow-lg border-2 border-white/20`}>
                    <span className="text-xs">
                      {prop.type === 'Warehouse' ? '🏗️' : prop.type === 'Industrial' ? '🏭' : prop.type === 'Commercial' ? '🏢' : '🏠'}
                    </span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-40 bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-xl">
                    <p className="text-[10px] font-bold text-white">{prop.name}</p>
                    <p className="text-[9px] text-gray-400">₹{prop.totalPrice}L | {prop.rentalYield}% yield</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Compass */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center border border-gray-700">
            <span className="text-xs font-bold text-white">N</span>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-500" />
          </div>

          {/* Scale */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-16 h-0.5 bg-gray-400" />
            <span className="text-[10px] text-gray-400">~20km</span>
          </div>
        </div>
      </div>

      {/* Zone Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <h4 className="text-sm font-bold text-emerald-400">Green Zones</h4>
          </div>
          <p className="text-xs text-gray-300 mb-3">High rental demand, low vacancy. Ideal for immediate income generation.</p>
          <div className="space-y-2">
            {mapZones.filter(z => z.type === 'green').map(z => (
              <div key={z.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <span className="text-xs text-white">{z.name}</span>
                <span className="text-[10px] text-emerald-400">8-12% yield</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-cyan-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-cyan-500 rounded-full" />
            <h4 className="text-sm font-bold text-cyan-400">Blue Vectors</h4>
          </div>
          <p className="text-xs text-gray-300 mb-3">Upcoming infrastructure — Metro extensions, airports, expressways.</p>
          <div className="space-y-2">
            {mapZones.filter(z => z.type === 'blue').map(z => (
              <div key={z.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <span className="text-xs text-white">{z.name}</span>
                <span className="text-[10px] text-cyan-400">15-20% appreciation</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <h4 className="text-sm font-bold text-red-400">Red Flags</h4>
          </div>
          <p className="text-xs text-gray-300 mb-3">Heavy legal litigation or pending government land acquisition notices.</p>
          <div className="space-y-2">
            {mapZones.filter(z => z.type === 'red').map(z => (
              <div key={z.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <span className="text-xs text-white">{z.name}</span>
                <span className="text-[10px] text-red-400">⚠️ Avoid</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-400">DATA SOURCES</span>
        </div>
        <p className="text-xs text-gray-300">
          Map data sourced from <span className="text-cyan-400">MapmyIndia Workmate API</span> (superior data for Indian industrial zones, 
          upcoming expressways, and metro corridors). Risk zones identified via <span className="text-amber-400">Landeed API</span> for 
          encumbrance certificates and litigation checks. Infrastructure data from state government master plans.
        </p>
      </div>
    </div>
  );
}
