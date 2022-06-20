import sgMail from "@sendgrid/mail";
type Body = {
  email: string;
  message: string;
  token: string;
};

type Req = {
  method: string;
  body: Body;
};

export default function handler(req: Req, res) {
  //verif method
  if (req.method !== "post") {
    res.status(405).json({ message: "INVALID_METHOD" });
    return;
  }
  const { token, email, message } = req.body;
  if (!message || !email) {
    res.status(400).json({ message: "INVALID_PARAMETER" });
    return;
  }

  const pattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!pattern.test(email)) {
    res.status(400).send({
      message: "EMAIL_SYNTAX_INCORRECT",
    });
    return;
  }

  sgMail.setApiKey(process.env.KEY_SENDGRID);

  //création du mail
  const sendGridMail = {
    to: email,
    from: "contact@lvp-web.fr",
    templateId: "d-cad383b83a1a482690bf97c103aefc28",
    dynamic_template_data: {
      message: message,
      email: email,
      token: token,
    },
  };

  //envois du mail
  (async () => {
    try {
      await sgMail.send(sendGridMail); // choisir quel const utiliser pour l'envois de mail
      res.status(200).json({
        message: "EMAIL_SENDED_SUCCESSFULLY",
      });
    } catch {
      res.status(500).json({
        message: "ERROR_WITH_SENDGRID",
      });
      return;
    }
  })();
}
