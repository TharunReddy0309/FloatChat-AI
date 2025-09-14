import { 
  type ArgoFloat, 
  type InsertArgoFloat, 
  type Measurement, 
  type InsertMeasurement,
  type ChatQuery,
  type InsertChatQuery,
  type User, 
  type InsertUser 
} from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for oceanographic data operations
export interface IStorage {
  // Argo Float operations
  getFloats(): Promise<ArgoFloat[]>;
  getFloat(id: string): Promise<ArgoFloat | undefined>;
  getFloatByFloatId(floatId: string): Promise<ArgoFloat | undefined>;
  createFloat(float: InsertArgoFloat): Promise<ArgoFloat>;
  updateFloatStatus(floatId: string, status: string): Promise<ArgoFloat | undefined>;
  
  // Measurement operations
  getMeasurements(floatId?: string): Promise<Measurement[]>;
  getMeasurementsByFloat(floatId: string): Promise<Measurement[]>;
  getMeasurementsByDepthRange(minDepth: number, maxDepth: number): Promise<Measurement[]>;
  createMeasurement(measurement: InsertMeasurement): Promise<Measurement>;
  
  // Chat query operations
  saveChatQuery(query: InsertChatQuery): Promise<ChatQuery>;
  getChatHistory(limit?: number): Promise<ChatQuery[]>;
  
  // Legacy user operations (keeping for future auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private floats: Map<string, ArgoFloat>;
  private measurements: Map<string, Measurement>;
  private chatQueries: Map<string, ChatQuery>;
  private users: Map<string, User>;

  constructor() {
    this.floats = new Map();
    this.measurements = new Map();
    this.chatQueries = new Map();
    this.users = new Map();
    
    // Initialize with sample Indian Ocean float data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample Argo floats in Indian Ocean
    const sampleFloats: InsertArgoFloat[] = [
      {
        floatId: "ARGO001",
        latitude: -10.5,
        longitude: 75.2,
        status: "active",
        region: "Indian Ocean"
      },
      {
        floatId: "ARGO002",
        latitude: -8.3,
        longitude: 78.1,
        status: "active",
        region: "Indian Ocean"
      },
      {
        floatId: "ARGO003",
        latitude: -12.1,
        longitude: 72.8,
        status: "inactive",
        region: "Indian Ocean"
      },
      {
        floatId: "ARGO004",
        latitude: -15.7,
        longitude: 80.5,
        status: "active",
        region: "Indian Ocean"
      }
    ];

    // Create sample floats
    for (const floatData of sampleFloats) {
      await this.createFloat(floatData);
    }

    // Sample measurements for each float
    const sampleMeasurements: InsertMeasurement[] = [
      // ARGO001 profile
      { floatId: "ARGO001", depth: 0, temperature: 28.5, salinity: 34.7, pressure: 0, cycleNumber: 1 },
      { floatId: "ARGO001", depth: 50, temperature: 27.8, salinity: 34.8, pressure: 50, cycleNumber: 1 },
      { floatId: "ARGO001", depth: 100, temperature: 26.2, salinity: 34.9, pressure: 100, cycleNumber: 1 },
      { floatId: "ARGO001", depth: 150, temperature: 24.5, salinity: 35.0, pressure: 150, cycleNumber: 1 },
      { floatId: "ARGO001", depth: 200, temperature: 22.8, salinity: 35.1, pressure: 200, cycleNumber: 1 },
      
      // ARGO002 profile
      { floatId: "ARGO002", depth: 0, temperature: 27.8, salinity: 34.9, pressure: 0, cycleNumber: 1 },
      { floatId: "ARGO002", depth: 50, temperature: 27.1, salinity: 35.0, pressure: 50, cycleNumber: 1 },
      { floatId: "ARGO002", depth: 100, temperature: 25.8, salinity: 35.1, pressure: 100, cycleNumber: 1 },
      { floatId: "ARGO002", depth: 150, temperature: 24.2, salinity: 35.2, pressure: 150, cycleNumber: 1 },
      { floatId: "ARGO002", depth: 200, temperature: 22.5, salinity: 35.3, pressure: 200, cycleNumber: 1 },
    ];

    for (const measurementData of sampleMeasurements) {
      await this.createMeasurement(measurementData);
    }
  }

  // Float operations
  async getFloats(): Promise<ArgoFloat[]> {
    return Array.from(this.floats.values());
  }

  async getFloat(id: string): Promise<ArgoFloat | undefined> {
    return this.floats.get(id);
  }

  async getFloatByFloatId(floatId: string): Promise<ArgoFloat | undefined> {
    return Array.from(this.floats.values()).find(f => f.floatId === floatId);
  }

  async createFloat(insertFloat: InsertArgoFloat): Promise<ArgoFloat> {
    const id = randomUUID();
    const float: ArgoFloat = {
      ...insertFloat,
      id,
      status: insertFloat.status || "active",
      region: insertFloat.region || null,
      deploymentDate: new Date(),
      lastUpdate: new Date()
    };
    this.floats.set(id, float);
    return float;
  }

  async updateFloatStatus(floatId: string, status: string): Promise<ArgoFloat | undefined> {
    const float = await this.getFloatByFloatId(floatId);
    if (float) {
      float.status = status;
      float.lastUpdate = new Date();
      this.floats.set(float.id, float);
      return float;
    }
    return undefined;
  }

  // Measurement operations
  async getMeasurements(floatId?: string): Promise<Measurement[]> {
    const allMeasurements = Array.from(this.measurements.values());
    if (floatId) {
      return allMeasurements.filter(m => m.floatId === floatId);
    }
    return allMeasurements;
  }

  async getMeasurementsByFloat(floatId: string): Promise<Measurement[]> {
    return Array.from(this.measurements.values())
      .filter(m => m.floatId === floatId)
      .sort((a, b) => a.depth - b.depth);
  }

  async getMeasurementsByDepthRange(minDepth: number, maxDepth: number): Promise<Measurement[]> {
    return Array.from(this.measurements.values())
      .filter(m => m.depth >= minDepth && m.depth <= maxDepth);
  }

  async createMeasurement(insertMeasurement: InsertMeasurement): Promise<Measurement> {
    const id = randomUUID();
    const measurement: Measurement = {
      ...insertMeasurement,
      id,
      pressure: insertMeasurement.pressure || null,
      cycleNumber: insertMeasurement.cycleNumber || null,
      recordedAt: new Date()
    };
    this.measurements.set(id, measurement);
    return measurement;
  }

  // Chat query operations
  async saveChatQuery(insertQuery: InsertChatQuery): Promise<ChatQuery> {
    const id = randomUUID();
    const query: ChatQuery = {
      ...insertQuery,
      id,
      generatedSql: insertQuery.generatedSql || null,
      response: insertQuery.response || null,
      queryType: insertQuery.queryType || null,
      resultData: insertQuery.resultData || null,
      createdAt: new Date()
    };
    this.chatQueries.set(id, query);
    return query;
  }

  async getChatHistory(limit: number = 50): Promise<ChatQuery[]> {
    return Array.from(this.chatQueries.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  // Legacy user operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
