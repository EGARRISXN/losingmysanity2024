import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, basePath } from "./sanity/lib/env";
import { schema } from "./sanity/schemas/schema";

export default defineConfig({
  basePath: basePath || "/studio",
  projectId: projectId || "uplas3ff",
  dataset: dataset || "production",
  schema,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion || "2024-03-18" }),
  ],
});
