export interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    database: string;
  };
}

export interface Track {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    options: string[];
  }[];
}

export interface TracksListResponse {
  ok: boolean;
  data: {
    tracks: Track[];
  };
}

export interface TrackQuestionResponse {
  ok: boolean;
  data: {
    id: string;
    text: string;
    options: string[];
  };
}

export interface SessionQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface SessionStartResponse {
  ok: boolean;
  data: {
    sessionId: string;
    finished: boolean;
    maxQuestions: number;
    question: SessionQuestion;
  };
}

export interface AnswerNextQuestionResponse {
  ok: boolean;
  data: {
    finished: boolean;
    question: SessionQuestion;
  };
}

export interface SessionResult {
  key: string;
  label: string;
  description: string;
  action_type: string;
  level: string;
  actions: unknown[];
}

export interface AnswerFinishResponse {
  ok: boolean;
  data: {
    finished: boolean;
    result: SessionResult;
  };
}

export interface SavedAnswerResponse {
  ok: boolean;
  data: {
    finished: boolean;
    question: SessionQuestion;
    savedResponse: string;
  };
}

export interface SessionResultResponse {
  ok: boolean;
  data: {
    finished: boolean;
    result: SessionResult;
  };
}

export interface FeedbackPayload {
  rate: number;
  useObjective: string;
  suggestion?: string;
}

export interface FeedbackResponse {
  ok: boolean;
  data: {
    sessionId: string;
    rate: number;
    useObjective: string;
    suggestion?: string | null;
    createdAt: string;
  };
}

export interface DeleteSessionResponse {
  ok: boolean;
}
