import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "../..");
const frontendDist = path.join(projectRoot, "dist");
const server = express();

const legacyEndpoint = (pathName) => (req, res, next) => {
  req.url = `${pathName}${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;
  app(req, res, next);
};
server.use("/connect", legacyEndpoint("/connect"));
server.use("/connn", legacyEndpoint("/connn"));
server.use("/keys/reset", legacyEndpoint("/keys/reset"));
server.use("/keys/delete", legacyEndpoint("/keys/delete"));
server.use("/keys/api", legacyEndpoint("/keys/api"));
server.use("/delete_file", legacyEndpoint("/uploads"));
server.use("/api", app);
server.use(express.static(frontendDist));
server.use((req, res, next) => {
  if (req.method !== "GET" || req.path.includes(".")) return next();
  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) next(error);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`server listening on ${port}`));
