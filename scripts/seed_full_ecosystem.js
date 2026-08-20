const { Client } = require('pg');

async function seedFullEcosystem() {
  const client = new Client({
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.pabrkfwturuzewbkswwu',
    password: 'Opgaming55@@',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connecting to Supabase PostgreSQL for full ecosystem seeding...');

  const studentId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const companyId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  // 1. Seed Companies
  const companySql = `
    INSERT INTO companies (id, user_id, name, description, website, industry, size, headquarters, contact_email, verification_status)
    VALUES 
    (
      '${companyId}',
      '22222222-2222-2222-2222-222222222222',
      'Google Cloud India',
      'Global technology leader specializing in cloud infrastructure, enterprise computing, distributed software, and AI accelerators.',
      'https://cloud.google.com',
      'Cloud Infrastructure',
      'ENTERPRISE',
      'Bangalore, Karnataka',
      'recruiter@google.com',
      'VERIFIED'
    )
    ON CONFLICT (id) DO UPDATE SET 
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      verification_status = EXCLUDED.verification_status;
  `;
  await client.query(companySql);
  console.log('✓ Companies verified & updated');

  // 2. Seed Internships Catalog (6 Roles)
  const internshipSql = `
    INSERT INTO internships (id, company_id, title, description, location, mode, duration, stipend, vacancies, application_deadline, status, verification_status, unique_id)
    VALUES 
    (
      '11111111-0000-0000-0000-000000000001',
      '${companyId}',
      'Cloud Platform Engineering Intern',
      'Architect distributed microservices, Kubernetes ingress controllers, and high-throughput gRPC services with sub-millisecond latencies.',
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
    ),
    (
      '11111111-0000-0000-0000-000000000004',
      '${companyId}',
      'Full Stack React & Cloud Architect Intern',
      'Build high-performance web portals using Next.js, TypeScript, and Tailwind CSS with real-time WebSocket state synchronization.',
      'Bangalore, KA',
      'HYBRID',
      12,
      70000.00,
      4,
      NOW() + INTERVAL '10 days',
      'PUBLISHED',
      'VERIFIED',
      'INT-2026-00104'
    ),
    (
      '11111111-0000-0000-0000-000000000005',
      '${companyId}',
      'DevOps & Site Reliability Engineering Intern',
      'Implement zero-downtime Canary deployments, Prometheus telemetry dashboards, and automated Terraform infrastructure scripts.',
      'Pune, MH',
      'ONSITE',
      14,
      68000.00,
      2,
      NOW() + INTERVAL '12 days',
      'PUBLISHED',
      'VERIFIED',
      'INT-2026-00105'
    ),
    (
      '11111111-0000-0000-0000-000000000006',
      '${companyId}',
      'Data Engineering & Analytics Intern',
      'Design Apache Spark batch ETL pipelines and optimize analytical PostgreSQL data marts for institutional metrics.',
      'Remote India',
      'REMOTE',
      10,
      62000.00,
      3,
      NOW() + INTERVAL '14 days',
      'PUBLISHED',
      'VERIFIED',
      'INT-2026-00106'
    )
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(internshipSql);
  console.log('✓ 6 Verified Internships active');

  // 3. Link Student Skills for Aarav Sharma
  const studentSkillsSql = `
    INSERT INTO student_skills (student_id, skill_id, level)
    VALUES 
      ('${studentId}', 1, 'ADVANCED'),     -- Java
      ('${studentId}', 7, 'ADVANCED'),     -- Spring Boot
      ('${studentId}', 13, 'ADVANCED'),    -- PostgreSQL
      ('${studentId}', 17, 'INTERMEDIATE'),-- Docker
      ('${studentId}', 18, 'INTERMEDIATE'),-- Kubernetes
      ('${studentId}', 3, 'ADVANCED'),     -- JavaScript
      ('${studentId}', 4, 'ADVANCED')      -- TypeScript
    ON CONFLICT (student_id, skill_id) DO NOTHING;
  `;
  await client.query(studentSkillsSql);
  console.log('✓ Student skills linked');

  // 4. Seed Applications for Student
  const appSql = `
    INSERT INTO applications (id, internship_id, student_id, status, applied_at, cover_letter)
    VALUES 
    (
      'aaaaaaaa-0000-0000-0000-000000000001',
      '11111111-0000-0000-0000-000000000001',
      '${studentId}',
      'SELECTED',
      NOW() - INTERVAL '14 days',
      'Strong background in Spring Boot microservices and Kubernetes ingress architecture.'
    ),
    (
      'aaaaaaaa-0000-0000-0000-000000000002',
      '11111111-0000-0000-0000-000000000002',
      '${studentId}',
      'SHORTLISTED',
      NOW() - INTERVAL '7 days',
      'Experience in PyTorch and distributed transformer inference pipelines.'
    )
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(appSql);
  console.log('✓ Student applications seeded');

  // 5. Seed 48-Hour Active Offer
  const offerSql = `
    INSERT INTO offers (id, application_id, internship_id, company_id, student_id, stipend, start_date, end_date, status, terms_and_conditions, expiry_date, created_at)
    VALUES 
    (
      'ffffffff-0000-0000-0000-000000000001',
      'aaaaaaaa-0000-0000-0000-000000000001',
      '11111111-0000-0000-0000-000000000001',
      '${companyId}',
      '${studentId}',
      85000.00,
      CURRENT_DATE + INTERVAL '14 days',
      CURRENT_DATE + INTERVAL '98 days',
      'OFFERED',
      'Standard Google Cloud engineering internship agreement. Includes medical insurance, fast-track PPO review, and faculty mentorship supervision under AICTE §7.2 guidelines.',
      NOW() + INTERVAL '47 hours 50 minutes',
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(offerSql);
  console.log('✓ 48-Hour Active Offer seeded');

  // 6. Seed Weekly Logbooks (195 Hours total approved)
  const logSql = `
    INSERT INTO weekly_reports (id, student_id, internship_id, week_number, start_date, end_date, hours_worked, tasks_summary, skills_applied, status)
    VALUES 
    (
      'cccccccc-0000-0000-0000-000000000001',
      '${studentId}',
      '11111111-0000-0000-0000-000000000001',
      1,
      CURRENT_DATE - INTERVAL '35 days',
      CURRENT_DATE - INTERVAL '29 days',
      40,
      'Configured local development workspace, completed OAuth2 security onboarding, and benchmarked PostgreSQL connection pool throughput.',
      'Java, Spring Boot, PostgreSQL',
      'APPROVED'
    ),
    (
      'cccccccc-0000-0000-0000-000000000002',
      '${studentId}',
      '11111111-0000-0000-0000-000000000001',
      2,
      CURRENT_DATE - INTERVAL '28 days',
      CURRENT_DATE - INTERVAL '22 days',
      40,
      'Implemented Spring Security JWT token refresh and Argon2 password hashing with RFC 7807 problem details.',
      'Spring Security, JWT, Argon2',
      'APPROVED'
    ),
    (
      'cccccccc-0000-0000-0000-000000000003',
      '${studentId}',
      '11111111-0000-0000-0000-000000000001',
      3,
      CURRENT_DATE - INTERVAL '21 days',
      CURRENT_DATE - INTERVAL '15 days',
      40,
      'Optimized PostgreSQL query joins, added partial compound indexes, and reduced latency by 38%.',
      'PostgreSQL, SQL Indexing, Performance Tuning',
      'APPROVED'
    ),
    (
      'cccccccc-0000-0000-0000-000000000004',
      '${studentId}',
      '11111111-0000-0000-0000-000000000001',
      4,
      CURRENT_DATE - INTERVAL '14 days',
      CURRENT_DATE - INTERVAL '8 days',
      40,
      'Configured Kubernetes ingress controller and distributed Prometheus monitoring dashboards.',
      'Kubernetes, Docker, Prometheus',
      'APPROVED'
    ),
    (
      'cccccccc-0000-0000-0000-000000000005',
      '${studentId}',
      '11111111-0000-0000-0000-000000000001',
      5,
      CURRENT_DATE - INTERVAL '7 days',
      CURRENT_DATE - INTERVAL '1 days',
      35,
      'Integrated Kafka event-driven stream consumers and Supabase Realtime change subscribers.',
      'Kafka, Supabase, WebSockets',
      'APPROVED'
    )
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(logSql);
  console.log('✓ 195 Contact Hours of Weekly Logbooks seeded');

  // 7. Seed Certificate Record
  const certSql = `
    INSERT INTO certificates (id, student_id, internship_id, company_id, certificate_number, issue_date, grade, total_hours_completed, status, verification_hash)
    VALUES 
    (
      'dddddddd-0000-0000-0000-000000000001',
      '${studentId}',
      '11111111-0000-0000-0000-000000000001',
      '${companyId}',
      'VILP-2026-CSE-8841',
      CURRENT_DATE - INTERVAL '2 days',
      'A+',
      240,
      'ISSUED',
      '8f9b2d87e3c14a956102831f24d9c7e0984a17c'
    )
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(certSql);
  console.log('✓ Accredited Certificate record seeded');

  await client.end();
  console.log('\n🎉 FULL ECOSYSTEM SEEDING COMPLETED SUCCESSFULLY!');
}

seedFullEcosystem().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
