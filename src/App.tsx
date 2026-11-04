import { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Calculator, 
  Map, 
  Phone, 
  TrendingUp,
  Menu,
  X,
  Crown,
  Check
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PropertyScanner from './components/PropertyScanner';
import ROICalculator from './components/ROICalculator';
import MapView from './components/MapView';
import DirectConnect from './components/DirectConnect';

type View = 'dashboard' | 'scanner' | 'calculator' | 'map' | 'direct';

function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner' as View, label: 'Property Scanner', icon: Search },
    { id: 'calculator' as View, label: 'ROI Calculator', icon: Calculator },
    { id: 'map' as View, label: 'Smart Map', icon: Map },
    { id: 'direct' as View, label: 'Direct Connect', icon: Phone },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={setActiveView} />;
      case 'scanner': return <PropertyScanner />;
      case 'calculator': return <ROICalculator />;
      case 'map': return <MapView />;
      case 'direct': return <DirectConnect />;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">PropIntel</h1>
              <p className="text-xs text-gray-400">Investment Command Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">PREMIUM</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">Unlock High ROI filters & pre-vetted legal papers</p>
            <button 
              onClick={() => setShowPremiumModal(true)}
              className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-semibold rounded-lg transition-all"
            >
              Upgrade ₹999/mo
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-lg font-bold capitalize">{activeView === 'direct' ? 'Direct Connect' : activeView}</h2>
                <p className="text-xs text-gray-400">
                  {activeView === 'dashboard' && 'Overview of your investment opportunities'}
                  {activeView === 'scanner' && 'Live listings scanned every 6 hours'}
                  {activeView === 'calculator' && 'Calculate Net ROI with live market data'}
                  {activeView === 'map' && 'Heatmap of demand zones & infrastructure'}
                  {activeView === 'direct' && 'Verified builder & dealer contacts from RERA'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Live Data</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold">
                PI
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderView()}
        </div>
      </main>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPremiumModal(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
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

export default App;
