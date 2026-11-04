import { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  IndianRupee, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { properties } from '../data/properties';

export default function ROICalculator() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0].id);
  const [propertyCost, setPropertyCost] = useState(properties[0].totalPrice * 100000);
  const [loanPercentage, setLoanPercentage] = useState(80);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(15);
  const [monthlyRent, setMonthlyRent] = useState(properties[0].avgMonthlyRent);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId)!;

  const calculations = useMemo(() => {
    const stampDuty = propertyCost * 0.07;
    const totalCost = propertyCost + stampDuty;
    const loanAmount = propertyCost * (loanPercentage / 100);
    const downPayment = propertyCost - loanAmount + stampDuty;
    
    // EMI Calculation
    const r = interestRate / (12 * 100);
    const n = loanTenure * 12;
    const emi = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    const annualRent = monthlyRent * 12;
    const annualEMI = emi * 12;
    const vacancyCost = annualRent * (selectedProperty.vacancyRate / 100);
    const operatingExpenses = selectedProperty.propertyTax + selectedProperty.maintenanceCost;
    
    const netCashFlow = annualRent - vacancyCost - annualEMI - operatingExpenses;
    const cashOnCashROI = (netCashFlow / downPayment) * 100;
    const grossYield = (annualRent / totalCost) * 100;

    // 10-year projection
    const projection = [];
    let cumulativeCashFlow = 0;
    let currentRent = monthlyRent;
    let propertyValue = propertyCost;
    
    for (let year = 1; year <= 10; year++) {
      const yearRent = currentRent * 12;
      const yearVacancy = yearRent * (selectedProperty.vacancyRate / 100);
      const yearNet = yearRent - yearVacancy - annualEMI - operatingExpenses;
      cumulativeCashFlow += yearNet;
      propertyValue *= (1 + selectedProperty.appreciationRate / 100);
      
      projection.push({
        year: `Yr ${year}`,
        cashFlow: Math.round(yearNet / 100000),
        cumulative: Math.round(cumulativeCashFlow / 100000),
        propertyValue: Math.round(propertyValue / 100000),
        rent: Math.round(currentRent),
      });
      
      currentRent *= 1.05; // 5% annual rent increase
    }

    return {
      stampDuty,
      totalCost,
      loanAmount,
      downPayment,
      emi,
      annualRent,
      annualEMI,
      vacancyCost,
      operatingExpenses,
      netCashFlow,
      cashOnCashROI,
      grossYield,
      projection,
    };
  }, [propertyCost, loanPercentage, interestRate, loanTenure, monthlyRent, selectedProperty]);

  const handlePropertySelect = (id: string) => {
    const prop = properties.find(p => p.id === id)!;
    setSelectedPropertyId(id);
    setPropertyCost(prop.totalPrice * 100000);
    setMonthlyRent(prop.avgMonthlyRent);
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Property Selection */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          Select Property for ROI Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {properties.map((prop) => (
            <button
              key={prop.id}
              onClick={() => handlePropertySelect(prop.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPropertyId === prop.id
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <p className="text-xs font-medium text-white truncate">{prop.name}</p>
              <p className="text-[10px] text-gray-400">{prop.location}</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">Yield: {prop.rentalYield}%</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">Input Parameters</h3>
          
          {/* Property Cost */}
          <div>
            <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Property Cost</span>
              <span className="text-white font-medium">{formatCurrency(propertyCost)}</span>
            </label>
            <input
              type="range"
              min={5000000}
              max={50000000}
              step={500000}
              value={propertyCost}
              onChange={(e) => setPropertyCost(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>₹50L</span>
              <span>₹5Cr</span>
            </div>
          </div>

          {/* Loan Percentage */}
          <div>
            <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Loan Percentage</span>
              <span className="text-white font-medium">{loanPercentage}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={loanPercentage}
              onChange={(e) => setLoanPercentage(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>0% (No Loan)</span>
              <span>80% (Max)</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Interest Rate (p.a.)</span>
              <span className="text-white font-medium">{interestRate}%</span>
            </label>
            <input
              type="range"
              min={6}
              max={12}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>6%</span>
              <span>12%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Loan Tenure</span>
              <span className="text-white font-medium">{loanTenure} years</span>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>5 yrs</span>
              <span>30 yrs</span>
            </div>
          </div>

          {/* Monthly Rent */}
          <div>
            <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Expected Monthly Rent</span>
              <span className="text-white font-medium">{formatCurrency(monthlyRent)}</span>
            </label>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>₹10K</span>
              <span>₹5L</span>
            </div>
            <p className="text-[10px] text-cyan-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Area avg: {formatCurrency(selectedProperty.avgMonthlyRent)}/month for this location
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Financial Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Stamp Duty (7%)</p>
              <p className="text-sm font-bold text-white">{formatCurrency(calculations.stampDuty)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Loan Amount</p>
              <p className="text-sm font-bold text-white">{formatCurrency(calculations.loanAmount)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Down Payment + Reg.</p>
              <p className="text-sm font-bold text-white">{formatCurrency(calculations.downPayment)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Monthly EMI</p>
              <p className="text-sm font-bold text-amber-400">{formatCurrency(calculations.emi)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Annual Rent Income</p>
              <p className="text-sm font-bold text-emerald-400">{formatCurrency(calculations.annualRent)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Annual EMI Outflow</p>
              <p className="text-sm font-bold text-red-400">{formatCurrency(calculations.annualEMI)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Vacancy + Ops Cost</p>
              <p className="text-sm font-bold text-red-400">{formatCurrency(calculations.vacancyCost + calculations.operatingExpenses)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Gross Rental Yield</p>
              <p className="text-sm font-bold text-cyan-400">{calculations.grossYield.toFixed(1)}%</p>
            </div>
          </div>

          {/* Net Cash Flow & ROI */}
          <div className={`p-4 rounded-xl border ${
            calculations.netCashFlow >= 0 
              ? 'bg-emerald-500/5 border-emerald-500/20' 
              : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {calculations.netCashFlow >= 0 ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs font-semibold text-white">Net Annual Cash Flow</span>
            </div>
            <p className={`text-2xl font-bold ${calculations.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(calculations.netCashFlow)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {calculations.netCashFlow >= 0 ? 'Positive cash flow — property pays for itself' : 'Negative cash flow — requires monthly subsidy'}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            calculations.cashOnCashROI >= 5 
              ? 'bg-emerald-500/5 border-emerald-500/20' 
              : calculations.cashOnCashROI >= 0 
                ? 'bg-amber-500/5 border-amber-500/20' 
                : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white mb-1">Cash-on-Cash ROI</p>
                <p className={`text-2xl font-bold ${
                  calculations.cashOnCashROI >= 5 ? 'text-emerald-400' : 
                  calculations.cashOnCashROI >= 0 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {calculations.cashOnCashROI.toFixed(2)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Verdict</p>
                <p className={`text-xs font-bold ${
                  calculations.cashOnCashROI >= 8 ? 'text-emerald-400' : 
                  calculations.cashOnCashROI >= 5 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {calculations.cashOnCashROI >= 8 ? '🟢 Excellent' : 
                   calculations.cashOnCashROI >= 5 ? '🟡 Good' : 
                   calculations.cashOnCashROI >= 0 ? '🟠 Moderate' : '🔴 Negative'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Year Projection Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          10-Year Projection (with 5% annual rent increase)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          EMI stays flat while rent increases — cash flow improves significantly over time
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calculations.projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number, name: string) => [`₹${value}L`, name === 'cashFlow' ? 'Annual Cash Flow' : name === 'cumulative' ? 'Cumulative' : 'Property Value']}
              />
              <Bar dataKey="cashFlow" fill="#10b981" radius={[4, 4, 0, 0]} name="Annual Cash Flow" />
              <Bar dataKey="cumulative" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Cumulative Cash Flow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-3 h-3 bg-emerald-500 rounded" /> Annual Cash Flow</span>
          <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-3 h-3 bg-cyan-500 rounded" /> Cumulative</span>
        </div>
      </div>

      {/* Property Value Appreciation */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-purple-400" />
          Property Value Appreciation ({selectedProperty.appreciationRate}% p.a.)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calculations.projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`₹${value}L`, 'Property Value']}
              />
              <Line type="monotone" dataKey="propertyValue" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Formula Reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">📐 Formulas Used</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-xs text-emerald-400 font-semibold mb-2">EMI Calculation</p>
            <code className="text-xs text-gray-300 block">
              EMI = P × [r(1+r)^n] / [(1+r)^n - 1]<br/>
              where r = Rate/12/100, n = Tenure × 12
            </code>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-xs text-cyan-400 font-semibold mb-2">Cash-on-Cash ROI</p>
            <code className="text-xs text-gray-300 block">
              ROI = (Net Annual Cash Flow / Total Cash Invested) × 100<br/>
              Cash Invested = Down Payment + Registration
            </code>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-xs text-amber-400 font-semibold mb-2">Net Cash Flow</p>
            <code className="text-xs text-gray-300 block">
              NCF = (Gross Rent - Vacancy) - (EMI + Tax + Maintenance)
            </code>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-xs text-purple-400 font-semibold mb-2">Gross Rental Yield</p>
            <code className="text-xs text-gray-300 block">
              Yield = (Annual Rent / Total Property Cost) × 100
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
