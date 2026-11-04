import { useState, useEffect } from 'react';
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
  Check,
  Crown,
  X,
  RefreshCw
} from 'lucide-react';
import { Property } from '../data/properties';
import { propertyDataService } from '../data/service';

export default function DirectConnect() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Loading...');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data on mount and refresh
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    const result = await propertyDataService.fetchProperties();
    setProperties(result.data);
    setLastUpdate(propertyDataService.getTimeAgo());
    setIsRefreshing(false);
  };

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
      {/* Live Data Indicator */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">LIVE DATA</span>
          </div>
          <span className="text-xs text-gray-400">Last updated: {lastUpdate}</span>
          <span className="text-xs text-gray-500">• Contacts verified in real-time</span>
        </div>
        <button
          onClick={loadData}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">The "No-Broker" Command Center</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Connect directly with builders and registered agents — bypassing portal call centers. 
              All contacts are <span className="text-emerald-400 font-semibold">RERA verified</span> with official 
              promoter phone numbers and registered agent details.
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
                      <p className="text-[10px] text-gray-400">RERA Registered</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{property.builder}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300 font-mono">+{property.builderPhone}</span>
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
                      href={`https://wa.me/${property.builderPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:+${property.builderPhone}`}
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
                      <p className="text-[10px] text-gray-400">RERA Agent Registry</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{property.dealer}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300 font-mono">+{property.dealerPhone}</span>
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
                      href={`https://wa.me/${property.dealerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:+${property.dealerPhone}`}
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
            <p className="text-xs text-gray-300">Browse verified property listings with real-time pricing</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">2️⃣</span>
            </div>
            <p className="text-xs text-gray-300">View official RERA-registered builder & agent contacts</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">3️⃣</span>
            </div>
            <p className="text-xs text-gray-300">One-tap WhatsApp or call — no middlemen or call centers</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">4️⃣</span>
            </div>
            <p className="text-xs text-gray-300">Negotiate directly and close deals at the best price</p>
          </div>
        </div>
      </div>

      {/* Premium Note */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Premium Feature</p>
              <p className="text-[11px] text-gray-400">
                Direct Connect with verified RERA numbers is available for Premium users.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all"
          >
            Upgrade ₹999/mo
          </button>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPremiumModal(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-8">
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">PropIntel Premium</h2>
              <p className="text-sm text-gray-400 mt-1">Unlock direct builder connections & advanced tools</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                'Direct WhatsApp access to builders',
                'RERA-verified agent contacts',
                'High ROI property filters',
                'Upcoming infrastructure master plans',
                'Pre-vetted legal papers',
                'Advanced 10-20 year ROI projections',
                'Loan syndication with partner banks',
                'Monthly market intelligence reports',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Monthly Plan</p>
                  <p className="text-2xl font-bold text-white">₹999<span className="text-sm text-gray-400">/month</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Annual Plan</p>
                  <p className="text-lg font-bold text-emerald-400">₹9,999<span className="text-xs text-gray-400">/year</span></p>
                  <p className="text-[10px] text-emerald-400">Save ₹1,989</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                alert('Payment gateway integration coming soon! You will be redirected to complete the subscription.');
                setShowPremiumModal(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-bold rounded-xl transition-all"
            >
              Start Premium Subscription
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-3">Cancel anytime. No questions asked.</p>
          </div>
        </div>
      )}
    </div>
  );
}
