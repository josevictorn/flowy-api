import { fakerPT_BR as faker } from '@faker-js/faker'
import { prisma } from '@/lib/prisma'

faker.seed(42) // seed determinístico — mesmos dados a cada execução

// ---------------------------------------------------------------------------
// Helper: cria produto + preços de forma idempotente
// ---------------------------------------------------------------------------
interface PriceInput {
  id: string
  billingScheme: 'ONE_TIME' | 'RECURRING'
  interval?:
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY'
    | 'QUARTERLY'
    | 'SEMIANNUALLY'
    | 'YEARLY'
    | null
  unitAmount: number
  currency: string
}

interface ProductInput {
  id: string
  name: string
  description: string
  active: boolean
  organizationsId: string
  prices: PriceInput[]
}

async function upsertProduct({ prices, ...productData }: ProductInput) {
  const product = await prisma.product.upsert({
    where: { id: productData.id },
    update: {},
    create: productData,
  })

  await prisma.price.createMany({
    skipDuplicates: true,
    data: prices.map((price) => ({
      ...price,
      interval: price.interval ?? null,
      productId: product.id,
      organizationsId: productData.organizationsId,
    })),
  })

  return product
}
// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
;(async () => {
  console.log('🌱 Seeding database...')

  const hashedPassword = await Bun.password.hash('Password@123')

  const alice = await prisma.users.upsert({
    where: { email: 'alice@flowy.dev' },
    update: {},
    create: {
      id: 'seed-user-alice',
      name: 'Alice Silva',
      email: 'alice@flowy.dev',
      emailVerified: true,
      accounts: {
        create: {
          id: 'seed-account-alice',
          accountId: 'seed-account-alice',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  const bob = await prisma.users.upsert({
    where: { email: 'bob@flowy.dev' },
    update: {},
    create: {
      id: 'seed-user-bob',
      name: 'Bob Souza',
      email: 'bob@flowy.dev',
      emailVerified: true,
      accounts: {
        create: {
          id: 'seed-account-bob',
          accountId: 'seed-account-bob',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  const carol = await prisma.users.upsert({
    where: { email: 'carol@flowy.dev' },
    update: {},
    create: {
      id: 'seed-user-carol',
      name: 'Carol Mendes',
      email: 'carol@flowy.dev',
      emailVerified: false,
      accounts: {
        create: {
          id: 'seed-account-carol',
          accountId: 'seed-account-carol',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // -------------------------
  // Random extra users via faker
  // -------------------------
  const extraUsers = await Promise.all(
    Array.from({ length: 5 }, (_, i) => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const email = faker.internet
        .email({ firstName, lastName, provider: 'flowy.dev' })
        .toLowerCase()

      return prisma.users.upsert({
        where: { email },
        update: {},
        create: {
          id: `seed-user-extra-${i}`,
          name: `${firstName} ${lastName}`,
          email,
          emailVerified: faker.datatype.boolean(),
          accounts: {
            create: {
              id: `seed-account-extra-${i}`,
              accountId: `seed-account-extra-${i}`,
              providerId: 'credential',
              password: hashedPassword,
            },
          },
        },
      })
    })
  )

  console.log(
    `✅ Users: ${alice.name}, ${bob.name}, ${carol.name} + ${extraUsers.length} gerados com faker`
  )

  // -------------------------
  // Organizations
  // -------------------------
  const acme = await prisma.organizations.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      id: 'seed-org-acme',
      name: 'Acme Inc.',
      slug: 'acme',
      logo: 'https://avatar.vercel.sh/acme',
      createdAt: new Date(),
    },
  })

  const startup = await prisma.organizations.upsert({
    where: { slug: 'startup-xyz' },
    update: {},
    create: {
      id: 'seed-org-startup',
      name: 'Startup XYZ',
      slug: 'startup-xyz',
      logo: 'https://avatar.vercel.sh/startup-xyz',
      createdAt: new Date(),
    },
  })

  console.log(`✅ Organizations: ${acme.name}, ${startup.name}`)

  // -------------------------
  // Members
  // -------------------------
  await prisma.members.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'seed-member-alice-acme',
        organizationId: acme.id,
        userId: alice.id,
        role: 'owner',
        createdAt: new Date(),
      },
      {
        id: 'seed-member-bob-acme',
        organizationId: acme.id,
        userId: bob.id,
        role: 'member',
        createdAt: new Date(),
      },
      {
        id: 'seed-member-bob-startup',
        organizationId: startup.id,
        userId: bob.id,
        role: 'owner',
        createdAt: new Date(),
      },
      {
        id: 'seed-member-carol-startup',
        organizationId: startup.id,
        userId: carol.id,
        role: 'admin',
        createdAt: new Date(),
      },
      ...extraUsers.map((user, i) => ({
        id: `seed-member-extra-${i}`,
        organizationId: i % 2 === 0 ? acme.id : startup.id,
        userId: user.id,
        role: 'member' as const,
        createdAt: faker.date.past(),
      })),
    ],
  })

  console.log('✅ Members linked to organizations')

  // -------------------------
  // Products — Acme Inc. (plataforma SaaS)
  // -------------------------
  const acmeProducts = await Promise.all([
    upsertProduct({
      id: 'seed-product-acme-basic',
      name: 'Plano Básico',
      description:
        'Ideal para times pequenos. Inclui até 5 usuários e acesso às funcionalidades essenciais.',
      active: true,
      organizationsId: acme.id,
      prices: [
        {
          id: 'seed-price-acme-basic-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 2990,
          currency: 'BRL',
        },
        {
          id: 'seed-price-acme-basic-yearly',
          billingScheme: 'RECURRING',
          interval: 'YEARLY',
          unitAmount: 28_900,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-acme-pro',
      name: 'Plano Pro',
      description:
        'Para times em crescimento. Até 20 usuários, integrações avançadas e suporte prioritário.',
      active: true,
      organizationsId: acme.id,
      prices: [
        {
          id: 'seed-price-acme-pro-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 9990,
          currency: 'BRL',
        },
        {
          id: 'seed-price-acme-pro-yearly',
          billingScheme: 'RECURRING',
          interval: 'YEARLY',
          unitAmount: 95_900,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-acme-enterprise',
      name: 'Plano Enterprise',
      description:
        'Solução completa para grandes empresas. Usuários ilimitados, SLA 99,9% e infraestrutura dedicada.',
      active: true,
      organizationsId: acme.id,
      prices: [
        {
          id: 'seed-price-acme-enterprise-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 29_900,
          currency: 'BRL',
        },
        {
          id: 'seed-price-acme-enterprise-yearly',
          billingScheme: 'RECURRING',
          interval: 'YEARLY',
          unitAmount: 299_000,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-acme-api',
      name: 'Acesso à API',
      description:
        'Créditos mensais para integração via API REST. Inclui 100k requisições/mês.',
      active: true,
      organizationsId: acme.id,
      prices: [
        {
          id: 'seed-price-acme-api-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 4990,
          currency: 'BRL',
        },
        {
          id: 'seed-price-acme-api-quarterly',
          billingScheme: 'RECURRING',
          interval: 'QUARTERLY',
          unitAmount: 13_900,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-acme-storage',
      name: 'Armazenamento Extra',
      description: '100 GB adicionais de armazenamento em nuvem seguro.',
      active: false, // produto descontinuado
      organizationsId: acme.id,
      prices: [
        {
          id: 'seed-price-acme-storage',
          billingScheme: 'ONE_TIME',
          interval: null,
          unitAmount: 4990,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-acme-onboarding',
      name: 'Onboarding Assistido',
      description:
        'Sessão de 4h com especialista dedicado para configuração inicial da plataforma.',
      active: true,
      organizationsId: acme.id,
      prices: [
        {
          id: 'seed-price-acme-onboarding',
          billingScheme: 'ONE_TIME',
          interval: null,
          unitAmount: 89_900,
          currency: 'BRL',
        },
      ],
    }),
  ])

  // -------------------------
  // Products — Startup XYZ (ferramentas de growth)
  // -------------------------
  const startupProducts = await Promise.all([
    upsertProduct({
      id: 'seed-product-startup-starter',
      name: 'SaaS Starter',
      description: 'Kit inicial completo para startups em fase de crescimento.',
      active: true,
      organizationsId: startup.id,
      prices: [
        {
          id: 'seed-price-startup-starter-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 19_900,
          currency: 'BRL',
        },
        {
          id: 'seed-price-startup-starter-yearly',
          billingScheme: 'RECURRING',
          interval: 'YEARLY',
          unitAmount: 199_000,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-startup-growth',
      name: 'Growth Pack',
      description:
        'Dashboard de analytics, automações de marketing e funil de conversão em um só lugar.',
      active: true,
      organizationsId: startup.id,
      prices: [
        {
          id: 'seed-price-startup-growth-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 49_900,
          currency: 'BRL',
        },
        {
          id: 'seed-price-startup-growth-semiannual',
          billingScheme: 'RECURRING',
          interval: 'SEMIANNUALLY',
          unitAmount: 269_900,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-startup-consulting',
      name: 'Consultoria Técnica',
      description:
        'Sessão de 2h com especialista sênior para revisão de arquitetura e roadmap.',
      active: true,
      organizationsId: startup.id,
      prices: [
        {
          id: 'seed-price-startup-consulting',
          billingScheme: 'ONE_TIME',
          interval: null,
          unitAmount: 59_900,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-startup-white-label',
      name: 'White Label',
      description:
        'Remova a marca Flowy e customize a plataforma com a identidade da sua empresa.',
      active: true,
      organizationsId: startup.id,
      prices: [
        {
          id: 'seed-price-startup-white-label-monthly',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 39_900,
          currency: 'BRL',
        },
      ],
    }),

    upsertProduct({
      id: 'seed-product-startup-legacy',
      name: 'Plano Legado',
      description: 'Plano descontinuado mantido para clientes antigos.',
      active: false,
      organizationsId: startup.id,
      prices: [
        {
          id: 'seed-price-startup-legacy',
          billingScheme: 'RECURRING',
          interval: 'MONTHLY',
          unitAmount: 9900,
          currency: 'BRL',
        },
      ],
    }),
  ])

  // -------------------------
  // Extra random products via faker (3 por org)
  // -------------------------
  const fakerAcmeProducts = await Promise.all(
    Array.from({ length: 3 }, (_, i) =>
      upsertProduct({
        id: `seed-product-acme-faker-${i}`,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        active: faker.datatype.boolean({ probability: 0.8 }),
        organizationsId: acme.id,
        prices: [
          {
            id: `seed-price-acme-faker-${i}`,
            billingScheme: 'RECURRING',
            interval: faker.helpers.arrayElement([
              'MONTHLY',
              'YEARLY',
            ] as const),
            unitAmount: faker.number.int({ min: 1990, max: 19_900 }),
            currency: 'BRL',
          },
        ],
      })
    )
  )

  const fakerStartupProducts = await Promise.all(
    Array.from({ length: 3 }, (_, i) =>
      upsertProduct({
        id: `seed-product-startup-faker-${i}`,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        active: faker.datatype.boolean({ probability: 0.8 }),
        organizationsId: startup.id,
        prices: [
          {
            id: `seed-price-startup-faker-${i}`,
            billingScheme: faker.helpers.arrayElement([
              'ONE_TIME',
              'RECURRING',
            ] as const),
            interval: faker.helpers.arrayElement([
              'MONTHLY',
              'QUARTERLY',
              'YEARLY',
            ] as const),
            unitAmount: faker.number.int({ min: 4990, max: 99_900 }),
            currency: 'BRL',
          },
        ],
      })
    )
  )

  const totalAcme = acmeProducts.length + fakerAcmeProducts.length
  const totalStartup = startupProducts.length + fakerStartupProducts.length

  console.log(
    `✅ Products: ${totalAcme + totalStartup} criados (${totalAcme} Acme, ${totalStartup} Startup XYZ)`
  )

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📋 Credenciais (senha: Password@123):')
  console.log('   alice@flowy.dev  → owner  @ Acme Inc.')
  console.log('   bob@flowy.dev    → member @ Acme Inc. | owner @ Startup XYZ')
  console.log('   carol@flowy.dev  → admin  @ Startup XYZ')
})()
  .catch((err: unknown) => {
    console.error('❌ Seed falhou:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
