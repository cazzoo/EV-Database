import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Users ---
  const password = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password,
      role: 'EXPERT',
      credits: 500,
      xp: 2500,
      level: 5,
      totalEarned: 500,
      streak: 7,
      bio: 'EV enthusiast and data contributor. Passionate about accurate specs.',
      location: 'San Francisco, USA',
      website: 'https://example.com',
      notifications: JSON.stringify({
        emailNotifications: true,
        pushNotifications: false,
        newsletter: true,
        contributionUpdates: true,
        achievementAlerts: true,
        creditLowAlert: true,
      }),
    },
  });

  const communityUsers = [
    { name: 'EVEnthusiast', email: 'enthusiast@example.com', xp: 8200, level: 6, credits: 1200, role: 'LEGEND' },
    { name: 'TeslaFan42', email: 'teslafan@example.com', xp: 6100, level: 5, credits: 900, role: 'EXPERT' },
    { name: 'GreenMachine', email: 'green@example.com', xp: 4300, level: 4, credits: 700, role: 'EXPERT' },
    { name: 'ChargeMaster', email: 'charge@example.com', xp: 3100, level: 4, credits: 540, role: 'EXPERT' },
    { name: 'VoltVixen', email: 'volt@example.com', xp: 2200, level: 3, credits: 410, role: 'CONTRIBUTOR' },
    { name: 'AmpedUp', email: 'amped@example.com', xp: 1400, level: 3, credits: 280, role: 'CONTRIBUTOR' },
    { name: 'WattWatcher', email: 'watt@example.com', xp: 850, level: 2, credits: 190, role: 'CONTRIBUTOR' },
    { name: 'NewDriver', email: 'newdriver@example.com', xp: 120, level: 1, credits: 105, role: 'NEWCOMER' },
  ];

  const createdUsers = [demoUser];
  for (const u of communityUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password,
        role: u.role as any,
        xp: u.xp,
        level: u.level,
        credits: u.credits,
      },
    });
    createdUsers.push(user);
  }

  // --- Vehicles ---
  const vehicleData = [
    {
      make: 'Tesla', model: 'Model 3 Long Range', year: 2024, trim: 'Long Range',
      battery: 75, range: 629, efficiency: 142, price: 45990,
      charging: { acPower: 11, dcPower: 250 },
      performance: { acceleration: 4.4, topSpeed: 233, drivetrain: 'AWD' },
    },
    {
      make: 'Ford', model: 'Mustang Mach-E GT', year: 2024, trim: 'GT Performance',
      battery: 91, range: 435, efficiency: 209, price: 52995,
      charging: { acPower: 11.5, dcPower: 150 },
      performance: { acceleration: 3.8, topSpeed: 200, drivetrain: 'AWD' },
    },
    {
      make: 'Hyundai', model: 'Ioniq 5 Long Range', year: 2024, trim: 'Long Range AWD',
      battery: 77.4, range: 458, efficiency: 169, price: 49050,
      charging: { acPower: 11, dcPower: 239 },
      performance: { acceleration: 5.1, topSpeed: 185, drivetrain: 'AWD' },
    },
    {
      make: 'Kia', model: 'EV6 GT', year: 2024, trim: 'GT',
      battery: 77.4, range: 424, efficiency: 183, price: 61600,
      charging: { acPower: 11, dcPower: 239 },
      performance: { acceleration: 3.5, topSpeed: 260, drivetrain: 'AWD' },
    },
    {
      make: 'Volkswagen', model: 'ID.4 Pro', year: 2024, trim: 'Pro S AWD',
      battery: 77, range: 418, efficiency: 184, price: 47795,
      charging: { acPower: 11, dcPower: 175 },
      performance: { acceleration: 5.4, topSpeed: 180, drivetrain: 'AWD' },
    },
    {
      make: 'Rivian', model: 'R1S', year: 2024, trim: 'Quad Motor',
      battery: 135, range: 644, efficiency: 318, price: 87000,
      charging: { acPower: 19.2, dcPower: 220 },
      performance: { acceleration: 3.0, topSpeed: 200, drivetrain: 'AWD' },
    },
    {
      make: 'BMW', model: 'i4 M50', year: 2024, trim: 'M50',
      battery: 83.9, range: 488, efficiency: 172, price: 69900,
      charging: { acPower: 11, dcPower: 205 },
      performance: { acceleration: 3.9, topSpeed: 225, drivetrain: 'AWD' },
    },
    {
      make: 'Lucid', model: 'Air Pure', year: 2024, trim: 'Pure',
      battery: 88, range: 716, efficiency: 134, price: 87400,
      charging: { acPower: 19.2, dcPower: 300 },
      performance: { acceleration: 4.2, topSpeed: 200, drivetrain: 'RWD' },
    },
  ];

  const vehicles: { id: string }[] = [];
  for (const v of vehicleData) {
    const existing = await prisma.electricVehicle.findFirst({
      where: { make: v.make, model: v.model, year: v.year },
    });
    const vehicle = existing
      ? await prisma.electricVehicle.update({
          where: { id: existing.id },
          data: {
            trim: v.trim, battery: v.battery, range: v.range, efficiency: v.efficiency, price: v.price,
            charging: { upsert: { update: v.charging, create: v.charging } },
            performance: { upsert: { update: v.performance, create: v.performance } },
          },
        })
      : await prisma.electricVehicle.create({
          data: {
            make: v.make, model: v.model, year: v.year, trim: v.trim,
            battery: v.battery, range: v.range, efficiency: v.efficiency, price: v.price,
            charging: { create: v.charging },
            performance: { create: v.performance },
          },
        });
    vehicles.push({ id: vehicle.id });
  }

  // --- Achievements ---
  const achievementDefs = [
    { name: 'First Steps', description: 'Make your first contribution', icon: '✏️', xpReward: 10, rarity: 'COMMON', criteria: '{"type":"contributions","count":1}' },
    { name: 'Data Master', description: 'Add 10 new EV entries', icon: '📊', xpReward: 100, rarity: 'RARE', criteria: '{"type":"add_vehicle","count":10}' },
    { name: 'Quality Contributor', description: 'Have 5 contributions approved', icon: '✅', xpReward: 50, rarity: 'UNCOMON', criteria: '{"type":"approved","count":5}' },
    { name: 'Consistent', description: 'Contribute for 7 days in a row', icon: '🔥', xpReward: 75, rarity: 'UNCOMON', criteria: '{"type":"streak","count":7}' },
    { name: 'Dedicated', description: 'Contribute for 30 days in a row', icon: '⭐', xpReward: 300, rarity: 'EPIC', criteria: '{"type":"streak","count":30}' },
    { name: 'Quality Guardian', description: 'Review 25 contributions', icon: '🔍', xpReward: 125, rarity: 'RARE', criteria: '{"type":"reviews","count":25}' },
    { name: 'Helpful Hand', description: 'Receive 10 upvotes on contributions', icon: '👍', xpReward: 50, rarity: 'UNCOMON', criteria: '{"type":"upvotes","count":10}' },
    { name: 'Expert Verifier', description: 'Verify 50 contributions', icon: '🎯', xpReward: 250, rarity: 'LEGENDARY', criteria: '{"type":"verifications","count":50}' },
  ];

  const achievements: { id: string }[] = [];
  for (const a of achievementDefs) {
    const existing = await prisma.achievement.findFirst({ where: { name: a.name } });
    const ach = existing
      ? await prisma.achievement.update({ where: { id: existing.id }, data: a as any })
      : await prisma.achievement.create({ data: a as any });
    achievements.push({ id: ach.id });
  }

  // Award a few achievements to demo user (idempotent via unique constraint)
  const awardIds = achievements.slice(0, 4).map((a) => a.id);
  for (const aid of awardIds) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: demoUser.id, achievementId: aid } },
      update: {},
      create: { userId: demoUser.id, achievementId: aid },
    });
  }

  // --- Contributions ---
  if ((await prisma.contribution.count()) === 0) {
    const contributionTypes = ['ADD_VEHICLE', 'UPDATE_SPECS', 'ADD_PHOTO', 'REVIEW', 'FIX_DATA'];
    const samples = [
      { userId: demoUser.id, type: 'ADD_VEHICLE', status: 'APPROVED', days: 1, vehicle: 0, content: 'Added Tesla Model 3 Long Range with verified WLTP range.' },
      { userId: createdUsers[1].id, type: 'UPDATE_SPECS', status: 'APPROVED', days: 1, vehicle: 1, content: 'Updated charging curve for Mustang Mach-E GT.' },
      { userId: createdUsers[2].id, type: 'ADD_PHOTO', status: 'APPROVED', days: 2, vehicle: 2, content: 'Added new interior photo gallery.' },
      { userId: demoUser.id, type: 'FIX_DATA', status: 'APPROVED', days: 2, vehicle: 3, content: 'Corrected efficiency figure for EV6 GT.' },
      { userId: createdUsers[3].id, type: 'REVIEW', status: 'APPROVED', days: 3, vehicle: 4, content: 'Verified ID.4 Pro pricing across regions.' },
      { userId: demoUser.id, type: 'UPDATE_SPECS', status: 'PENDING', days: 0, vehicle: 5, content: 'Proposed updated R1S quad-motor range data.' },
      { userId: createdUsers[4].id, type: 'ADD_VEHICLE', status: 'APPROVED', days: 4, vehicle: 6, content: 'Added BMW i4 M50 entry.' },
      { userId: createdUsers[5].id, type: 'FIX_DATA', status: 'APPROVED', days: 5, vehicle: 7, content: 'Fixed Lucid Air Pure top speed value.' },
    ];

    for (const s of samples) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - s.days);
      const xpReward = s.type === 'FIX_DATA' ? 30 : s.type === 'ADD_VEHICLE' ? 25 : s.type === 'REVIEW' ? 20 : s.type === 'ADD_PHOTO' ? 15 : 10;
      await prisma.contribution.create({
        data: {
          type: s.type as any,
          status: s.status as any,
          content: s.content,
          userId: s.userId,
          vehicleId: vehicles[s.vehicle].id,
          xpReward: s.status === 'APPROVED' ? xpReward : 0,
          createdAt,
        },
      });
    }
  }

  // --- Reviews (comments) ---
  if ((await prisma.comment.count()) === 0) {
    const reviewSamples = [
      { user: 1, vehicle: 0, content: 'Amazing range for the price. The 629km WLTP is achievable on the highway at moderate speeds.' },
      { user: 2, vehicle: 0, content: 'Supercharging network makes long trips effortless. Highly recommend.' },
      { user: 3, vehicle: 1, content: 'GT Performance is incredibly quick. Range drops fast at highway speeds though.' },
    ];
    for (const r of reviewSamples) {
      await prisma.comment.create({
        data: {
          content: r.content,
          userId: createdUsers[r.user].id,
          vehicleId: vehicles[r.vehicle].id,
        },
      });
    }
  }

  // --- Votes ---
  if ((await prisma.vote.count()) === 0) {
    for (let v = 0; v < vehicles.length; v++) {
      const upvotes = Math.floor(Math.random() * 8) + 1;
      for (let i = 0; i < upvotes; i++) {
        const u = createdUsers[i % createdUsers.length];
        try {
          await prisma.vote.create({
            data: { value: 1, userId: u.id, vehicleId: vehicles[v].id },
          });
        } catch {
          // ignore duplicate unique constraint
        }
      }
    }
  }

  // --- Transactions ---
  if ((await prisma.transaction.count({ where: { userId: demoUser.id } })) === 0) {
    const txns = [
      { type: 'PURCHASE_CREDITS', amount: 500, description: 'Purchased 500 credits', days: 30 },
      { type: 'EARN_CONTRIBUTION', amount: 25, description: 'Reward for adding Tesla Model 3', days: 25 },
      { type: 'EARN_STREAK', amount: 10, description: '7-day contribution streak bonus', days: 20 },
      { type: 'API_USAGE', amount: -3, description: 'API calls - 3 credits', days: 10 },
      { type: 'ACHIEVEMENT_REWARD', amount: 50, description: 'Quality Contributor achievement', days: 5 },
    ];
    for (const t of txns) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - t.days);
      await prisma.transaction.create({
        data: {
          type: t.type as any,
          amount: t.amount,
          description: t.description,
          userId: demoUser.id,
          createdAt,
        },
      });
    }
  }

  // --- API Keys for demo user ---
  if ((await prisma.apiKey.count({ where: { userId: demoUser.id } })) === 0) {
    await prisma.apiKey.create({
      data: {
        key: 'pk_ev_hub_' + Math.random().toString(36).slice(2, 18),
        name: 'Production Key',
        tier: 'PRO',
        rateLimit: 100000,
        userId: demoUser.id,
      },
    });
    await prisma.apiKey.create({
      data: {
        key: 'pk_test_ev_hub_' + Math.random().toString(36).slice(2, 18),
        name: 'Test Key',
        tier: 'BASIC',
        rateLimit: 5000,
        userId: demoUser.id,
      },
    });
  }

  // --- API Usage sample ---
  if ((await prisma.apiUsage.count({ where: { userId: demoUser.id } })) === 0) {
    const endpoints = [
      { endpoint: '/api/vehicles', method: 'GET' },
      { endpoint: '/api/vehicles/tesla-model-3-long-range', method: 'GET' },
      { endpoint: '/api/leaderboard', method: 'GET' },
      { endpoint: '/api/contributions', method: 'GET' },
    ];
    for (let i = 0; i < 40; i++) {
      const e = endpoints[i % endpoints.length];
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - i * 3);
      await prisma.apiUsage.create({
        data: {
          endpoint: e.endpoint,
          method: e.method,
          statusCode: i % 15 === 0 ? 429 : 200,
          creditsUsed: 1,
          responseTime: Math.floor(Math.random() * 200) + 40,
          userId: demoUser.id,
          createdAt,
        },
      });
    }
  }

  // --- Payment Method for demo user ---
  if ((await prisma.paymentMethod.count({ where: { userId: demoUser.id } })) === 0) {
    await prisma.paymentMethod.create({
      data: {
        userId: demoUser.id,
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2027,
        isDefault: true,
      },
    });
  }

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
