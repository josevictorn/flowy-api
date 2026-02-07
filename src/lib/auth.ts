import { render } from '@react-email/render'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, organization } from 'better-auth/plugins'
import { randomUUIDv7 } from 'bun'
import { env } from '@/env'
import { OrganizationInvitationEmail } from '@/http/mail/organization-invitation'
import { PasswordChangedEmail } from '@/http/mail/password-changed'
import { ResetPasswordEmail } from '@/http/mail/reset-password'
import { sendEmail } from './mail'
import { prisma } from './prisma'

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:5173'],
  basePath: '/auth',
  plugins: [
    openAPI(),
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${env.CLIENT_URL}/accept-invitation/${data.id}`

        const html = await render(
          OrganizationInvitationEmail({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          })
        )

        await sendEmail({
          subject: `${data.inviter.user.name} convidou você para ${data.organization.name} - Flowy`,
          to: data.email,
          html,
        })
      },
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => randomUUIDv7(),
    },
    cookiePrefix: '@flowy-app',
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
    sendResetPassword: async ({ user, url }) => {
      const html = await render(
        ResetPasswordEmail({ userName: user.name, resetUrl: url })
      )

      await sendEmail({
        to: user.email,
        subject: 'Redefinição de senha - Flowy',
        html,
      })
    },
    onPasswordReset: async ({ user }) => {
      const html = await render(
        PasswordChangedEmail({
          userName: user.name,
          changeDate: new Date().toLocaleString(),
          supportUrl: `${process.env.CLIENT_URL}/`,
        })
      )

      await sendEmail({
        to: user.email,
        subject: 'Sua senha foi alterada - Flowy',
        html,
      })
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await prisma.organizations.findFirst({
            where: {
              members: {
                some: {
                  userId: session.userId,
                },
              },
            },
          })

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          }
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
})
