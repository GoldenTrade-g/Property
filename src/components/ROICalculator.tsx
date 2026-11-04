import { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  IndianRupee, 
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { properties } from '../data/properties';
import * as XLSX from 'xlsx';

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
    const emi = loanAmount > 0 ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
    
    const annualRent = monthlyRent * 12;
    const annualEMI = emi * 12;
    const vacancyCost = annualRent * (selectedProperty.vacancyRate / 100);
    const operatingExpenses = selectedProperty.propertyTax + selectedProperty.maintenanceCost;
    
    const netAnnualCashFlow = annualRent - vacancyCost - annualEMI - operatingExpenses;
    const netMonthlyCashFlow = netAnnualCashFlow / 12;
    const cashOnCashROI = (netAnnualCashFlow / downPayment) * 100;
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
        yearNum: year,
        cashFlow: Math.round(yearNet / 100000),
        monthlyCashFlow: Math.round(yearNet / 12),
        cumulative: Math.round(cumulativeCashFlow / 100000),
        propertyValue: Math.round(propertyValue / 100000),
        rent: Math.round(currentRent),
        annualRent: Math.round(yearRent),
        emi: Math.round(annualEMI),
        expenses: Math.round(vacancyCost + operatingExpenses),
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
      netAnnualCashFlow,
      netMonthlyCashFlow,
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

  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['PropIntel - ROI Calculation Report'],
      [''],
      ['Property Details'],
      ['Property Name', selectedProperty.name],
      ['Location', selectedProperty.location],
      ['City', selectedProperty.city],
      ['Type', selectedProperty.type],
      ['Investment Mode', selectedProperty.investmentMode],
      [''],
      ['Input Parameters'],
      ['Property Cost', propertyCost],
      ['Stamp Duty (7%)', calculations.stampDuty],
      ['Total Cost', calculations.totalCost],
      ['Loan Percentage', `${loanPercentage}%`],
      ['Loan Amount', calculations.loanAmount],
      ['Down Payment + Registration', calculations.downPayment],
      ['Interest Rate', `${interestRate}%`],
      ['Loan Tenure', `${loanTenure} years`],
      ['Monthly EMI', calculations.emi],
      ['Expected Monthly Rent', monthlyRent],
      [''],
      ['Financial Summary'],
      ['Annual Rent Income', calculations.annualRent],
      ['Annual EMI Outflow', calculations.annualEMI],
      ['Vacancy Cost (Annual)', calculations.vacancyCost],
      ['Operating Expenses (Annual)', calculations.operatingExpenses],
      ['Net Annual Cash Flow', calculations.netAnnualCashFlow],
      ['Net Monthly Cash Flow', calculations.netMonthlyCashFlow],
      ['Gross Rental Yield', `${calculations.grossYield.toFixed(2)}%`],
      ['Cash-on-Cash ROI', `${calculations.cashOnCashROI.toFixed(2)}%`],
      [''],
      ['10-Year Projection'],
      ['Year', 'Monthly Rent', 'Annual Rent', 'Annual EMI', 'Expenses', 'Annual Cash Flow', 'Monthly Cash Flow', 'Cumulative (₹L)', 'Property Value (₹L)'],
    ];

    // Add projection data
    calculations.projection.forEach(p => {
      summaryData.push([
        p.year,
        p.rent,
        p.annualRent,
        p.emi,
        p.expenses,
        p.cashFlow * 100000,
        p.monthlyCashFlow,
        p.cumulative,
        p.propertyValue,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, 
      { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'ROI Analysis');

    // Download
    XLSX.writeFile(wb, `PropIntel_ROI_${selectedProperty.name.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Property Selection */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Select Property for ROI Analysis
          </h3>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
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
              <p className="text-xs font-bold text-emerald-400 mt-1">Monthly Return: ₹{prop.avgMonthlyRent.toLocaleString()}</p>
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
              Area average: {formatCurrency(selectedProperty.avgMonthlyRent)}/month for this location
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
              <p className="text-[10px] text-gray-400">Monthly Rent Income</p>
              <p className="text-sm font-bold text-emerald-400">{formatCurrency(monthlyRent)}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-[10px] text-gray-400">Annual Rent Income</p>
              <p className="text-sm font-bold text-emerald-400">{formatCurrency(calculations.annualRent)}</p>
            </div>
          </div>

          {/* Monthly & Annual Cash Flow - Prominent Display */}
          <div className={`p-4 rounded-xl border ${
            calculations.netMonthlyCashFlow >= 0 
              ? 'bg-emerald-500/5 border-emerald-500/20' 
              : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {calculations.netMonthlyCashFlow >= 0 ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs font-semibold text-white">Net Cash Flow</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Monthly Return</p>
                <p className={`text-xl font-bold ${calculations.netMonthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(calculations.netMonthlyCashFlow)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Annual Return</p>
                <p className={`text-xl font-bold ${calculations.netAnnualCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(calculations.netAnnualCashFlow)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {calculations.netMonthlyCashFlow >= 0 ? '✓ Property generates positive cash flow after all expenses' : '⚠️ Requires monthly subsidy from other income'}
            </p>
          </div>

          {/* ROI Display */}
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
                <p className="text-[10px] text-gray-400 mt-1">
                  = (Annual Return ₹{formatCurrency(calculations.netAnnualCashFlow)} ÷ Cash Invested ₹{formatCurrency(calculations.downPayment)}) × 100
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Verdict</p>
                <p className={`text-sm font-bold ${
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

          {/* Export Button */}
          <button
            onClick={exportToExcel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Full Calculation (Excel)
          </button>
        </div>
      </div>

      {/* 10-Year Projection Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            10-Year Cash Flow Projection (5% annual rent increase)
          </h3>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-xs hover:bg-gray-700 transition-colors"
          >
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
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
                formatter={(value: number, name: string) => {
                  if (name === 'cashFlow') return [`₹${value}L/yr`, 'Annual Cash Flow'];
                  return [`₹${value}L`, 'Cumulative'];
                }}
              />
              <Bar dataKey="cashFlow" fill="#10b981" radius={[4, 4, 0, 0]} name="cashFlow" />
              <Bar dataKey="cumulative" fill="#06b6d4" radius={[4, 4, 0, 0]} name="cumulative" />
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

      {/* Year-by-Year Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">📊 Year-by-Year Breakdown</h3>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors"
          >
            <FileSpreadsheet className="w-3 h-3" /> Download Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Year</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Monthly Rent</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Annual Rent</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Annual EMI</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Expenses</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Net Annual</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Net Monthly</th>
                <th className="text-right py-2 px-3 text-gray-400 font-medium">Property Value</th>
              </tr>
            </thead>
            <tbody>
              {calculations.projection.map((row) => (
                <tr key={row.year} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-2 px-3 text-white font-medium">{row.year}</td>
                  <td className="py-2 px-3 text-right text-gray-300">₹{row.rent.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">₹{(row.annualRent / 100000).toFixed(1)}L</td>
                  <td className="py-2 px-3 text-right text-red-400">₹{(row.emi / 100000).toFixed(1)}L</td>
                  <td className="py-2 px-3 text-right text-amber-400">₹{(row.expenses / 100000).toFixed(1)}L</td>
                  <td className={`py-2 px-3 text-right font-medium ${row.cashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{row.cashFlow}L
                  </td>
                  <td className={`py-2 px-3 text-right font-medium ${row.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{row.monthlyCashFlow.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-purple-400">₹{row.propertyValue}L</td>
                </tr>
              ))}
            </tbody>
          </table>
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
