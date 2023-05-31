import { createTransport } from "nodemailer";

const emailContent = (username, jobTitle, companyName, date, isAccpeted) => {
  const acceptedContent = `<div style="margin-bottom: 20px; padding:20px">
    <p>Dear ${username},</p>
    <p>We are thrilled to inform you that you have been selected for the position of ${jobTitle} at ${companyName}.
     Congratulations on your new role! We are confident that your skills and experience will be valuable additions to our team.</p>
    <p>We would like to invite you to attend an orientation session on ${date} to help you become familiar with our organization and to introduce you to your new colleagues.
     You will also receive further details about your start date, your responsibilities, and other important information.</p>
    <p>Please confirm your attendance by replying to this email. If you have any questions or concerns, please do not hesitate to contact us.</p>
    </div>`;
  const rejectedContent = `<div style="margin-bottom: 20px; padding:20px">
    <p>Dear ${username},</p>
    <p>We would like to thank you for your interest in the position of ${jobTitle} at ${companyName}.</p>
    <p>After careful consideration, we regret to inform you that we have decided not to proceed with your application. Please know that we received numerous applications from highly qualified candidates and it was a very competitive process. Unfortunately, we cannot offer you the position at this time.</p>
    <p>We appreciate your interest in joining our team and wish you all the best in your future career.</p>
    </div>`;

  return isAccpeted ? acceptedContent : rejectedContent;
};

export const sendMail = async (data) => {
  const {
    email,
    subject,
    text,
    username,
    jobTitle,
    companyName,
    date,
    isAccpeted,
  } = data;

  try {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "kaizen-bridge@gmail.com",
      to: email,
      subject: subject,
      text: text,
      html: `<html>
        <head>
        </head>
        <body>
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #f5f5f5;">
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">${jobTitle}</div>
           ${emailContent(username, jobTitle, companyName, date, isAccpeted)}

           <div style="font-size: 14px; font-style: italic; text-align: center; margin-top: 20px">
  Sincerely,<br>
  Kaizen-Bridge Team<br>
  <br>
  <a href="${
    process.env.FRONT_URL
  }" style="color: #0066cc; text-decoration: none;">${process.env.FRONT_URL}</a>
</div>
      </div>
      
        </body>
        </html>`,
    });
    console.log("Message sent: %s", info);

    return { status: 200, info };
  } catch (error) {
    return error;
  }
};
