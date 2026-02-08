import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user (username: demo, password: demo123)
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'EXPERT',
      credits: 500,
      xp: 2500,
      level: 5,
      totalEarned: 500,
      streak: 7,
    },
  });

  console.log('Demo user created:', {
    email: demoUser.email,
    name: demoUser.name,
    role: demoUser.role,
    credits: demoUser.credits,
  });

  console.log('Seed completed successfully!');
  console.log('Demo credentials:');
  console.log('  Email: demo@example.com');
  console.log('  Password: demo123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
