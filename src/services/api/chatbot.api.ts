/**
 * Chatbot API Service
 * 
 * Handles all chatbot-related operations including:
 * - Sending messages to chatbot
 * - Managing chat sessions
 */

import { apiClient } from '../http-client';
import type { ChatRequest, ChatResponse } from '../../types';

/**
 * Send a message to the chatbot
 * 
 * @param sessionId - Unique session identifier (e.g., DateTime.Now converted to string)
 * @param content - User's message content
 * @param userId - ID of the current user (optional, can be 0 for anonymous)
 * @returns Bot's response message
 */
export const sendMessage = async (
  sessionId: string,
  content: string,
  userId?: number
): Promise<ChatResponse> => {
  const request: ChatRequest = {
    SessionId: sessionId,
    Messages: [
      {
        Content: content,
      },
    ],
    UserId: userId || 0,
  };

  const response = await apiClient.post('/Chat', request);
  return response.data as ChatResponse;
};

// Default export: chatbotApi object with all methods
const chatbotApi = {
  sendMessage,
};

export default chatbotApi;
