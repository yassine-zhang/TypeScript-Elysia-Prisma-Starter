import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import IntegrationPlugin from "@/routes/all.routes";
import authWhitelist from "@/bootstrap/auth-whitelist";
import { errorHook, createAuthHook } from "@/hooks";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// 设置全局语言为中文
dayjs.locale("zh-cn");
dayjs.extend(utc);

console.log("提示[./src/bootstrap/app.ts]：记得修改Cors.origin");

const ClientAddrs = [
  "http://localhost:5173",
  "http://172.20.10.3:5173",
  "https://example.com",
];

const PORT = Bun.env.SERVER_PORT || 7777;

export const createApp = () => {
  const app = new Elysia()
    .onError((error) => {
      return errorHook(error as any);
    })
    .use(
      cors({
        origin: [...ClientAddrs],
      }),
    )
    .use(
      jwt({
        name: "jwt",
        secret: "CA8F06487400A37AE4605CC6754F4A93B9CD4995",
        exp: "7d",
      }),
    )
    .use(staticPlugin())
    .use(createAuthHook)
    .onBeforeHandle(authWhitelist)
    .get("/", () => "Hello Elysia")
    .use(IntegrationPlugin);

  return app;
};
