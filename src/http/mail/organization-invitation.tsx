import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface OrganizationInvitationEmailProps {
  email: string
  invitedByUsername: string
  invitedByEmail: string
  teamName: string
  inviteLink: string
}

export const OrganizationInvitationEmail = ({
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: OrganizationInvitationEmailProps) => {
  return (
    <Html>
      <Head>
        <meta content="light dark" name="color-scheme" />
        <meta content="light dark" name="supported-color-schemes" />
        <style>{`
          :root {
            color-scheme: light dark;
            --background: oklch(1 0 0);
            --foreground: oklch(0.145 0 0);
            --card: oklch(1 0 0);
            --card-foreground: oklch(0.145 0 0);
            --primary: oklch(0.488 0.243 264.376);
            --primary-foreground: oklch(0.97 0.014 254.604);
            --secondary: oklch(0.967 0.001 286.375);
            --secondary-foreground: oklch(0.21 0.006 285.885);
            --muted: oklch(0.97 0 0);
            --muted-foreground: oklch(0.556 0 0);
            --accent: oklch(0.97 0 0);
            --accent-foreground: oklch(0.205 0 0);
            --border: oklch(0.922 0 0);
          }
          
          @media (prefers-color-scheme: dark) {
            :root {
              --background: oklch(0.145 0 0);
              --foreground: oklch(0.985 0 0);
              --card: oklch(0.205 0 0);
              --card-foreground: oklch(0.985 0 0);
              --primary: oklch(0.42 0.18 266);
              --primary-foreground: oklch(0.97 0.014 254.604);
              --secondary: oklch(0.274 0.006 286.033);
              --secondary-foreground: oklch(0.985 0 0);
              --muted: oklch(0.269 0 0);
              --muted-foreground: oklch(0.708 0 0);
              --accent: oklch(0.371 0 0);
              --accent-foreground: oklch(0.985 0 0);
              --border: oklch(1 0 0 / 10%);
            }
          }
        `}</style>
      </Head>
      <Preview>
        {invitedByUsername} convidou você para {teamName} - Flowy
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                  DEFAULT: 'var(--card)',
                  foreground: 'var(--card-foreground)',
                },
                primary: {
                  DEFAULT: 'var(--primary)',
                  foreground: 'var(--primary-foreground)',
                },
                secondary: {
                  DEFAULT: 'var(--secondary)',
                  foreground: 'var(--secondary-foreground)',
                },
                muted: {
                  DEFAULT: 'var(--muted)',
                  foreground: 'var(--muted-foreground)',
                },
                accent: {
                  DEFAULT: 'var(--accent)',
                  foreground: 'var(--accent-foreground)',
                },
                border: 'var(--border)',
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-background font-sans antialiased">
          <Container className="mx-auto my-10 max-w-xl border border-border bg-card p-10">
            <Section>
              <Text className="font-semibold text-xl tracking-tight">
                Convite para {teamName}
              </Text>
              <Text className="text-muted-foreground text-xs">
                Olá! Você foi convidado(a) para fazer parte de uma equipe.
              </Text>
              <Text className="mt-4 text-muted-foreground text-xs">
                <strong className="font-bold">{invitedByUsername}</strong> (
                {invitedByEmail}) convidou você para participar da organização{' '}
                <strong className="font-bold">{teamName}</strong> na Flowy.
              </Text>

              <Section className="my-8 text-center">
                <Button
                  className="inline-flex h-8 items-center justify-center bg-primary px-2.5 font-medium text-primary-foreground text-xs"
                  href={inviteLink}
                >
                  Aceitar Convite
                </Button>
              </Section>

              <Text className="mt-4 text-muted-foreground text-xs">
                Ao aceitar este convite, você terá acesso aos recursos e
                projetos compartilhados pela organização.
              </Text>

              <Hr className="my-6 border-border border-t" />

              <Text className="font-bold text-muted-foreground text-xs">
                Não conhece esta organização?
              </Text>
              <Text className="mt-2 text-muted-foreground text-xs">
                Se você não esperava este convite ou não conhece o remetente,
                pode ignorar este email com segurança. Nenhuma ação será tomada.
              </Text>
              <Text className="mt-6 text-muted-foreground text-xs">
                Se o botão não funcionar, copie e cole este link no seu
                navegador:
              </Text>
              <a
                className="mt-2 break-all text-primary text-xs"
                href={inviteLink}
              >
                {inviteLink}
              </a>
            </Section>

            <Section className="mt-8 border-border border-t pt-4">
              <Text className="text-center text-muted-foreground text-xs">
                © 2026 Flowy. Todos os direitos reservados.
              </Text>
              <Text className="mt-2 text-center text-muted-foreground text-xs">
                Este é um email automático, por favor não responda.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
