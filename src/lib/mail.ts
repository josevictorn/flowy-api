import nodemailer from 'nodemailer'
import { env } from '@/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST ?? 'localhost',
  port: Number(env.SMTP_PORT),
  auth: env.SMTP_USER
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      }
    : undefined,
})

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
