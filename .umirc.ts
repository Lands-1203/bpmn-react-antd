import { defineConfig } from "umi";
export default defineConfig({
  routes: [{ path: "/", component: "./BpmnEnter" }],
  npmClient: "pnpm",
});
