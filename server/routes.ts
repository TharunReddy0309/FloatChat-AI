import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFloatSchema, 
  insertMeasurementSchema, 
  insertChatQuerySchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Argo Float endpoints
  app.get("/api/floats", async (req, res) => {
    try {
      const floats = await storage.getFloats();
      res.json(floats);
    } catch (error) {
      console.error("Error fetching floats:", error);
      res.status(500).json({ error: "Failed to fetch floats" });
    }
  });

  app.get("/api/floats/:floatId", async (req, res) => {
    try {
      const { floatId } = req.params;
      const float = await storage.getFloatByFloatId(floatId);
      
      if (!float) {
        return res.status(404).json({ error: "Float not found" });
      }
      
      res.json(float);
    } catch (error) {
      console.error("Error fetching float:", error);
      res.status(500).json({ error: "Failed to fetch float" });
    }
  });

  app.post("/api/floats", async (req, res) => {
    try {
      const validatedData = insertFloatSchema.parse(req.body);
      const float = await storage.createFloat(validatedData);
      res.status(201).json(float);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid float data", details: error.errors });
      }
      console.error("Error creating float:", error);
      res.status(500).json({ error: "Failed to create float" });
    }
  });

  // Measurement endpoints
  app.get("/api/measurements", async (req, res) => {
    try {
      const { floatId, minDepth, maxDepth } = req.query;
      
      let measurements;
      if (minDepth && maxDepth) {
        measurements = await storage.getMeasurementsByDepthRange(
          Number(minDepth), 
          Number(maxDepth)
        );
      } else if (floatId) {
        measurements = await storage.getMeasurementsByFloat(String(floatId));
      } else {
        measurements = await storage.getMeasurements();
      }
      
      res.json(measurements);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      res.status(500).json({ error: "Failed to fetch measurements" });
    }
  });

  app.get("/api/measurements/:floatId/profile", async (req, res) => {
    try {
      const { floatId } = req.params;
      const measurements = await storage.getMeasurementsByFloat(floatId);
      
      if (measurements.length === 0) {
        return res.status(404).json({ error: "No measurements found for this float" });
      }
      
      // Format for profile visualization
      const profile = measurements.map(m => ({
        depth: m.depth,
        temperature: m.temperature,
        salinity: m.salinity,
        pressure: m.pressure
      }));
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/measurements", async (req, res) => {
    try {
      const validatedData = insertMeasurementSchema.parse(req.body);
      const measurement = await storage.createMeasurement(validatedData);
      res.status(201).json(measurement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid measurement data", details: error.errors });
      }
      console.error("Error creating measurement:", error);
      res.status(500).json({ error: "Failed to create measurement" });
    }
  });

  // Chat and query endpoints
  app.post("/api/chat/query", async (req, res) => {
    try {
      const { userQuery } = req.body;
      
      if (!userQuery || typeof userQuery !== 'string') {
        return res.status(400).json({ error: "User query is required" });
      }

      // TODO: Replace with actual LLM integration
      // For now, provide mock responses based on query content
      let response = "";
      let queryType = "general";
      let resultData = null;
      
      const queryLower = userQuery.toLowerCase();
      
      if (queryLower.includes("temperature")) {
        queryType = "temperature";
        const measurements = await storage.getMeasurements();
        const avgTemp = measurements.reduce((sum, m) => sum + m.temperature, 0) / measurements.length;
        response = `Based on current data, the average temperature across all measurements is ${avgTemp.toFixed(1)}°C. I found ${measurements.length} temperature readings from active floats.`;
        resultData = { averageTemperature: avgTemp, measurementCount: measurements.length };
      } else if (queryLower.includes("salinity")) {
        queryType = "salinity";
        const measurements = await storage.getMeasurements();
        const avgSalinity = measurements.reduce((sum, m) => sum + m.salinity, 0) / measurements.length;
        response = `The average salinity across all measurements is ${avgSalinity.toFixed(1)} PSU. Salinity levels appear consistent with typical Indian Ocean values.`;
        resultData = { averageSalinity: avgSalinity, measurementCount: measurements.length };
      } else if (queryLower.includes("float") || queryLower.includes("location")) {
        queryType = "location";
        const floats = await storage.getFloats();
        const activeFloats = floats.filter(f => f.status === 'active');
        response = `I found ${floats.length} total floats, with ${activeFloats.length} currently active in the Indian Ocean region.`;
        resultData = { totalFloats: floats.length, activeFloats: activeFloats.length };
      } else {
        response = "I can help you explore oceanographic data! Try asking about temperature profiles, salinity measurements, float locations, or specific depth ranges.";
      }
      
      // Save query to history
      const chatQuery = await storage.saveChatQuery({
        userQuery,
        response,
        queryType,
        resultData: resultData as any
      });
      
      res.json({
        response,
        queryType,
        resultData,
        timestamp: chatQuery.createdAt
      });
      
    } catch (error) {
      console.error("Error processing chat query:", error);
      res.status(500).json({ error: "Failed to process query" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const { limit } = req.query;
      const history = await storage.getChatHistory(limit ? Number(limit) : undefined);
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // Export endpoints
  app.get("/api/export/csv", async (req, res) => {
    try {
      const { floatId, type } = req.query;
      
      let data;
      let filename;
      
      if (type === 'floats') {
        data = await storage.getFloats();
        filename = 'argo_floats.csv';
        
        // Convert to CSV format
        const csvHeader = 'Float ID,Latitude,Longitude,Status,Region,Deployment Date,Last Update\n';
        const csvRows = data.map(f => 
          `${f.floatId},${f.latitude},${f.longitude},${f.status},${f.region || ''},${f.deploymentDate?.toISOString() || ''},${f.lastUpdate?.toISOString() || ''}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvHeader + csvRows);
        
      } else {
        // Default to measurements
        data = floatId ? 
          await storage.getMeasurementsByFloat(String(floatId)) : 
          await storage.getMeasurements();
        filename = floatId ? `${floatId}_measurements.csv` : 'all_measurements.csv';
        
        const csvHeader = 'Float ID,Depth (m),Temperature (°C),Salinity (PSU),Pressure (dbar),Cycle Number,Recorded At\n';
        const csvRows = data.map(m => 
          `${m.floatId},${m.depth},${m.temperature},${m.salinity},${m.pressure || ''},${m.cycleNumber || ''},${m.recordedAt?.toISOString() || ''}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvHeader + csvRows);
      }
      
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "FloatChat API"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
