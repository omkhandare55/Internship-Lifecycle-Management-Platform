const { Client } = require('pg');

async function seedOpportunities() {
  const client = new Client({
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.pabrkfwturuzewbkswwu',
    password: 'Opgaming55@@',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL for seeding...');

  const companyId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  // 1. Seed Internships
  const internshipSql = `
    INSERT INTO internships (id, company_id, title, description, location, mode, duration, stipend, vacancies, application_deadline, status, verification_status, unique_id)
    VALUES 
    (
      '11111111-0000-0000-0000-000000000001',
      '${companyId}',
      'Cloud Platform Engineering Intern',
      'Work alongside the Google Cloud core infrastructure team architecting distributed microservices, Kubernetes ingress controllers, and high-throughput gRPC services.',
      'Bangalore, KA',
      'HYBRID',
      12,
      85000.00,
      5,
      NOW() + INTERVAL '3 days',
      'PUBLISHED',
      'VERIFIED',
      'INT-2026-00101'
    ),
    (
      '11111111-0000-0000-0000-000000000002',
      '${companyId}',
      'Applied AI & Machine Learning Systems Intern',
      'Develop scalable LLM fine-tuning pipelines and evaluate latency bottlenecks across distributed TensorRT clusters.',
      'Hyderabad, TS',
      'ONSITE',
      16,
      75000.00,
      3,
      NOW() + INTERVAL '5 days',
      'PUBLISHED',
      'VERIFIED',
      'INT-2026-00102'
    ),
    (
      '11111111-0000-0000-0000-000000000003',
      '${companyId}',
      'Distributed Backend Systems Intern',
      'Build resilient relational database sharding architectures and Kafka event streams with sub-millisecond p99 latencies.',
      'Remote India',
      'REMOTE',
      12,
      65000.00,
      4,
      NOW() + INTERVAL '7 days',
      'PUBLISHED',
      'VERIFIED',
      'INT-2026-00103'
    )
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(internshipSql);
  console.log('✓ Internships seeded');

  // 2. Seed Requirements
  const reqSql = `
    INSERT INTO internship_requirements (internship_id, minimum_cgpa, maximum_backlogs, department, passing_year)
    VALUES 
    ('11111111-0000-0000-0000-000000000001', 8.00, 0, 'Computer Science Engineering', 2026),
    ('11111111-0000-0000-0000-000000000002', 8.50, 0, 'Computer Science Engineering', 2026),
    ('11111111-0000-0000-0000-000000000003', 7.50, 0, 'Information Technology', 2026)
    ON CONFLICT (internship_id) DO NOTHING;
  `;
  await client.query(reqSql);
  console.log('✓ Internship Requirements seeded');

  // 3. Link Skills
  const skillsLinkSql = `
    INSERT INTO internship_skills (internship_id, skill_id, is_mandatory)
    VALUES 
    ('11111111-0000-0000-0000-000000000001', 1, true), -- Java
    ('11111111-0000-0000-0000-000000000001', 7, true), -- Spring Boot
    ('11111111-0000-0000-0000-000000000001', 17, true), -- Docker
    ('11111111-0000-0000-0000-000000000001', 18, true), -- Kubernetes
    ('11111111-0000-0000-0000-000000000002', 2, true), -- Python
    ('11111111-0000-0000-0000-000000000002', 12, true), -- FastAPI
    ('11111111-0000-0000-0000-000000000003', 1, true), -- Java
    ('11111111-0000-0000-0000-000000000003', 13, true), -- PostgreSQL
    ('11111111-0000-0000-0000-000000000003', 16, true)  -- Redis
    ON CONFLICT (internship_id, skill_id) DO NOTHING;
  `;
  await client.query(skillsLinkSql);
  console.log('✓ Skills linked to opportunities');

  // 4. Seed Notifications
  const notifSql = `
    INSERT INTO notifications (user_id, title, message, type, is_read)
    VALUES 
    (
      '11111111-1111-1111-1111-111111111111',
      'Official Offer Issued by Google Cloud India',
      'Google Cloud India has extended an official internship offer (₹85,000/mo). 48-Hour Decision Window active.',
      'OFFER',
      false
    ),
    (
      '11111111-1111-1111-1111-111111111111',
      'Week 4 Attendance Approved',
      'Dr. Rajesh Sharma approved 40 contact hours with a 5.0/5.0 rating.',
      'LOGBOOK',
      true
    ),
    (
      '11111111-1111-1111-1111-111111111111',
      'AICTE NEP-2020 Stage 3 Verified',
      'Your institutional clearance is active and synchronized with AICTE ledger.',
      'SYSTEM',
      true
    )
    ON CONFLICT DO NOTHING;
  `;
  await client.query(notifSql);
  console.log('✓ Seed Notifications created');

  await client.end();
  console.log('Opportunities seeding completed successfully!');
}

seedOpportunities().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
