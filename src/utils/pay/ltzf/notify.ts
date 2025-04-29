import prisma from "prisma/prismaClients";
import { calculatePaymentSignature } from "./sign";

interface PaymentNotification {
  code: string;
  timestamp: string;
  mch_id: string;
  order_no: string;
  out_trade_no: string;
  pay_no: string;
  total_fee: number;
  sign: string;
}

/**
 * 验证支付通知签名
 * @param notification 支付通知数据
 * @returns 签名是否有效
 */
function verifyPaymentSignature(notification: PaymentNotification): boolean {
  const secretKey = Bun.env.LTZF_MCH_SECRET || "";
  const { code, timestamp, mch_id, order_no, out_trade_no, pay_no, total_fee } = notification;

  const params = {
    code,
    timestamp,
    mch_id,
    order_no,
    out_trade_no,
    pay_no,
    total_fee,
  };

  const calculatedSign = calculatePaymentSignature(params, secretKey);
  return calculatedSign === notification.sign;
}

/**
 * 处理支付通知
 * @param notification 支付通知数据
 * @returns 处理结果
 */
export default async function handlePaymentNotification({ body }: { body: PaymentNotification }): Promise<string> {
  if (!verifyPaymentSignature(body)) {
    return "FAIL";
  }

  const { code, out_trade_no } = body;
  if (code === "0") {
    // TODO: 实现支付成功后的业务逻辑
    // 1. 查询订单状态
    // 2. 更新订单状态为支付成功
    // 3. 为用户颁发奖励
  }

  return "SUCCESS";
}
