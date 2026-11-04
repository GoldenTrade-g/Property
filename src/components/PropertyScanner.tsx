import { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Shield, 
  Clock,
  MapPin,
  Building
} from 'lucide-react';
import { properties, investmentModes, Property } from '../data/properties';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function PropertyScanner() {
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter(p => {
    const matchesMode = selectedMode === 'all' || p.investmentMode === selectedMode;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by property name, location, or builder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Filter:</span>
          </div>
        </div>

        {/* Investment Mode Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedMode === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Modes
          </button>
          {investmentModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                selectedMode === mode.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Last Scan Info */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs text-gray-400">Last updated: 2 hours ago</span>
        <span className="text-xs text-gray-600">|</span>
        <span className="text-xs text-gray-400">Auto-refreshes every 6 hours</span>
        <span className="text-xs text-gray-600">|</span>
        <span className="text-xs text-emerald-400">{filteredProperties.length} live listings</span>
      </div>

      {/* Property Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Property</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Unit</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Total Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Monthly Rent</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Investment Req.</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Yield</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">RERA</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr 
                  key={property.id} 
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${property.imageGradient} flex items-center justify-center text-lg`}>
                        {property.type === 'Warehouse' ? '🏗️' : property.type === 'Industrial' ? '🏭' : property.type === 'Commercial' ? '🏢' : '🏠'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{property.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{property.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{property.unit}, {property.tower}</p>
                    <p className="text-xs text-gray-400">{property.unitSize} sq.ft</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">₹{property.totalPrice}L</p>
                    <p className="text-[10px] text-gray-400">Loan: ₹{(property.totalPrice * 0.8).toFixed(0)}L / 15yr</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-emerald-400">₹{property.avgMonthlyRent.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">₹{(property.avgMonthlyRent * 12 / 100000).toFixed(1)}L/yr</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-amber-400">₹{property.investmentRequired.totalInvestment}L</p>
                    <p className="text-[10px] text-gray-400">{property.investmentMode} setup</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400">{property.rentalYield}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      property.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      property.status === 'Reserved' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {property.reraVerified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProperty(property); }}
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}
    </div>
  );
}

function PropertyDetailModal({ property, onClose }: { property: Property; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`h-32 bg-gradient-to-br ${property.imageGradient} rounded-t-2xl flex items-center justify-center relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
          >
            ✕
          </button>
          <span className="text-5xl">
            {property.type === 'Warehouse' ? '🏗️' : property.type === 'Industrial' ? '🏭' : property.type === 'Commercial' ? '🏢' : '🏠'}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Title & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-white">{property.name}</h2>
              {property.reraVerified && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  <Shield className="w-3 h-3" /> RERA Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {property.location}, {property.city}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Asking Rate</p>
              <p className="text-sm font-bold text-white">₹{property.askingRate.toLocaleString()}/sq.ft</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Total Price</p>
              <p className="text-sm font-bold text-white">₹{property.totalPrice}L</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Monthly Rent</p>
              <p className="text-sm font-bold text-emerald-400">₹{property.avgMonthlyRent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-xs text-gray-400">Rental Yield</p>
              <p className="text-sm font-bold text-cyan-400">{property.rentalYield}%</p>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              💰 Investment & Loan Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <p className="text-[10px] text-gray-400">Loan Amount (80%)</p>
                <p className="text-sm font-bold text-white">₹{(property.totalPrice * 0.8).toFixed(1)}L</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Loan Tenure</p>
                <p className="text-sm font-bold text-white">15 years</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Down Payment (20%)</p>
                <p className="text-sm font-bold text-white">₹{(property.totalPrice * 0.2).toFixed(1)}L</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Appreciation</p>
                <p className="text-sm font-bold text-cyan-400">{property.appreciationRate}%/yr</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <p className="text-xs font-semibold text-white mb-2">Investment Required for Rental Setup:</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-[10px] text-gray-400">Renovation</p>
                  <p className="text-xs font-bold text-amber-400">₹{property.investmentRequired.renovationCost}L</p>
                </div>
                <div className="p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-[10px] text-gray-400">Setup Cost</p>
                  <p className="text-xs font-bold text-amber-400">₹{property.investmentRequired.setupCost}L</p>
                </div>
                <div className="p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-[10px] text-gray-400">Total Investment</p>
                  <p className="text-xs font-bold text-amber-400">₹{property.investmentRequired.totalInvestment}L</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-300 italic">{property.investmentRequired.description}</p>
            </div>
          </div>

          {/* True Rate History Chart */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              "True Rate" History (₹/sq.ft)
            </h3>
            <div className="h-40 bg-gray-800/30 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={property.priceHistory}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="builderPrice" stroke="#10b981" strokeWidth={2} dot={false} name="Builder Price" />
                  <Line type="monotone" dataKey="resalePrice" stroke="#6366f1" strokeWidth={2} dot={false} name="Resale Price" />
                  <Line type="monotone" dataKey="circleRate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Circle Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-3 h-0.5 bg-emerald-500 rounded" /> Builder Price</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-3 h-0.5 bg-indigo-500 rounded" /> Resale Price</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-3 h-0.5 bg-amber-500 rounded" /> Circle Rate</span>
            </div>
          </div>

          {/* Nearby Services */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              🏪 Nearby Services & Amenities
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-400">{property.nearbyServices.schools}</p>
                <p className="text-[10px] text-gray-400">Schools</p>
              </div>
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                <p className="text-lg font-bold text-red-400">{property.nearbyServices.hospitals}</p>
                <p className="text-[10px] text-gray-400">Hospitals</p>
              </div>
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-center">
                <p className="text-lg font-bold text-cyan-400">{property.nearbyServices.metro}km</p>
                <p className="text-[10px] text-gray-400">Metro</p>
              </div>
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                <p className="text-lg font-bold text-purple-400">{property.nearbyServices.markets}</p>
                <p className="text-[10px] text-gray-400">Markets</p>
              </div>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                <p className="text-lg font-bold text-amber-400">{property.nearbyServices.restaurants}</p>
                <p className="text-[10px] text-gray-400">Restaurants</p>
              </div>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                <p className="text-lg font-bold text-emerald-400">{property.nearbyServices.parks}</p>
                <p className="text-[10px] text-gray-400">Parks</p>
              </div>
            </div>
          </div>

          {/* Area Prospects */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              📈 Area Prospects & Growth Drivers
            </h3>
            <div className="space-y-2">
              {property.areaProspects.map((prospect, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-gray-800/30 rounded-lg">
                  <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                  <p className="text-xs text-gray-300">{prospect}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Generators */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              Demand Generators (within {property.distanceToHub}km)
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.demandGenerators.map((gen, i) => (
                <span key={i} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs">
                  📍 {gen}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Connect */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Builder (RERA Verified)</p>
              <p className="text-sm font-medium text-white">{property.builder}</p>
              <p className="text-xs text-gray-400 mb-3">RERA: {property.reraNumber}</p>
              <a 
                href={`https://wa.me/${property.builderPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                💬 Chat with Builder
              </a>
            </div>
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Dealer</p>
              <p className="text-sm font-medium text-white">{property.dealer}</p>
              <p className="text-xs text-gray-400 mb-3">Phone: {property.dealerPhone}</p>
              <a 
                href={`https://wa.me/${property.dealerPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                💬 WhatsApp Dealer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
