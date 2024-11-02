# typescript-elysia-prisma-starter

## Environment variables

项目采用dotenvx管理环境变量，你在拉取此项目后，请先修改`.env.development`和`.env.production`文件，添加你的环境变量。

1. DATABASE_URL： 数据库连接字符串，请根据你的数据库类型，修改此字符串，他在`prisma/schema.prisma`中被引用。
2. SERVER_PORT： 服务端口，请根据你的需要，修改此端口。
3. EMAIL：发送功能依赖于ZeptoMail，请先在ZeptoMail注册账号，并添加你的API Token以及其他信息。你也可以移除此模块，使用你自己的邮件发送服务，文件位置：`src/utils/email-sender.ts`。

## Encryption & Decryption Notes

注意：请不要将环境变量以明文的形式上传到公开仓库，你可使用`bun run encrypt-dev/encrypt-prod`命令，加密`.env.development/.env.production`文件。

另外，请不要将生成的`.env.keys`文件上传到公开仓库，此文件包含你的加密私钥，请妥善保管。

[dotenvx文档](https://dotenvx.com/)

## Git Commit Code Formatting

运行以下命令安装husky

```bash
bun run prepare-fallback
```

## Install dependencies

> This project was created using `bun init` in bun v1.1.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

```bash
bun install
```

## Prisma Configuration

请先在`prisma/schema.prisma`中创建model，如下：

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

现在你还要留意环境变量`DATABASE_URL`，他需要配置你的数据库连接字符串，请根据你的数据库类型，修改此字符串。

关于binaryTargets的更多信息，请参考[Prisma文档](https://www.prisma.io/docs/orm/overview/prisma-schema-file-structure/prisma-schema-file-structure#binarytargets)。

## Swagger endpoint

> 该插件为Elysia 服务器生成 Swagger 端点

访问/swagger将向您显示一个Scalar UI，其中包含从 Elysia 服务器生成的endpoint文档。您还可以在/swagger/json访问原始 OpenAPI 规范。

项目运行后，默认访问地址：http://localhost:10010/swagger
