import sgMail from "@sendgrid/mail";
import crypto from "crypto";
type Data = {
  email: string;
  message: string;
};

export const sendMail = async (data: Data) => {
  sgMail.setApiKey(process.env.KEY_SENDGRID);

  const token = crypto.randomBytes(16).toString("hex");

  const sendGridMail = {
    to: data.email,
    from: "contact@lvp-web.fr",
    templateId: "d-55310f6ba05a4d0fa87efce98dfc4a5b", // testform
    dynamic_template_data: {
      message: data.message,
      email: data.email,
      token: token,
    },
  };

  (async () => {
    try {
      await sgMail.send(sendGridMail);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};
