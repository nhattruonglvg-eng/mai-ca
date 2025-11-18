
import React, { useState, useMemo } from 'react';
import { KPI, Employee, EvaluationResult } from '../types';
import { DEPARTMENTS } from '../constants';
import { CompletionLineChart, ComparisonBarChart, StatusPieChart } from './charts/Charts';
import { generateKpiReport } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';


interface DashboardProps {
  kpis: KPI[];
  employees: Employee[];
}

const Dashboard: React.FC<DashboardProps> = ({ kpis, employees }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [comparisonType, setComparisonType] = useState<'employee' | 'team'>('employee');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  
  const [report, setReport] = useState<string>('');
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);

  const handleGenerateReport = async () => {
    setIsLoadingReport(true);
    let context: 'employee' | 'team' | 'company' = 'company';
    let contextName = "Toàn công ty";
    let kpisForReport = monthlyKpis;
    
    if (selectedTeam) {
        context = 'team';
        contextName = selectedTeam;
        const teamMemberIds = employees.filter(e => e.department === selectedTeam).map(e => e.id);
        kpisForReport = monthlyKpis.filter(kpi => teamMemberIds.includes(kpi.assigneeId));
    }

    const result = await generateKpiReport(kpisForReport, employees, month, year, context, contextName);
    setReport(result);
    setIsLoadingReport(false);
  };
  
  // Annual data
  const annualData = useMemo(() => {
    const monthlyStats: { month: string, completion: number, count: number }[] = Array(12).fill(0).map((_, i) => ({ month: `T${i + 1}`, completion: 0, count: 0 }));
    kpis.filter(kpi => kpi.year === year).forEach(kpi => {
        monthlyStats[kpi.month - 1].completion += kpi.completion;
        monthlyStats[kpi.month - 1].count++;
    });
    return monthlyStats.map(stat => ({
        ...stat,
        completion: stat.count > 0 ? parseFloat((stat.completion / stat.count).toFixed(2)) : 0
    }));
  }, [kpis, year]);

  // Monthly data
  const monthlyKpis = useMemo(() => kpis.filter(kpi => kpi.year === year && kpi.month === month), [kpis, year, month]);

  const comparisonData = useMemo(() => {
    const dataMap = new Map<string, { totalCompletion: number; count: number }>();
    let filteredMonthlyKpis = monthlyKpis;
    if (comparisonType === 'team' && selectedTeam) {
        const teamMemberIds = employees.filter(e => e.department === selectedTeam).map(e => e.id);
        filteredMonthlyKpis = monthlyKpis.filter(kpi => teamMemberIds.includes(kpi.assigneeId));
    }
    
    filteredMonthlyKpis.forEach(kpi => {
        let key = '';
        if (comparisonType === 'employee') {
            key = employees.find(e => e.id === kpi.assigneeId)?.name || 'N/A';
        } else {
            key = employees.find(e => e.id === kpi.assigneeId)?.department || 'N/A';
        }

        if (key !== 'N/A') {
            const current = dataMap.get(key) || { totalCompletion: 0, count: 0 };
            dataMap.set(key, {
                totalCompletion: current.totalCompletion + kpi.completion,
                count: current.count + 1,
            });
        }
    });

    return Array.from(dataMap.entries()).map(([name, data]) => ({
        name,
        completion: parseFloat((data.totalCompletion / data.count).toFixed(2)),
    }));
  }, [monthlyKpis, employees, comparisonType, selectedTeam]);

  const statusData = useMemo(() => {
    const statusCount = {
        [EvaluationResult.EXCELLENT]: 0,
        [EvaluationResult.GOOD]: 0,
        [EvaluationResult.NEEDS_IMPROVEMENT]: 0,
        [EvaluationResult.NOT_MET]: 0,
    };
    let filteredKpis = monthlyKpis;
     if (selectedTeam) {
        const teamMemberIds = employees.filter(e => e.department === selectedTeam).map(e => e.id);
        filteredKpis = monthlyKpis.filter(kpi => teamMemberIds.includes(kpi.assigneeId));
    }
    filteredKpis.forEach(kpi => statusCount[kpi.result]++);
    return Object.entries(statusCount).map(([name, value]) => ({ name: name as EvaluationResult, value }));
  }, [monthlyKpis, employees, selectedTeam]);

  // Monthly stats
  const totalKpis = monthlyKpis.length;
  const achievedKpis = monthlyKpis.filter(kpi => kpi.result === EvaluationResult.EXCELLENT || kpi.result === EvaluationResult.GOOD).length;
  const avgCompletion = totalKpis > 0 ? (monthlyKpis.reduce((acc, kpi) => acc + kpi.completion, 0) / totalKpis).toFixed(2) : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h2>
        <p className="text-gray-500 mt-1">Tổng quan hiệu suất KPI của công ty.</p>
      </div>
      
      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow-md grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium">Chọn năm</label>
            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full p-2 border rounded-md mt-1">
                {Array.from({length: 5}, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Chọn tháng</label>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="w-full p-2 border rounded-md mt-1">
                {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">So sánh theo</label>
             <select value={comparisonType} onChange={e => {setComparisonType(e.target.value as 'employee' | 'team'); setSelectedTeam('')}} className="w-full p-2 border rounded-md mt-1">
                <option value="employee">Nhân sự</option>
                <option value="team">Đội nhóm</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Lọc theo Đội nhóm</label>
            <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} className="w-full p-2 border rounded-md mt-1">
                <option value="">Toàn công ty</option>
                {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
      </div>

      {/* Monthly Report */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Báo cáo tổng thể tháng {month}/{year}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{totalKpis}</p>
                <p className="text-gray-500">Tổng số KPI</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{achievedKpis}</p>
                <p className="text-gray-500">KPI Đạt</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{avgCompletion}%</p>
                <p className="text-gray-500">Hoàn thành TB</p>
            </div>
        </div>
        <div>
            <button onClick={handleGenerateReport} disabled={isLoadingReport} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                {isLoadingReport ? 'Đang tạo báo cáo...' : 'Tạo báo cáo với Gemini AI'}
            </button>
            {report && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 prose max-w-none">
                    <ReactMarkdown>{report}</ReactMarkdown>
                </div>
            )}
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tỷ lệ KPI theo kết quả (Tháng {month})</h3>
          <StatusPieChart data={statusData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">So sánh hiệu suất (Tháng {month})</h3>
          <ComparisonBarChart data={comparisonData} />
        </div>
      </div>
      
       <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Thống kê hiệu suất năm {year}</h3>
          <CompletionLineChart data={annualData} />
        </div>
    </div>
  );
};

export default Dashboard;
