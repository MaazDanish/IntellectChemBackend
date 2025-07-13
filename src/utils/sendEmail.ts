import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport"; // 👈 Add this

const sendMail = async (req: any, res: any) => {
  const transportOptions: SMTPTransport.Options = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(transportOptions);

  try {
    // Send email
    let info = await transporter.sendMail(req);
    console.log("Email sent: " + info.response);
    //res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    //res.status(500).send("Error sending email");
  }
};

export default sendMail;
