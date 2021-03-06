import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

class SendMailService {
   private client: Transporter;

   constructor() { 
      nodemailer.createTestAccount().then(account => {
         const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
               user: account.user,
               pass: account.pass
            }
         })

         this.client = transporter;
      });
   }

   async send(to: string, subject: string, variables: object, path: string) {
      const templateFileContent = fs.readFileSync(path).toString("utf-8");

      const mailTemplateParse = handlebars.compile(templateFileContent);

      const html = mailTemplateParse(variables);

      const info = await this.client.sendMail({
         to,
         subject,
         html,
         from: "NPS <noreply@nps.com.br>"
      })
      
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
   }
}

export default new SendMailService();