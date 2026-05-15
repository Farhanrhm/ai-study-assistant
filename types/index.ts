// Subject union type — 7 available study subjects
export type Subject =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "History"
  | "Computer Science"
  | "Economics";

// Mode union type — 3 learning modes
export type Mode = "Explain" | "Quiz" | "Summary";

// Represents a single chat message in the conversation
export interface Message {
  id: string;                      // Unique UUID per message
  role: "user" | "assistant";
  content: string;                 // Message text
  timestamp: Date;                 // Time the message was created
}

// Represents a saved chat session in history
export interface ChatSession {
  id: string;                      // Unique UUID per session
  title: string;                   // Auto-generated from first user message
  subject: Subject;
  mode: Mode;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// React state shape for the chat interface
export interface ChatState {
  messages: Message[];
  subject: Subject;
  mode: Mode;
  isLoading: boolean;
  error: string | null;
}

// Payload sent to the LLM API
export interface LLMRequestPayload {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_completion_tokens?: number;
}

// POST /api/chat — request body
export interface ChatAPIRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  subject: Subject;
  mode: Mode;
}

// POST /api/chat — success response (200 OK)
export interface ChatAPIResponse {
  message: string; // AI response text
}

// POST /api/chat — error response (4xx/5xx)
export interface ChatAPIError {
  error: string; // Human-readable error message
}
