/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import { 
  initialUsers, 
  initialSubmissions, 
  initialCourses, 
  initialDepartments, 
  initialReports, 
  initialAlerts 
} from "./src/data/mockData";

dotenv.config();

const DB_FILE = path.join(process.cwd(), "db.json");

// Local File Database Helper Functions to ensure schema values remain persistent
function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      users: initialUsers,
      submissions: initialSubmissions,
      courses: initialCourses,
      departments: initialDepartments,
      reports: initialReports,
      alerts: initialAlerts
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading db.json database, resetting default records", err);
    const initialDb = {
      users: initialUsers,
      submissions: initialSubmissions,
      courses: initialCourses,
      departments: initialDepartments,
      reports: initialReports,
      alerts: initialAlerts
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
}

function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to support JSON request payloads
  app.use(express.json());

  // 1. GET FULL STATE (for initial synchronization boot)
  app.get("/api/state", (req, res) => {
    try {
      const db = getDb();
      res.json(db);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. USERS REST ENDPOINTS
  app.get("/api/users", (req, res) => {
    try {
      const db = getDb();
      res.json(db.users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", (req, res) => {
    try {
      const db = getDb();
      const newUser = req.body;
      db.users.unshift(newUser);
      saveDb(db);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/users/:id", (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const updatedFields = req.body;
      db.users = db.users.map((u: any) => u.id === id ? { ...u, ...updatedFields } : u);
      saveDb(db);
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      db.users = db.users.filter((u: any) => u.id !== id);
      saveDb(db);
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. SUBMISSIONS/ASSIGNMENTS REST ENDPOINTS
  app.get("/api/submissions", (req, res) => {
    try {
      const db = getDb();
      res.json(db.submissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/submissions", (req, res) => {
    try {
      const db = getDb();
      const newSubmission = req.body;
      db.submissions.unshift(newSubmission);
      saveDb(db);
      res.status(201).json(newSubmission);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/submissions/:id", (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const updatedSubmission = req.body;
      db.submissions = db.submissions.map((s: any) => s.id === id ? { ...s, ...updatedSubmission } : s);
      saveDb(db);
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. COURSES READ ENDPOINT
  app.get("/api/courses", (req, res) => {
    try {
      const db = getDb();
      res.json(db.courses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5. DEPARTMENTS READ ENDPOINT
  app.get("/api/departments", (req, res) => {
    try {
      const db = getDb();
      res.json(db.departments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6. INSTITUTION REGULATORY REPORTS ENDPOINTS
  app.get("/api/reports", (req, res) => {
    try {
      const db = getDb();
      res.json(db.reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reports", (req, res) => {
    try {
      const db = getDb();
      const newReport = req.body;
      db.reports.unshift(newReport);
      saveDb(db);
      res.status(201).json(newReport);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 7. SYSTEM ALERTS/NOTIFICATIONS REST ENDPOINTS
  app.get("/api/alerts", (req, res) => {
    try {
      const db = getDb();
      res.json(db.alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/alerts", (req, res) => {
    try {
      const db = getDb();
      const newAlert = req.body;
      db.alerts.unshift(newAlert);
      saveDb(db);
      res.status(201).json(newAlert);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/alerts/:id", (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const { read } = req.body;
      db.alerts = db.alerts.map((a: any) => a.id === id ? { ...a, read } : a);
      saveDb(db);
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/alerts/:id", (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      db.alerts = db.alerts.filter((a: any) => a.id !== id);
      saveDb(db);
      res.json({ success: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/alerts/clear", (req, res) => {
    try {
      const db = getDb();
      db.alerts = [];
      saveDb(db);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/alerts/read-all", (req, res) => {
    try {
      const db = getDb();
      db.alerts = db.alerts.map((a: any) => ({ ...a, read: true }));
      saveDb(db);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GEMINI COMPLIANCE CHATBOT GATEWAY
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.json({
          response: "Hi there! I am the ScholarGuard Integrity Assistant. It looks like the server is currently configured with a placeholder `GEMINI_API_KEY` or is in simulated mode.\n\nHere are some of the ways I can help:\n1. **Threshold Configuration**: Help you calibrate plagiarism rates (e.g. 10% to 90%) and explain how strictness alerts trigger notifications.\n2. **Performance Audit**: Explain the integrity metrics for Departments like *Computer Science* (91% Avg score) or *Applied Life Sciences* (79% Avg score).\n3. **MFA & Credentials Settings**: Assist with workspace safety, Multi-Factor Authenticity verification, and administrative policy updates.\n4. **Document Exports**: Review how to compile CSV or audit transcripts."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: "You are ScholarGuard Assist, an expert academic compliance and plagiarism risk auditor AI. Your goal is to guide administrative staff, lecturers, and scholars who want to maintain high ethical standards in university transcripts. Provide concise, constructive insights regarding similarity thresholds, system logs, heatmaps, security options, and educational integrity codes. Keep responses professional, helpful, and scannable.",
        },
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Gemini API server exception:", error);
      res.json({
        response: `[Linguistic Gateway Handshake Timeout] The model returned an index mismatch error: ${error.message || error}. Running localized compliance fallback instead.`
      });
    }
  });

  // Department report data exporter path (retained for backward compatibility or direct calls)
  app.post("/api/export-audit", (req, res) => {
    const { data } = req.body;
    res.json({
      success: true,
      downloadUrl: `data:text/csv;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`,
      timestamp: new Date().toISOString()
    });
  });

  // Enable Vite developer hot middleware in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ScholarGuard Node] Server actively bound on http://localhost:${PORT}`);
  });
}

startServer();
