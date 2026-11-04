import { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Shield, 
  ExternalLink, 
  Search,
  CheckCircle,
  Building2,
  User,
  Copy,
  Check
} from 'lucide-react';
import { properties } from '../data/properties';

export default function DirectConnect() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.builder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.dealer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">The "No-Broker" Command Center</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              All contacts below are sourced directly from <span className="text-emerald-400 font-semibold">State RERA Portals</span> (UP-RERA, MahaRERA, etc.) 
              and <span className="text-cyan-400 font-semibold">Google Places API</span>. RERA mandates official promoter phone numbers and registered agent 
              details be public — bypassing portal call centers to connect you directly with builders/sales heads.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by property, builder, or dealer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Direct Connect Cards */}
      <div className="space-y-4">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
            {/* Property Header */}
            <div className={`h-2 bg-gradient-to-r ${property.imageGradient}`} />
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${property.imageGradient} flex items-center justify-center text-2xl shrink-0`}>
                    {property.type === 'Warehouse' ? '🏗️' : property.type === 'Industrial' ? '🏭' : property.type === 'Commercial' ? '🏢' : '🏠'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{property.name}</h3>
                    <p className="text-xs text-gray-400">{property.location}, {property.city}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                        {property.unit}, {property.tower}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                        {property.unitSize} sq.ft
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        ₹{property.totalPrice}L
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {property.reraVerified && (
                    <span className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      <CheckCircle className="w-3 h-3" /> RERA Verified
                    </span>
                  )}
                  <span className={`text-xs px-3 py-1.5 rounded-full border ${
                    property.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    property.status === 'Reserved' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Builder Contact */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Official Builder/Promoter</p>
                      <p className="text-[10px] text-gray-400">Source: RERA Portal</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{property.builder}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300 font-mono">{property.builderPhone}</span>
                    <button 
                      onClick={() => copyToClipboard(property.builderPhone)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedNumber === property.builderPhone ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-3">RERA: {property.reraNumber}</p>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${property.builderPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${property.builderPhone}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  </div>
                </div>

                {/* Dealer Contact */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Registered Dealer/Agent</p>
                      <p className="text-[10px] text-gray-400">Source: RERA Agent Registry</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{property.dealer}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300 font-mono">{property.dealerPhone}</span>
                    <button 
                      onClick={() => copyToClipboard(property.dealerPhone)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedNumber === property.dealerPhone ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-3">
                    {property.dealer.includes('Verified') ? '✅ Background verified' : '⚠️ Verify before transacting'}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${property.dealerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${property.dealerPhone}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  </div>
                </div>
              </div>

              {/* RERA Link */}
              <div className="mt-4 flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-gray-300">View official RERA documents for this project</span>
                </div>
                <a 
                  href="#" 
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Open RERA Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">🔧 How "Direct Connect" Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">1️⃣</span>
            </div>
            <p className="text-xs text-gray-300">Property Scanner fetches listings from MagicBricks/99acres via Apify Actor</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">2️⃣</span>
            </div>
            <p className="text-xs text-gray-300">Python script matches project name against State RERA databases</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">3️⃣</span>
            </div>
            <p className="text-xs text-gray-300">RERA-mandated promoter phone numbers & agent details are extracted</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">4️⃣</span>
            </div>
            <p className="text-xs text-gray-300">Direct WhatsApp/Call buttons connect you without portal middlemen</p>
          </div>
        </div>
      </div>

      {/* Monetization Note */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <span className="text-sm">💎</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Premium Feature</p>
            <p className="text-[11px] text-gray-400">
              Direct Connect with verified RERA numbers is available for Premium users (₹999/month). 
              Free users see masked numbers only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
