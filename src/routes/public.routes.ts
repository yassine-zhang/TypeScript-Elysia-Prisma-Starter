import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";

import { getCaptcha, clearExpiredCaptcha } from "@/controllers/public/captcha";
import {
  getCodeCaptcha,
  clearExpiredCodeCaptcha,
} from "@/controllers/public/codeCaptcha";
import { publicModels } from "@/models/public.model";

const plugin = new Elysia({ prefix: "/public" })
  .use(publicModels)
  .use(
    cron({
      name: "Detection verification pool",
      pattern: "*/5 * * * *",
      run() {
        clearExpiredCaptcha(5);
        clearExpiredCodeCaptcha(15);
      },
    }),
  )
  .get("/getCaptcha", getCaptcha)
  .get("/getCodeCaptcha", getCodeCaptcha, { query: "getCodeCaptcha.query" });

export default plugin;
