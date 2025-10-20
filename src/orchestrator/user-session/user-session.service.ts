import { Injectable, Logger } from '@nestjs/common';

interface SessionData {
  lastActive: number;
}

@Injectable()
export class UserSessionService {
  private readonly logger = new Logger(UserSessionService.name);
  private readonly sessions = new Map<string, SessionData>();
  private readonly ONE_HOUR = 60 * 60 * 1000;

  constructor() {
    setInterval(() => this.cleanupExpiredSessions(), 10 * 60 * 1000);
  }

  public isNewOrExpired(sender: string): boolean {
    const session = this.sessions.get(sender);
    if (!session) return true;
    return Date.now() - session.lastActive > this.ONE_HOUR;
  }

  public updateSession(sender: string) {
    this.sessions.set(sender, { lastActive: Date.now() });
  }

  public deleteSession(sender: string) {
    this.sessions.delete(sender);
  }

  private cleanupExpiredSessions() {
    const now = Date.now();
    let deleted = 0;

    for (const [sender, session] of this.sessions.entries()) {
      if (now - session.lastActive > this.ONE_HOUR) {
        this.sessions.delete(sender);
        deleted++;
      }
    }

    if (deleted > 0) {
      this.logger.log(`🧼 ${deleted} session kedaluwarsa dihapus dari memory.`);
    }
  }
}
