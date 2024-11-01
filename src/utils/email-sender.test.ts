import { expect, test } from "bun:test";
import { sendEmail } from "./email-sender";

test("Test sending a rich text email.", async () => {
  let html = await Bun.file("./src/emails/register.html").text();
  html = html.replace("{{USERNAME}}", "yassine");
  html = html.replace("{{OTP}}", "397678");
  expect(
    await sendEmail(
      "business@itcox.com",
      "【产品名】 - 邮箱验证码(test-mode)",
      html,
    ),
  ).toBe(true);
});
