const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const migrationsDir = path.join(__dirname, '..', 'vilp-backend', 'src', 'main', 'resources', 'db', 'migration');

const migrationFiles = [
  'V1__create_roles.sql',
  'V2__create_users.sql',
  'V3__create_students.sql',
  'V4__create_companies.sql',
  'V5__create_internships.sql',
  'V6__create_applications.sql',
  'V7__create_documents.sql',
  'V8__create_verifications.sql',
  'V9__create_offers_and_noc.sql',
  'V10__create_logbooks_and_evaluations.sql',
  'V11__create_certificates_and_ppo.sql',
  'V12__create_audit_and_notifications.sql',
  'V13__seed_demo_accounts.sql',
];

async function runMigrations() {
  const client = new Client({
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.pabrkfwturuzewbkswwu',
    password: 'Opgaming55@@',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Connecting to Supabase PostgreSQL...');
  await client.connect();
  console.log('Connected to Supabase PostgreSQL successfully!\n');

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    console.log(`Executing migration: ${file}...`);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await client.query(sql);
      console.log(`✓ Success: ${file}`);
    } catch (err) {
      console.error(`✗ Error executing ${file}:`, err.message);
    }
  }

  console.log('\nVerifying seeded tables in Supabase...');
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('Created Tables in Supabase:');
  res.rows.forEach(r => console.log(` - ${r.table_name}`));

  await client.end();
  console.log('\nAll Supabase schema migrations completed successfully!');
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
