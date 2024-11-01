import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import setup from "./setup";
import IntegrationPlugin from "@/routes/all.routes";
import ignoreAuthPath from "./utils/ignore-auth-path";

const PORT = Bun.env.SERVER_PORT || 7777;

new Elysia()
  .use(setup)
  .use(swagger())
  .derive(({ headers }) => {
    const auth = headers["authorization"];
    return {
      bearer: auth?.startsWith("Bearer ") ? auth.slice(7) : null,
    };
  })
  .onBeforeHandle(ignoreAuthPath)
  .get("/", () => "Hello Elysia")
  .use(IntegrationPlugin)
  .listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`),
  );
