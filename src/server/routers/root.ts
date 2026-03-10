import { createTRPCRouter } from "../trpc";
import { ideaRouter } from "./idea";
import { trendRouter } from "./trend";
import { toolRouter } from "./tool";
import { graveyardRouter } from "./graveyard";
import { dashboardRouter } from "./dashboard";
import { userRouter } from "./user";
import { updateRouter } from "./update";
import { hubRouter } from "./hub";
import { aiRouter } from "./ai";
import { adminRouter } from "./admin";

export const appRouter = createTRPCRouter({
  idea: ideaRouter,
  trend: trendRouter,
  tool: toolRouter,
  graveyard: graveyardRouter,
  dashboard: dashboardRouter,
  user: userRouter,
  update: updateRouter,
  hub: hubRouter,
  ai: aiRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
