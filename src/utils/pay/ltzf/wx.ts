import prisma from "prisma/prismaClients";
import { calculatePaymentSignature } from "./sign";
import dayjs from "dayjs";

interface Commodity {
  id: number;
  price: number;
  title: string;
}

interface PaymentRequestParams {
  [key: string]: string | number;
  mch_id: string;
  out_trade_no: string;
  total_fee: number;
  body: string;
  timestamp: number;
  notify_url: string;
}

/**
 * 生成支付请求表单数据
 * @param commodity 商品信息
 * @returns 支付请求表单数据
 */
export async function generatePaymentFormData(commodity: Commodity): Promise<FormData> {
  const timestamp = dayjs().unix();
  const secretKey = Bun.env.LTZF_MCH_SECRET || "null";
  const mchId = Bun.env.LTZF_MCH_ID || "null";
  const notifyUrl = Bun.env.LTZF_NOTIFY_URL || "null";
  const quitUrl = Bun.env.LTZF_QUIT_URL || "null";
  const returnUrl = Bun.env.LTZF_RETURN_URL || "null";

  const outTradeNo = `LTZF${timestamp}${Math.floor(Math.random() * 900000) + 100000}`;
  const totalFee = commodity.price;
  const body = `<业务标题>-${commodity.title}`;

  const params: PaymentRequestParams = {
    mch_id: mchId,
    out_trade_no: outTradeNo,
    total_fee: totalFee,
    body,
    timestamp,
    notify_url: notifyUrl,
  };

  const sign = calculatePaymentSignature(params, secretKey);

  const formData = new FormData();
  formData.append("mch_id", mchId);
  formData.append("out_trade_no", outTradeNo);
  formData.append("total_fee", totalFee.toString());
  formData.append("body", body);
  formData.append("timestamp", timestamp.toString());
  formData.append("notify_url", notifyUrl);
  formData.append("quit_url", quitUrl);
  formData.append("return_url", returnUrl);
  formData.append("time_expire", "10m");
  formData.append("sign", sign);

  return formData;
}
