export interface RequestWithSession extends Request {
  session: Record<string, any>;
}