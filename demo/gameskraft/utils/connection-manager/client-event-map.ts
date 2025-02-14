export interface ClientEventsMap {
    [key: string]:  (eventName: string, userId: string, namespace: string, data?: any) => void;
  }
  
  