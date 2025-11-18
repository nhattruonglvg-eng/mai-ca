
import React, { useState, useMemo, useEffect } from 'react';
import { KPI, Employee, EvaluationResult, WorkStatus } from '../types';
import { UNITS, EVALUATION_RESULTS_OPTIONS, DEPARTMENTS } from '../constants';
import Modal from './ui/Modal';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';

interface KpiManagerProps {
  kpis: KPI[];
  employees: Employee[];
  onAdd: (kpi: Omit<KPI, 'id'>) => void;
  onUpdate: (kpi: KPI) => void;
  onDelete: (id: string) => void;
}

const getEvaluationResult = (completion: number): EvaluationResult => {
    if (completion >= 100) return EvaluationResult.EXCELLENT;
    if (completion >= 80) return EvaluationResult.GOOD;
    if (completion >= 50) return EvaluationResult.NEEDS_IMPROVEMENT;
    return EvaluationResult.NOT_MET;
};

const KpiManager: React.FC<KpiManagerProps> = ({ kpis, employees, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    assigneeId: '',
    department: '',
    result: '',
  });

  const emptyFormData: Omit<KPI, 'id'> = {
    name: '',
    objective: '',
    metric: '',
    target: 0,
    startDate: '',
    endDate: '',
    assigneeId: '',
    approverId: '',
    unit: UNITS[0] || '',
    notes: '',
    completion: 0,
    result: EvaluationResult.NOT_MET,
    month: filters.month,
    year: filters.year,
  };
  const [formData, setFormData] = useState<Omit<KPI, 'id'>>(emptyFormData);

  useEffect(() => {
    if (editingKpi) {
      setFormData(editingKpi);
      setIsModalOpen(true);
    } else {
      setFormData({...emptyFormData, month: filters.month, year: filters.year});
    }
  }, [editingKpi, filters.month, filters.year]);

  const handleOpenModal = (kpi: KPI | null = null) => {
    setEditingKpi(kpi);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKpi(null);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['target', 'completion'].includes(name);
    let newFormData = { ...formData, [name]: isNumberField ? parseFloat(value) || 0 : value };
    if (name === 'completion') {
        newFormData.result = getEvaluationResult(newFormData.completion);
    }
    setFormData(newFormData);
  };
  
  const handleCompletionChange = (kpi: KPI, completion: number) => {
    const newCompletion = Math.max(0, completion);
    const updatedKpi: KPI = { ...kpi, completion: newCompletion, result: getEvaluationResult(newCompletion) };
    onUpdate(updatedKpi);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month] = formData.startDate.split('-').map(Number);
    const finalFormData = {...formData, month, year};

    if (editingKpi) {
      onUpdate({ ...editingKpi, ...finalFormData });
    } else {
      onAdd(finalFormData);
    }
    handleCloseModal();
  };

  const filteredKpis = useMemo(() => {
    return kpis.filter(kpi => 
        kpi.month === Number(filters.month) &&
        kpi.year === Number(filters.year) &&
        (!filters.assigneeId || kpi.assigneeId === filters.assigneeId) &&
        (!filters.result || kpi.result === filters.result) &&
        (!filters.department || employees.find(e => e.id === kpi.assigneeId)?.department === filters.department)
    );
  }, [kpis, filters, employees]);

  const activeEmployees = employees.filter(e => e.status === WorkStatus.ACTIVE);
  const managers = activeEmployees.filter(e => e.role === 'Quản lý');

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'N/A';
  const getResultColor = (result: EvaluationResult) => {
    switch (result) {
        case EvaluationResult.EXCELLENT: return 'bg-blue-100 text-blue-800';
        case EvaluationResult.GOOD: return 'bg-green-100 text-green-800';
        case EvaluationResult.NEEDS_IMPROVEMENT: return 'bg-yellow-100 text-yellow-800';
        case EvaluationResult.NOT_MET: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý KPI</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Tạo KPI mới
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <select name="month" value={filters.month} onChange={handleFilterChange} className="p-2 border rounded-md">
                {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
            </select>
            <select name="year" value={filters.year} onChange={handleFilterChange} className="p-2 border rounded-md">
                {Array.from({length: 5}, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
            </select>
            <select name="department" value={filters.department} onChange={handleFilterChange} className="p-2 border rounded-md">
                <option value="">Tất cả bộ phận</option>
                {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            <select name="assigneeId" value={filters.assigneeId} onChange={handleFilterChange} className="p-2 border rounded-md">
                <option value="">Tất cả nhân sự</option>
                {activeEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
            <select name="result" value={filters.result} onChange={handleFilterChange} className="p-2 border rounded-md">
                <option value="">Tất cả kết quả</option>
                {EVALUATION_RESULTS_OPTIONS.map(res => <option key={res} value={res}>{res}</option>)}
            </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Tên KPI</th>
                <th className="px-6 py-3">Người thực hiện</th>
                <th className="px-6 py-3">Mục tiêu</th>
                <th className="px-6 py-3">% Hoàn thành</th>
                <th className="px-6 py-3">Kết quả</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredKpis.map(kpi => (
                <tr key={kpi.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{kpi.name}</td>
                  <td className="px-6 py-4">{getEmployeeName(kpi.assigneeId)}</td>
                  <td className="px-6 py-4">{kpi.target.toLocaleString()} {kpi.unit}</td>
                  <td className="px-6 py-4">
                    <input 
                        type="number"
                        value={kpi.completion}
                        onChange={(e) => handleCompletionChange(kpi, parseInt(e.target.value))}
                        className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(kpi.result)}`}>
                      {kpi.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(kpi)} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(kpi.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingKpi ? 'Chỉnh sửa KPI' : 'Tạo KPI mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Tên KPI</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Mục tiêu công việc</label>
                    <input type="text" name="objective" value={formData.objective} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Người thực hiện</label>
                    <select name="assigneeId" value={formData.assigneeId} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md">
                        <option value="">Chọn nhân sự</option>
                        {activeEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Người phê duyệt</label>
                    <select name="approverId" value={formData.approverId} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md">
                        <option value="">Chọn quản lý</option>
                        {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Thời gian bắt đầu</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Thời gian kết thúc</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Số liệu mục tiêu</label>
                    <input type="number" name="target" value={formData.target} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Đơn vị</label>
                    <select name="unit" value={formData.unit} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded-md">
                        {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">% Hoàn thành</label>
                    <input type="number" name="completion" value={formData.completion} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Kết quả</label>
                    <input type="text" name="result" value={formData.result} readOnly className="mt-1 block w-full p-2 border rounded-md bg-gray-100"/>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Ghi chú</label>
                    <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows={3} className="mt-1 block w-full p-2 border rounded-md"></textarea>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300">Huỷ</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{editingKpi ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default KpiManager;
