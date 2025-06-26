import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve static files for the main app
app.get("*", (req, res) => {
  const filePath = path.join(process.cwd(), "dist/public", req.path === "/" ? "index.html" : req.path);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Serve index.html for client-side routing
    const indexPath = path.join(process.cwd(), "dist/public/index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not found");
    }
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;