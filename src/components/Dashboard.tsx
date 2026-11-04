import { 
  TrendingUp, 
  Building2, 
  IndianRupee, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  Crown,
  X,
  Check
} from 'lucide-react';
import { useState } from 'react';
import { properties } from '../data/properties';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'scanner' | 'calculator' | 'map' | 'direct') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const totalProperties = properties.length;
  const avgYield = (properties.reduce((sum, p) => sum + p.rentalYield, 0) / totalProperties).toFixed(1);
  const activeListings = properties.filter(p => p.status === 'Active').length;
  const verifiedCount = properties.filter(p => p.reraVerified).length;

  const portfolioData = [
    { month: 'Jan', value: 420 },
    { month: 'Feb', value: 445 },
    { month: 'Mar', value: 460 },
    { month: 'Apr', value: 478 },
    { month: 'May', value: 510 },
    { month: 'Jun', value: 545 },
  ];

  const stats = [
    { label: 'Active Listings', value: activeListings.toString(), change: '+3 this week', icon: Building2, trend: 'up' as const, bgClass: 'bg-emerald-500/10', iconClass: 'text-emerald-400' },
    { label: 'Avg Rental Yield', value: `${avgYield}%`, change: '+0.8% vs last qtr', icon: TrendingUp, trend: 'up' as const, bgClass: 'bg-cyan-500/10', iconClass: 'text-cyan-400' },
    { label: 'Total Investment Value', value: '₹12.8Cr', change: '+12% YoY', icon: IndianRupee, trend: 'up' as const, bgClass: 'bg-purple-500/10', iconClass: 'text-purple-400' },
    { label: 'RERA Verified', value: `${verifiedCount}/${totalProperties}`, change: '100% compliance', icon: AlertTriangle, trend: 'up' as const, bgClass: 'bg-amber-500/10', iconClass: 'text-amber-400' },
  ];

  const topPicks = properties.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgClass} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Portfolio Growth</h3>
              <p className="text-xs text-gray-400">Estimated value appreciation over 6 months</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">+29.7%</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [`₹${value}L`, 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('scanner')}
              className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Scan Properties</p>
                <p className="text-xs text-gray-400">View live listings</p>
              </div>
            </button>
            <button 
              onClick={() => onNavigate('calculator')}
              className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Calculate ROI</p>
                <p className="text-xs text-gray-400">Net returns after EMI</p>
              </div>
            </button>
            <button 
              onClick={() => onNavigate('map')}
              className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Smart Map</p>
                <p className="text-xs text-gray-400">Heatmap & zones</p>
              </div>
            </button>
            <button 
              onClick={() => onNavigate('direct')}
              className="w-full flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Direct Connect</p>
                <p className="text-xs text-gray-400">Verified contacts</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Top Investment Picks */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">🔥 Top Investment Picks</h3>
            <p className="text-xs text-gray-400">Highest ROI potential based on current market data</p>
          </div>
          <button 
            onClick={() => onNavigate('scanner')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPicks.map((property) => (
            <div key={property.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
              <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${property.imageGradient} mb-4 flex items-center justify-center`}>
                <span className="text-3xl">
                  {property.type === 'Warehouse' ? '🏗️' : property.type === 'Industrial' ? '🏭' : property.type === 'Commercial' ? '🏢' : '🏠'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{property.name}</h4>
              <p className="text-xs text-gray-400 mb-3">{property.location}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total Price</p>
                  <p className="text-sm font-bold text-white">₹{property.totalPrice}L</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Monthly Return</p>
                  <p className="text-sm font-bold text-emerald-400">₹{(property.avgMonthlyRent).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {property.reraVerified && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    ✓ RERA Verified
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  {property.investmentMode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Upgrade Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upgrade to Premium</h3>
              <p className="text-xs text-gray-300 mt-1">Unlock High ROI filters, upcoming highway master plans, and pre-vetted legal papers</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            Upgrade ₹999/mo →
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
              <p className="text-sm text-gray-400 mt-1">Everything you need to make smarter investment decisions</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                'High ROI property filters',
                'Upcoming highway & metro master plans',
                'Pre-vetted legal papers & RERA documents',
                'Priority dealer connections',
                'Advanced ROI projections (10-20 years)',
                'Loan syndication with partner banks',
                'Direct builder WhatsApp access',
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
