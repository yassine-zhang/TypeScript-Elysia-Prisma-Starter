import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";

// 设置全局语言为中文
dayjs.locale("zh-cn");

console.log("提示[setup.ts]：记得修改Cors.origin");

const ClientAddrs = [
  "http://localhost:5173",
  "http://172.20.10.3:5173",
  "https://example.com",
];

const plugin = new Elysia()
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
  );

export default plugin;
