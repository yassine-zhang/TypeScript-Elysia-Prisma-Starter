import { sendEmail } from "@/utils/email-sender";
import dayjs from "dayjs";
import type { ApiResponse } from "@/types/response";

// code, utcTime,
const captchaMap = new Map<string, string>();

/**
 * 获取注册邮箱验证码
 * 该函数用于生成注册邮箱验证码，并通过电子邮件发送给用户。验证码存储在 captchaMap 中，并带有生成时间戳。html 模板用于生成个性化的电子邮件内容，其中包含用户名和验证码。使用 sendEmail 函数发送生成的电子邮件。
 * @param {Context} ctx - 上下文对象，包含查询参数
 * @returns {Promise<ApiResponse<null>>} - 返回发送结果
 */
export async function getEmailCaptcha({
  query,
}: ItcoxTypes.ContextPro): Promise<ApiResponse<null>> {
  const { address, uname } = query;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  captchaMap.set(code, dayjs().format());

  let html = await Bun.file("./src/emails/register.html").text();

  html = html.replace("{{USERNAME}}", (uname || "亲爱的用户") as string);
  html = html.replace("{{OTP}}", code);

  await sendEmail(address as string, "知慧flow - 用户注册邮箱验证码", html);

  return {
    success: true,
    data: null,
    message: "验证码邮件发送成功",
  };
}

/**
 * 清理过期的验证码。通过遍历 captchaMap，检查每个验证码的创建时间与当前时间的间隔是否大于给定的分钟数 m，如果是，则从 captchaMap 中删除该验证码。
 *
 * @param {number} m - 以分钟为单位的时间间隔，用于判断验证码是否过期。
 */
export function clearExpiredCodeCaptcha(m: number) {
  for (const [key, value] of captchaMap) {
    const offsetTime = dayjs().diff(value, "minute");
    if (offsetTime >= m) {
      captchaMap.delete(key);
    }
  }
}

/**
 * 验证验证码是否过期或是否存在于验证码映射中
 * @param expired 验证码过期时间（分钟）
 * @param code 验证码
 * @returns 验证结果
 */
export function verifyEmailCaptcha(
  expired: number,
  code: string,
): ApiResponse<boolean> {
  const offsetTime = dayjs().diff(captchaMap.get(code), "minute");

  if (offsetTime < expired && captchaMap.get(code)) {
    return {
      success: true,
      data: true,
      message: "验证码验证通过",
    };
  } else {
    return {
      success: false,
      data: false,
      message: "验证码无效或已过期",
      errorCode: 1001,
    };
  }
}

/**
 * 删除指定的目标代码验证码
 * 此函数用于从内存中的验证码映射（captchaMap）中删除指定的目标代码验证码文本。
 * 调用此函数后，系统将不再持有指定验证码的记录，并且将无法再使用该验证码进行任何操作。
 * @param code - 要删除的目标代码验证码文本
 */
export function deleteTargetEmailCaptcha(code: string) {
  captchaMap.delete(code);
}
