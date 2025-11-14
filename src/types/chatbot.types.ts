/**
 * Chatbot Related Types
 * 
 * This file contains all type definitions related to:
 * - Chat messages
 * - Chat requests and responses
 */

// ==================== CHAT MESSAGE ====================

export interface ChatMessage {
  Content: string;
  IsUser: boolean; // true if user message, false if bot response
  Timestamp: Date;
}

// ==================== API REQUEST/RESPONSE ====================

export interface ChatRequest {
  SessionId: string;
  Messages: Array<{
    Content: string;
  }>;
  UserId: number;
}

export interface ChatResponse {
  Reply?: string;
  message?: string;
}
