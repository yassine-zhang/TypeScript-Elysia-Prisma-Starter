import { MD5 } from "crypto-js";

interface PaymentParams {
  [key: string]: string | number;
}

/**
 * 计算支付签名
 * @param params 支付参数对象
 * @param secretKey 商户密钥
 * @returns 签名字符串
 */
export const calculatePaymentSignature = (params: PaymentParams, secretKey: string): string => {
  const paramKeys = Object.keys(params);
  paramKeys.sort();

  const paramStringArray = paramKeys.map((key) => `${key}=${params[key]}`);
  paramStringArray.push(`key=${secretKey}`);

  const paramString = paramStringArray.join("&");
  return MD5(paramString).toString().toUpperCase();
};
