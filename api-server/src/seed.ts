import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@2myapi.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    console.log(`User ${email} already exists, skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(usersTable).values({ email, name, passwordHash, role: 'admin' });
  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
