import { app } from '@/app'

export async function makeAuthenticateUser() {
  const signUpResponse = await app.handle(
    new Request('http://localhost:3000/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      }),
    })
  )

  const { user } = (await signUpResponse.json()) as { user: { id: string } }

  const authCookie = signUpResponse.headers.get('set-cookie')

  await app.handle(
    new Request('http://localhost:3000/auth/organization/create', {
      method: 'POST',
      headers: {
        cookie: authCookie || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Acme Corporation',
        slug: 'acme-corporation',
        userId: user.id,
      }),
    })
  )

  return signUpResponse
}
