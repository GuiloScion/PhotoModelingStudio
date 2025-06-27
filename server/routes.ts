import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Download project archive endpoint
  app.get("/download-project", (req, res) => {
    const archivePath = path.join(process.cwd(), "3d-modeling-studio.tar.gz");
    
    if (fs.existsSync(archivePath)) {
      res.setHeader('Content-Type', 'application/gzip');
      res.setHeader('Content-Disposition', 'attachment; filename="3d-modeling-studio.tar.gz"');
      
      const fileStream = fs.createReadStream(archivePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ error: "Archive not found" });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
