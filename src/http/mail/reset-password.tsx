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

interface ResetPasswordEmailProps {
  userName: string
  resetUrl: string
  expiryHours?: number
}

export const ResetPasswordEmail = ({
  userName,
  resetUrl,
  expiryHours = 24,
}: ResetPasswordEmailProps) => {
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
      <Preview>Redefinir sua senha - Flowy</Preview>
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
                Redefinir sua senha
              </Text>
              <Text className="text-muted-foreground text-xs">
                Olá <strong className="font-bold">{userName}</strong>,
              </Text>
              <Text className="mt-4 text-muted-foreground text-xs">
                Recebemos uma solicitação para redefinir a senha da sua conta.
                Clique no botão abaixo para criar uma nova senha:
              </Text>

              <Section className="my-8 text-center">
                <Button
                  className="inline-flex h-8 items-center justify-center bg-primary px-2.5 font-medium text-primary-foreground text-xs"
                  href={resetUrl}
                >
                  Redefinir Senha
                </Button>
              </Section>

              <Text className="mt-4 text-muted-foreground text-xs">
                Este link expirará em{' '}
                <strong className="font-bold">{expiryHours} horas</strong> por
                motivos de segurança.
              </Text>

              <Hr className="my-6 border-border border-t" />

              <Text className="font-bold text-muted-foreground text-xs">
                Não solicitou esta alteração?
              </Text>
              <Text className="mt-2 text-muted-foreground text-xs">
                Se você não solicitou a redefinição de senha, pode ignorar este
                email com segurança. Sua senha atual permanecerá inalterada.
              </Text>
              <Text className="mt-6 text-muted-foreground text-xs">
                Se o botão não funcionar, copie e cole este link no seu
                navegador:
              </Text>
              <a
                className="mt-2 break-all text-primary text-xs"
                href={resetUrl}
              >
                {resetUrl}
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
