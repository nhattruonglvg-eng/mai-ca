
import { Employee, KPI, WorkStatus, EvaluationResult } from './types';

export const DEPARTMENTS = ["Vận Hành", "Marketing", "Kỹ thuật", "Nhân sự"];
export const UNITS = ["%", "Số lượng", "Doanh thu (VND)", "Điểm"];
export const EVALUATION_RESULTS_OPTIONS = Object.values(EvaluationResult);

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Nguyễn Văn An', position: 'Trưởng phòng Kinh doanh', department: 'Kinh doanh', role: 'Quản lý', teamLead: 'BOD', status: WorkStatus.ACTIVE },
  { id: 'emp2', name: 'Trần Thị Bích', position: 'Chuyên viên Marketing', department: 'Marketing', role: 'Nhân viên', teamLead: 'Nguyễn Thị Lệ', status: WorkStatus.ACTIVE },
  { id: 'emp3', name: 'Lê Văn Cường', position: 'Lập trình viên Senior', department: 'Kỹ thuật', role: 'Nhân viên', teamLead: 'Phạm Văn Dũng', status: WorkStatus.ACTIVE },
  { id: 'emp4', name: 'Phạm Thị Diễm', position: 'Nhân viên kinh doanh', department: 'Kinh doanh', role: 'Nhân viên', teamLead: 'Nguyễn Văn An', status: WorkStatus.ACTIVE },
  { id: 'emp5', name: 'Nguyễn Thị Lệ', position: 'Trưởng nhóm Marketing', department: 'Marketing', role: 'Quản lý', teamLead: 'BOD', status: WorkStatus.ACTIVE },
  { id: 'emp6', name: 'Phạm Văn Dũng', position: 'Trưởng nhóm Kỹ thuật', department: 'Kỹ thuật', role: 'Quản lý', teamLead: 'BOD', status: WorkStatus.ACTIVE },
];

export const INITIAL_KPIS: KPI[] = [
  { id: 'kpi1', name: 'Doanh số bán hàng cá nhân', objective: 'Đạt doanh số mục tiêu', metric: 'Doanh thu bán hàng', target: 500000000, startDate: '2024-07-01', endDate: '2024-07-31', assigneeId: 'emp4', approverId: 'emp1', unit: 'Doanh thu (VND)', notes: 'Tập trung vào khách hàng tiềm năng', completion: 110, result: EvaluationResult.EXCELLENT, month: 7, year: 2024 },
  { id: 'kpi2', name: 'Tỷ lệ chuyển đổi quảng cáo', objective: 'Tăng hiệu quả quảng cáo', metric: 'Tỷ lệ click/đơn hàng', target: 5, startDate: '2024-07-01', endDate: '2024-07-31', assigneeId: 'emp2', approverId: 'emp5', unit: '%', notes: 'Tối ưu lại nội dung quảng cáo', completion: 85, result: EvaluationResult.GOOD, month: 7, year: 2024 },
  { id: 'kpi3', name: 'Hoàn thành module A', objective: 'Phát triển tính năng mới', metric: 'Số lượng task hoàn thành', target: 10, startDate: '2024-07-01', endDate: '2024-07-31', assigneeId: 'emp3', approverId: 'emp6', unit: 'Số lượng', notes: 'Đảm bảo chất lượng code', completion: 100, result: EvaluationResult.EXCELLENT, month: 7, year: 2024 },
  { id: 'kpi4', name: 'Doanh số team', objective: 'Đạt doanh số team', metric: 'Doanh thu', target: 2000000000, startDate: '2024-07-01', endDate: '2024-07-31', assigneeId: 'emp1', approverId: 'BOD', unit: 'Doanh thu (VND)', notes: '', completion: 95, result: EvaluationResult.GOOD, month: 7, year: 2024 },
  { id: 'kpi5', name: 'Doanh số bán hàng cá nhân', objective: 'Đạt doanh số mục tiêu', metric: 'Doanh thu bán hàng', target: 500000000, startDate: '2024-06-01', endDate: '2024-06-30', assigneeId: 'emp4', approverId: 'emp1', unit: 'Doanh thu (VND)', notes: 'Tập trung vào khách hàng tiềm năng', completion: 70, result: EvaluationResult.NEEDS_IMPROVEMENT, month: 6, year: 2024 },
];
