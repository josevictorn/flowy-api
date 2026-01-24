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

interface PasswordChangedEmailProps {
  userName: string
  changeDate: string
  supportUrl?: string
}

export const PasswordChangedEmail = ({
  userName,
  changeDate,
  supportUrl = 'https://flowy.app/suporte',
}: PasswordChangedEmailProps) => {
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
            --success: oklch(0.585 0.169 142.495);
            --success-foreground: oklch(0.988 0 0);
            --destructive: oklch(0.577 0.215 27.325);
            --destructive-foreground: oklch(0.988 0 0);
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
              --success: oklch(0.585 0.169 142.495);
              --success-foreground: oklch(0.988 0 0);
              --destructive: oklch(0.577 0.215 27.325);
              --destructive-foreground: oklch(0.988 0 0);
            }
          }
        `}</style>
      </Head>
      <Preview>Sua senha foi alterada - Flowy</Preview>
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
                success: {
                  DEFAULT: 'var(--success)',
                  foreground: 'var(--success-foreground)',
                },
                destructive: {
                  DEFAULT: 'var(--destructive)',
                  foreground: 'var(--destructive-foreground)',
                },
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-background font-sans antialiased">
          <Container className="mx-auto my-10 max-w-xl border border-border bg-card p-10">
            <Section>
              <Text className="font-semibold text-xl tracking-tight">
                Sua senha foi alterada
              </Text>
              <Text className="text-muted-foreground text-xs">
                Olá <strong className="font-bold">{userName}</strong>,
              </Text>
              <Text className="mt-4 text-muted-foreground text-xs">
                Estamos enviando este email para confirmar que a senha da sua
                conta Flowy foi alterada com sucesso em{' '}
                <strong className="font-bold">{changeDate}</strong>.
              </Text>

              <Section className="my-6 rounded-md border border-success/20 bg-success/10 p-4">
                <Text className="m-0 text-success text-xs">
                  ✓ Sua conta está segura e protegida.
                </Text>
              </Section>

              <Hr className="my-6 border-border border-t" />

              <Text className="font-bold text-destructive text-xs">
                ⚠️ Não foi você?
              </Text>
              <Text className="mt-2 text-muted-foreground text-xs">
                Se você <strong className="font-bold">não realizou</strong> esta
                alteração, sua conta pode estar comprometida. Entre em contato
                com nosso suporte{' '}
                <strong className="font-bold">o mais rápido possível</strong>{' '}
                para que possamos ajudá-lo a proteger sua conta.
              </Text>

              <Section className="my-8 text-center">
                <Button
                  className="inline-flex h-8 items-center justify-center bg-destructive px-2.5 font-medium text-destructive-foreground text-xs"
                  href={supportUrl}
                >
                  Entrar em contato com o suporte
                </Button>
              </Section>

              <Hr className="my-6 border-border border-t" />

              <Text className="font-bold text-muted-foreground text-xs">
                Dicas de segurança:
              </Text>
              <Text className="mt-2 text-muted-foreground text-xs">
                • Use uma senha forte e única para cada serviço
              </Text>
              <Text className="mt-1 text-muted-foreground text-xs">
                • Nunca compartilhe sua senha com ninguém
              </Text>
              <Text className="mt-1 text-muted-foreground text-xs">
                • Altere suas senhas regularmente
              </Text>
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
