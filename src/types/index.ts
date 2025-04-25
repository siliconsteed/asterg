export interface User {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
}
