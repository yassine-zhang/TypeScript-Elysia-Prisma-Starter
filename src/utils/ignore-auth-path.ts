// import prismaClient from "prisma/prismaClients";

console.log("提示[ignore-auth-path.ts]：不要忘记验证user是否存在");

const ignoreAuthPath = [
  "/user/login",
  "/user/register",
  "/wxpay/notify",
  /^\/public\/(.*)$/,
  /swagger\/?.*$/,
];

/**
 * 判断给定的路径是否应该被忽略
 * 该函数遍历一个 ignoreAuthPath 模式数组，判断路径是否匹配其中的任何一个模式
 * 如果路径匹配一个字符串模式或正则表达式模式，则返回 true，表示应该忽略该路径
 *
 * @param path 要检查的路径
 * @return 如果路径应被忽略返回 true，否则返回 false
 */
function shouldIgnorePath(path: string) {
  for (let pattern of ignoreAuthPath) {
    if (typeof pattern === "string") {
      if (path === pattern) {
        return true;
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(path)) {
        return true;
      }
    }
  }
  return false;
}

export default async function ({
  path,
  jwt,
  set,
  bearer,
}: ItcoxTypes.ContextPro) {
  if (!shouldIgnorePath(path)) {
    if (!bearer) {
      set.status = 401;
      return {
        code: 1101,
        message: "请传入自定义header -> authorization: Bearer { token }",
      };
    }
    if (bearer) {
      // 验证token
      const payload = await jwt.verify(bearer);

      if (!payload) {
        set.status = 401;
        return {
          code: 1101,
          message: "已传入authorization参数，但验证不通过！",
        };
      } else {
        // const user = await prismaClient.user.findUnique({
        //   where: {
        //     id: payload.id,
        //   },
        // });
        // if (!user) {
        //   set.status = 400;
        //   return {
        //     code: 1100,
        //     message: "用户不存在",
        //   };
        // }
      }
    }
  }
}
