import SvgCaptchaFactory from "svg-captcha";
import dayjs from "dayjs";

// 将svg字符串转换为浏览器可预览的base64 image函数
function svgToBase64(svg: string) {
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}

// text, utcTime,
const captchaMap = new Map<string, string>();

/**
 * 获取验证码
 * @returns 包含验证码及其图形表示的对象
 */
export async function getCaptcha() {
  const { data, text } = SvgCaptchaFactory.create({
    size: 5,
    color: true,
    ignoreChars: "0oO1iIl",
    height: 35,
    width: 96,
    fontSize: 36,
    background: "#bef853",
  });

  captchaMap.set(text, dayjs().format());

  return {
    code: 1000,
    captcha: svgToBase64(data),
  };
}

/**
 * 清理过期的验证码。通过遍历 captchaMap，检查每个验证码的创建时间与当前时间的间隔是否大于给定的分钟数 m，如果是，则从 captchaMap 中删除该验证码。
 *
 * @param {number} m - 以分钟为单位的时间间隔，用于判断验证码是否过期。
 */
export function clearExpiredCaptcha(m: number) {
  for (const [key, value] of captchaMap) {
    const offsetTime = dayjs().diff(value, "minute");
    if (offsetTime >= m) {
      captchaMap.delete(key);
    }
  }
}

/**
 * 验证验证码的有效性
 * @param expired 验证码过期时间（分钟）
 * @param text 验证码文本
 * @throws {Error} 当验证码不存在或已经过期时抛出错误
 * @returns 如果验证码有效，返回 true；否则返回 false
 */
export function verifyCaptcha(expired: number, text: string) {
  const offsetTime = dayjs().diff(captchaMap.get(text), "minute");

  if (offsetTime < expired && captchaMap.get(text)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 删除指定的验证码。
 * 这个函数用于从内存中的验证码映射（captchaMap）中删除指定的验证码文本。
 * 调用这个函数后，系统将不再持有指定验证码的记录，并且将无法再使用该验证码进行任何操作。
 * @param text - 要删除的验证码文本
 */
export function deleteCaptcha(text: string) {
  captchaMap.delete(text);
}