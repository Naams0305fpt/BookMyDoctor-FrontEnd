import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User as UserIcon,
  Loader,
} from "lucide-react";
import chatbotApi from "../../services/api/chatbot.api";
import { useAuth } from "../../contexts/AuthContext";
import type { ChatMessage } from "../../types";
import { theme } from "../../styles/theme";

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 100px;
  right: ${theme.spacing[6]};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.teal},
    ${theme.colors.primary.dark}
  );
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(19, 182, 198, 0.4);
  z-index: ${theme.zIndex.modal - 1};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(19, 182, 198, 0.6);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    bottom: 80px;
    right: ${theme.spacing[4]};
    width: 56px;
    height: 56px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  bottom: 180px;
  right: ${theme.spacing[6]};
  width: 400px;
  height: 600px;
  background: white;
  border-radius: ${theme.borderRadius["2xl"]};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: ${theme.zIndex.modal - 1};

  @media (max-width: ${theme.breakpoints.md}) {
    bottom: 160px;
    right: ${theme.spacing[4]};
    left: ${theme.spacing[4]};
    width: auto;
    height: 500px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.teal},
    ${theme.colors.primary.dark}
  );
  padding: ${theme.spacing[4]};
  color: white;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  box-shadow: ${theme.colors.shadow.md};
`;

const HeaderIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const HeaderText = styled.div`
  flex: 1;

  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.bold};
    margin: 0;
  }

  p {
    font-size: ${theme.typography.fontSize.xs};
    opacity: 0.9;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.lg};
  transition: background ${theme.transitions.duration.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  background: ${theme.colors.gray[50]};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.pill};

    &:hover {
      background: ${theme.colors.gray[400]};
    }
  }
`;

const MessageBubble = styled(motion.div)<{ isUser: boolean }>`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: flex-start;
  max-width: 85%;
  ${({ isUser }) =>
    isUser && "flex-direction: row-reverse; margin-left: auto;"};
  ${({ isUser }) => !isUser && "margin-right: auto;"};
`;

const MessageAvatar = styled.div<{ isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ isUser }) => (isUser ? theme.colors.primary.teal : "white")};
  color: ${({ isUser }) => (isUser ? "white" : theme.colors.text.primary)};
  overflow: hidden;

  svg {
    width: 16px;
    height: 16px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  flex: 1;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ isUser }) => (isUser ? theme.colors.primary.teal : "white")};
  color: ${({ isUser }) => (isUser ? "white" : theme.colors.text.primary)};
  box-shadow: ${theme.colors.shadow.sm};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
  font-size: ${theme.typography.fontSize.sm};
`;

const MessageTime = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.tertiary};
  margin-top: ${theme.spacing[1]};
  opacity: 0.7;
`;

const InputContainer = styled.div`
  padding: ${theme.spacing[4]};
  background: white;
  border-top: 2px solid ${theme.colors.gray[200]};
  display: flex;
  gap: ${theme.spacing[2]};
`;

const Input = styled.input`
  flex: 1;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
  }

  &:disabled {
    background: ${theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const SendButton = styled(motion.button)`
  padding: ${theme.spacing[3]};
  background: ${theme.colors.primary.teal};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.dark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing[6]};
  color: ${theme.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: ${theme.spacing[3]};
    color: ${theme.colors.primary.teal};
    opacity: 0.3;
  }

  h4 {
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing[2]};
  }

  p {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  gap: 4px;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
`;

const TypingDot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${theme.colors.gray[400]};
`;

const ChatbotButton: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => new Date().getTime().toString());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      Content: inputValue,
      IsUser: true,
      Timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const userId = user?.id ? parseInt(user.id, 10) : undefined;
      const response = await chatbotApi.sendMessage(
        sessionId,
        currentInput,
        userId
      );

      const botMessage: ChatMessage = {
        Content:
          response.Reply ||
          response.message ||
          "Sorry, I didn't understand that.",
        IsUser: false,
        Timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const err = error as Error;
      const errorMessage: ChatMessage = {
        Content:
          err.message ||
          "Sorry, I'm having trouble connecting. Please try again.",
        IsUser: false,
        Timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <FloatingButton
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </FloatingButton>

      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <ChatHeader>
              <HeaderIcon>
                <Bot />
              </HeaderIcon>
              <HeaderText>
                <h3>BookMyDoctor</h3>
                <p>How can I help you?</p>
              </HeaderText>
              <CloseButton onClick={() => setIsOpen(false)}>
                <X />
              </CloseButton>
            </ChatHeader>

            <MessagesContainer>
              {messages.length === 0 ? (
                <EmptyState>
                  <MessageCircle />
                  <h4>Start a conversation</h4>
                  <p>Ask about health or appointments</p>
                </EmptyState>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={index}
                        isUser={message.IsUser}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MessageAvatar isUser={message.IsUser}>
                          {message.IsUser ? (
                            <UserIcon />
                          ) : (
                            <img src="/images/logo.png" alt="Bot" />
                          )}
                        </MessageAvatar>
                        <div>
                          <MessageContent isUser={message.IsUser}>
                            {message.Content}
                          </MessageContent>
                          <MessageTime>
                            {formatTime(message.Timestamp)}
                          </MessageTime>
                        </div>
                      </MessageBubble>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <MessageBubble isUser={false}>
                      <MessageAvatar isUser={false}>
                        <img src="/images/logo.png" alt="Bot" />
                      </MessageAvatar>
                      <MessageContent isUser={false}>
                        <TypingIndicator>
                          <TypingDot
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: 0,
                            }}
                          />
                          <TypingDot
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: 0.15,
                            }}
                          />
                          <TypingDot
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: 0.3,
                            }}
                          />
                        </TypingIndicator>
                      </MessageContent>
                    </MessageBubble>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </MessagesContainer>

            <InputContainer>
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? <Loader className="animate-spin" /> : <Send />}
              </SendButton>
            </InputContainer>
          </ChatWindow>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotButton;
