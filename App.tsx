
import React, { useState, useMemo } from 'react';
import { Employee, KPI } from './types';
import { INITIAL_EMPLOYEES, INITIAL_KPIS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { ChartBarIcon, UsersIcon, DocumentTextIcon } from './components/Icons';
import PersonnelManager from './components/PersonnelManager';
import KpiManager from './components/KpiManager';
import Dashboard from './components/Dashboard';

type View = 'dashboard' | 'kpis' | 'personnel';

const App: React.FC = () => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', INITIAL_EMPLOYEES);
  const [kpis, setKpis] = useLocalStorage<KPI[]>('kpis', INITIAL_KPIS);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    setEmployees([...employees, { ...employee, id: `emp${Date.now()}` }]);
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };

  const deleteEmployee = (employeeId: string) => {
    if(window.confirm('Bạn có chắc chắn muốn xoá nhân sự này? Thao tác này cũng sẽ xoá tất cả KPI liên quan.')) {
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        setKpis(kpis.filter(kpi => kpi.assigneeId !== employeeId && kpi.approverId !== employeeId));
    }
  };

  const addKpi = (kpi: Omit<KPI, 'id'>) => {
    setKpis([...kpis, { ...kpi, id: `kpi${Date.now()}` }]);
  };

  const updateKpi = (updatedKpi: KPI) => {
    setKpis(kpis.map(kpi => kpi.id === updatedKpi.id ? updatedKpi : kpi));
  };

  const deleteKpi = (kpiId: string) => {
    if(window.confirm('Bạn có chắc chắn muốn xoá KPI này?')) {
        setKpis(kpis.filter(kpi => kpi.id !== kpiId));
    }
  };
  
  const NavItem = ({ icon, label, view, activeView, onClick }: { icon: React.ReactNode; label: string; view: View; activeView: View; onClick: (view: View) => void }) => (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
        activeView === view
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard kpis={kpis} employees={employees} />;
      case 'kpis':
        return <KpiManager kpis={kpis} employees={employees} onAdd={addKpi} onUpdate={updateKpi} onDelete={deleteKpi} />;
      case 'personnel':
        return <PersonnelManager employees={employees} onAdd={addEmployee} onUpdate={updateEmployee} onDelete={deleteEmployee} />;
      default:
        return <Dashboard kpis={kpis} employees={employees} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6 text-center border-b">
          <h1 className="text-2xl font-bold text-blue-700">KPIs Manager</h1>
        </div>
        <nav className="mt-6">
          <NavItem icon={<ChartBarIcon className="w-6 h-6" />} label="Bảng điều khiển" view="dashboard" activeView={currentView} onClick={setCurrentView} />
          <NavItem icon={<DocumentTextIcon className="w-6 h-6" />} label="Quản lý KPI" view="kpis" activeView={currentView} onClick={setCurrentView} />
          <NavItem icon={<UsersIcon className="w-6 h-6" />} label="Quản lý Nhân sự" view="personnel" activeView={currentView} onClick={setCurrentView} />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
