import 'express-session';

declare module 'express-session' {
  interface SessionData {
    member?: {
      email: string;
      admin: boolean;
    },
  }
}