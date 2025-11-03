import { LogEntry, UserActivity, DataStructureType } from '@/types';
import { db } from '@/firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

class Logger {
  private logs: LogEntry[] = [];
  private dataStructure: DataStructureType | null = null;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUser(userId: string) {
    this.userId = userId;
  }

  setDataStructure(ds: DataStructureType) {
    this.dataStructure = ds;
    this.logs = []; // Clear logs when switching data structures
  }

  log(operation: string, value?: any, details?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      operation,
      value,
      details,
    };
    this.logs.push(entry);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  async saveToFirestore() {
    if (!this.userId || !this.dataStructure || this.logs.length === 0) {
      return;
    }

    try {
      const activity: UserActivity = {
        userId: this.userId,
        dataStructure: this.dataStructure,
        logs: this.logs,
        sessionId: this.sessionId,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'userActivities'), activity);
      console.log('Logs saved to Firestore');
    } catch (error) {
      console.error('Error saving logs to Firestore:', error);
    }
  }

  async getPastLogs(userId: string, dataStructure: DataStructureType): Promise<UserActivity[]> {
    try {
      const q = query(
        collection(db, 'userActivities'),
        where('userId', '==', userId),
        where('dataStructure', '==', dataStructure)
      );
      const querySnapshot = await getDocs(q);
      const activities: UserActivity[] = [];
      querySnapshot.forEach((doc) => {
        activities.push(doc.data() as UserActivity);
      });
      return activities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching past logs:', error);
      return [];
    }
  }
}

// Singleton instance
export const logger = new Logger();


