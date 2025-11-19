
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ARCHITECTURE = 'ARCHITECTURE',
  DATA_ADAPTOR = 'DATA_ADAPTOR',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
  DOCTOR_STATION = 'DOCTOR_STATION',
  FEDERATED_LEARNING = 'FEDERATED_LEARNING',
}

export interface HospitalNode {
  id: string;
  name: string;
  type: 'HUB' | 'SPOKE' | 'TECH';
  status: 'active' | 'syncing' | 'offline';
  location: { x: number; y: number };
}

export interface MetricData {
  name: string;
  value: number;
  fullMark: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'processing';
}
