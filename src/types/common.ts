export type HealthResponse = {
  success: boolean;
  message: string;
  timestamp: string;
};

export type GreetResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};