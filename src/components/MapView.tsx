import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers,
  MapPin
} from 'lucide-react';
import { mapZones, properties, Property } from '../data/properties';

type ZoneType = 'all' | 'green' | 'blue' | 'red';

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeFilter, setActiveFilter] = useState<ZoneType>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on NCR region
    const map = L.map(mapRef.current, {
      center: [28.45, 77.1],
      zoom: 9,
      zoomControl: true,
    });

    // OpenStreetMap tiles (free, no API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update overlays when filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const filteredZones = activeFilter === 'all' 
      ? mapZones 
      : mapZones.filter(z => z.type === activeFilter);

    // Add zone circles
    filteredZones.forEach((zone) => {
      const color = zone.type === 'green' ? '#10b981' : 
                    zone.type === 'blue' ? '#06b6d4' : '#ef4444';
      
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="font-size: 13px;">${zone.name}</strong><br/>
          <span style="font-size: 11px; color: #6b7280;">${zone.label}</span>
        </div>
      `);
    });

    // Add property markers
    properties.forEach((prop) => {
      const iconColor = prop.type === 'Warehouse' ? '#f97316' : 
                        prop.type === 'Industrial' ? '#eab308' : 
                        prop.type === 'Commercial' ? '#3b82f6' : '#10b981';
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 32px; 
          height: 32px; 
          background: ${iconColor}; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
        ">${prop.type === 'Warehouse' ? '🏗️' : prop.type === 'Industrial' ? '🏭' : prop.type === 'Commercial' ? '🏢' : '🏠'}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon }).addTo(map);
      
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px; min-width: 200px;">
          <strong style="font-size: 13px;">${prop.name}</strong><br/>
          <span style="font-size: 11px; color: #6b7280;">${prop.location}</span><br/>
          <div style="margin-top: 8px; display: flex; gap: 8px;">
            <span style="font-size: 11px; background: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 4px;">₹${prop.totalPrice}L</span>
            <span style="font-size: 11px; background: #ecfdf5; color: #059669; padding: 2px 6px; border-radius: 4px;">${prop.rentalYield}% yield</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedProperty(prop);
      });
    });

  }, [activeFilter]);

  return (
    <div className="space-y-6">
      {/* Legend & Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Interactive Investment Map
            </h3>
            <p className="text-xs text-gray-400 mt-1">Click markers to view property details. Filter by zone type below.</p>
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
              <span className="w-2 h-2 bg-emerald-400 rounded-full" /> High Demand
            </button>
            <button
              onClick={() => setActiveFilter('blue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeFilter === 'blue' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full" /> Upcoming
            </button>
            <button
              onClick={() => setActiveFilter('red')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeFilter === 'red' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 bg-red-400 rounded-full" /> Risk
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/60" />
            <span className="text-xs text-gray-400">High Rental Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500/30 border border-cyan-500/60" />
            <span className="text-xs text-gray-400">Upcoming Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500/60" />
            <span className="text-xs text-gray-400">Risk Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-400">Commercial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-400">Industrial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-400">Warehouse</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-[550px]"
          style={{ zIndex: 1 }}
        />
      </div>

      {/* Property List Below Map */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Properties on Map ({properties.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {properties.map((prop) => (
            <button
              key={prop.id}
              onClick={() => setSelectedProperty(prop)}
              className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${prop.imageGradient} flex items-center justify-center text-lg shrink-0`}>
                  {prop.type === 'Warehouse' ? '🏗️' : prop.type === 'Industrial' ? '🏭' : prop.type === 'Commercial' ? '🏢' : '🏠'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{prop.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{prop.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-emerald-400 font-bold">₹{prop.totalPrice}L</span>
                    <span className="text-[10px] text-cyan-400">{prop.rentalYield}%</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zone Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <h4 className="text-sm font-bold text-emerald-400">High Demand Zones</h4>
          </div>
          <p className="text-xs text-gray-300 mb-3">Strong rental demand with low vacancy rates. Ideal for immediate income.</p>
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
            <h4 className="text-sm font-bold text-cyan-400">Upcoming Infrastructure</h4>
          </div>
          <p className="text-xs text-gray-300 mb-3">Metro extensions, airports, expressways — high appreciation potential.</p>
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
            <h4 className="text-sm font-bold text-red-400">Risk Zones</h4>
          </div>
          <p className="text-xs text-gray-300 mb-3">Legal litigation or pending government acquisition notices.</p>
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

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700"
            >
              ✕
            </button>
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedProperty.imageGradient} flex items-center justify-center text-3xl mb-4`}>
              {selectedProperty.type === 'Warehouse' ? '🏗️' : selectedProperty.type === 'Industrial' ? '🏭' : selectedProperty.type === 'Commercial' ? '🏢' : '🏠'}
            </div>
            <h3 className="text-lg font-bold text-white">{selectedProperty.name}</h3>
            <p className="text-xs text-gray-400 mb-4">{selectedProperty.location}, {selectedProperty.city}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-[10px] text-gray-400">Total Price</p>
                <p className="text-sm font-bold text-white">₹{selectedProperty.totalPrice}L</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-[10px] text-gray-400">Monthly Rent</p>
                <p className="text-sm font-bold text-emerald-400">₹{selectedProperty.avgMonthlyRent.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-[10px] text-gray-400">Loan (80% / 15yr)</p>
                <p className="text-sm font-bold text-cyan-400">₹{(selectedProperty.totalPrice * 0.8).toFixed(0)}L</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-[10px] text-gray-400">Investment Req.</p>
                <p className="text-sm font-bold text-amber-400">₹{selectedProperty.investmentRequired.totalInvestment}L</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Nearby Services:</p>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div className="p-1.5 bg-blue-500/10 rounded text-center">
                  <p className="text-xs font-bold text-blue-400">{selectedProperty.nearbyServices.schools}</p>
                  <p className="text-[9px] text-gray-400">Schools</p>
                </div>
                <div className="p-1.5 bg-red-500/10 rounded text-center">
                  <p className="text-xs font-bold text-red-400">{selectedProperty.nearbyServices.hospitals}</p>
                  <p className="text-[9px] text-gray-400">Hospitals</p>
                </div>
                <div className="p-1.5 bg-cyan-500/10 rounded text-center">
                  <p className="text-xs font-bold text-cyan-400">{selectedProperty.nearbyServices.metro}km</p>
                  <p className="text-[9px] text-gray-400">Metro</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Area Prospects:</p>
              <div className="space-y-1">
                {selectedProperty.areaProspects.slice(0, 2).map((prospect, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className="text-emerald-400 text-[10px] mt-0.5">✓</span>
                    <p className="text-[10px] text-gray-300">{prospect}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/${selectedProperty.builderPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                💬 WhatsApp Builder
              </a>
              <a
                href={`tel:+${selectedProperty.builderPhone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                📞 Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
