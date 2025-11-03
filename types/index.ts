export type DataStructureType = 
  | 'stack' 
  | 'queue' 
  | 'linkedlist' 
  | 'array' 
  | 'hashtable' 
  | 'graph' 
  | 'tree' 
  | 'bst' 
  | 'avl' 
  | 'heap';

export interface LogEntry {
  timestamp: string;
  operation: string;
  value?: any;
  details?: string;
}

export interface UserActivity {
  userId: string;
  dataStructure: DataStructureType;
  logs: LogEntry[];
  sessionId: string;
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}


