import { PrismaClient, NoteType, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('AdminPass123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@marcuscruz.com' },
    update: {},
    create: {
      email: 'admin@marcuscruz.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      firstName: 'Marcus',
      lastName: 'Cruz',
    },
  });

  const noirCollection = await prisma.collection.upsert({
    where: { slug: 'noir-collection' },
    update: {},
    create: {
      name: 'Noir Collection',
      slug: 'noir-collection',
      description: 'Dark, rich, and elegant scents.',
      isActive: true,
    },
  });

  const bergamot = await prisma.note.upsert({
    where: { slug: 'bergamot' },
    update: {},
    create: { name: 'Bergamot', slug: 'bergamot' },
  });

  const amber = await prisma.note.upsert({
    where: { slug: 'amber' },
    update: {},
    create: { name: 'Amber', slug: 'amber' },
  });

  const cedar = await prisma.note.upsert({
    where: { slug: 'cedar' },
    update: {},
    create: { name: 'Cedarwood', slug: 'cedar' },
  });

  await prisma.fragrance.upsert({
    where: { slug: 'essence-no-1' },
    update: {},
    create: {
      name: 'Essence No. 1',
      slug: 'essence-no-1',
      description: 'Citrus opening with a warm amber base.',
      priceCents: 14500,
      currency: 'USD',
      sizeMl: 50,
      concentration: 'EDP',
      isActive: true,
      isFeatured: true,
      collectionId: noirCollection.id,
      notes: {
        create: [
          { noteId: bergamot.id, type: NoteType.TOP },
          { noteId: amber.id, type: NoteType.HEART },
          { noteId: cedar.id, type: NoteType.BASE },
        ],
      },
    },
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
