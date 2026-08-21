const { Client } = require('pg');

async function updateDemoPasswords() {
  const client = new Client({
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.pabrkfwturuzewbkswwu',
    password: 'Opgaming55@@',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL...');

  const bcryptHash = '{bcrypt}$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

  const res = await client.query(
    `UPDATE users 
     SET password_hash = $1,
         email_verified = true,
         status = 'ACTIVE'
     WHERE email IN ('student@vilp.edu', 'recruiter@google.com', 'mentor@vilp.edu', 'tnp.officer@vilp.edu', 'tnp.head@vilp.edu', 'admin@vilp.edu')`,
    [bcryptHash]
  );

  console.log(`Updated ${res.rowCount} demo user accounts successfully.`);
  await client.end();
}

updateDemoPasswords().catch(err => {
  console.error('Migration update error:', err);
  process.exit(1);
});
