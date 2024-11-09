import nodemailer from 'nodemailer';
import Owner from '../models/ownerModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // create a hash token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await Owner.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      }, {
        new: true,
        runValidators: true,
      });
    } else if (emailType === 'RESET') {
      await Owner.findByIdAndUpdate(userId, {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour
      }, {
        new: true,
        runValidators: true,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "3d61e4de26cbc2",
        pass: "1cdba0437688c7",
      },
    });

    const mailOptions = {
      from: 'vishwajitnaik1999@gmail.com',
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${process.env.DOMAIN}/home/verifyEmail?token=${hashedToken}">
      here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} 
      or copy and paste the link below in your browser. <br>
      ${process.env.DOMAIN}/home/verifyEmail?token=${hashedToken}
      </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;

  } catch (error) {
    console.error("Error in sendEmail function:", error.message);
    throw new Error(error.message);
  }
};
