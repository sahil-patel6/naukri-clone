import Mailgen from "mailgen";

var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Naukri Clone",
    copyright: "Copyright © 2023 Naukri Clone. All rights reserved.",
    link: "https://www.google.com",
  },
});

const createEmailBodyForOTP = (data: { name: string, otp: string }) => {
  const emailGen = {
    body: {
      greeting: "Hello",
      signature: "Sincerely",
      name: data.name,
      intro: [
        "Here is your OTP for email verification:",
        `<h1 style='text-align:"center"'>${data.otp}</h1>`
      ],
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  const emailBody = mailGenerator.generate(emailGen);
  return emailBody;
};

export {
  createEmailBodyForOTP
}