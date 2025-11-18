
export enum WorkStatus {
  ACTIVE = "Đang làm việc",
  INACTIVE = "Đã nghỉ",
}

export enum EvaluationResult {
  EXCELLENT = "Xuất sắc",
  GOOD = "Tốt",
  NEEDS_IMPROVEMENT = "Cần cải thiện",
  NOT_MET = "Không đạt",
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  role: string;
  teamLead: string;
  status: WorkStatus;
}

export interface KPI {
  id: string;
  name: string;
  objective: string;
  metric: string;
  target: number;
  startDate: string;
  endDate: string;
  assigneeId: string;
  approverId: string;
  unit: string;
  notes: string;
  completion: number;
  result: EvaluationResult;
  month: number;
  year: number;
}
