
import React, { useState, useEffect } from 'react';
import { Employee, WorkStatus } from '../types';
import { DEPARTMENTS } from '../constants';
import Modal from './ui/Modal';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';

interface PersonnelManagerProps {
  employees: Employee[];
  onAdd: (employee: Omit<Employee, 'id'>) => void;
  onUpdate: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const PersonnelManager: React.FC<PersonnelManagerProps> = ({ employees, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    position: '',
    department: DEPARTMENTS[0] || '',
    role: '',
    teamLead: '',
    status: WorkStatus.ACTIVE,
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee);
      setIsModalOpen(true);
    } else {
      setFormData({
        name: '',
        position: '',
        department: DEPARTMENTS[0] || '',
        role: '',
        teamLead: '',
        status: WorkStatus.ACTIVE,
      });
    }
  }, [editingEmployee]);

  const handleOpenModal = (employee: Employee | null = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      onUpdate({ ...editingEmployee, ...formData });
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };
  
  const teamLeads = employees.filter(e => e.role === 'Quản lý' && e.status === WorkStatus.ACTIVE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý Nhân sự</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm Nhân sự
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Họ tên</th>
                <th scope="col" className="px-6 py-3">Chức vụ</th>
                <th scope="col" className="px-6 py-3">Bộ phận</th>
                <th scope="col" className="px-6 py-3">Trưởng nhóm</th>
                <th scope="col" className="px-6 py-3">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{emp.name}</td>
                  <td className="px-6 py-4">{emp.position}</td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4">{emp.teamLead}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${emp.status === WorkStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(emp)} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(emp.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEmployee ? 'Chỉnh sửa Nhân sự' : 'Thêm Nhân sự mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bộ phận</label>
                    <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                        {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                    <select name="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Chọn vai trò</option>
                        <option value="Nhân viên">Nhân viên</option>
                        <option value="Quản lý">Quản lý</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trưởng nhóm</label>
                     <select name="teamLead" value={formData.teamLead} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="BOD">BOD</option>
                        {teamLeads.map(lead => <option key={lead.id} value={lead.name}>{lead.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                        {Object.values(WorkStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300">Huỷ</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{editingEmployee ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default PersonnelManager;
