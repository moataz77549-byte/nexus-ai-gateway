import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  root() {
    return {
      name: "Nexus AI Gateway API",
      version: "2.0.0",
      status: "ok",
      timestamp: new Date().toISOString(),
      docs: "/api/docs",
      health: "/health",
    };
  }
}
