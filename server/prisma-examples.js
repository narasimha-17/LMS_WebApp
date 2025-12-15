/**
 * Prisma Client Usage Examples
 * Run with: node prisma-examples.js
 */

require('dotenv').config();
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('=== Prisma Client Examples ===\n');

  try {
    // Example 1: Find all certifications
    console.log('1. Fetching all certifications...');
    const certifications = await prisma.certification.findMany({
      take: 5, // Limit to 5 results
      include: {
        providers: true, // Include related provider data
      },
    });
    console.log(`Found ${certifications.length} certifications`);
    console.log('First certification:', certifications[0]?.certification_name);
    console.log('');

    // Example 2: Find certification by ID
    console.log('2. Finding certification by ID...');
    const cert = await prisma.certification.findUnique({
      where: { certification_id: 1 },
      include: {
        providers: true,
        exams: true,
      },
    });
    console.log('Certification:', cert?.certification_name);
    console.log('');

    // Example 3: Count certifications
    console.log('3. Counting certifications...');
    const count = await prisma.certification.count();
    console.log(`Total certifications: ${count}`);
    console.log('');

    // Example 4: Find active certifications
    console.log('4. Finding active certifications...');
    const activeCerts = await prisma.certification.findMany({
      where: {
        status_active: 'active',
      },
      select: {
        certification_id: true,
        certification_name: true,
        certification_code: true,
        status_active: true,
      },
    });
    console.log(`Active certifications: ${activeCerts.length}`);
    console.log('');

    // Example 5: Find certifications with filters
    console.log('5. Finding certifications with filters...');
    const filteredCerts = await prisma.certification.findMany({
      where: {
        AND: [
          { status_active: 'active' },
          {
            OR: [
              { certification_level: 'Associate' },
              { certification_level: 'Professional' },
            ],
          },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
    });
    console.log(`Filtered certifications: ${filteredCerts.length}`);
    console.log('');

    // Example 6: Find users with their certifications
    console.log('6. Finding users with certifications...');
    const users = await prisma.users.findMany({
      take: 3,
      include: {
        certification_verification: {
          take: 5,
        },
      },
    });
    console.log(`Found ${users.length} users`);
    console.log('');

    // Example 7: Aggregate data
    console.log('7. Aggregating certification data...');
    const stats = await prisma.certification.aggregate({
      _count: true,
      _avg: {
        number_of_mock_questions: true,
        number_of_practice_questions: true,
      },
      _max: {
        number_of_mock_questions: true,
      },
    });
    console.log('Statistics:', stats);
    console.log('');

    // Example 8: Group by provider
    console.log('8. Grouping certifications by provider...');
    const groupedByProvider = await prisma.certification.groupBy({
      by: ['provider_id'],
      _count: {
        certification_id: true,
      },
      orderBy: {
        _count: {
          certification_id: 'desc',
        },
      },
    });
    console.log(`Certifications grouped by ${groupedByProvider.length} providers`);
    console.log('');

    // Example 9: Find providers with their certifications
    console.log('9. Finding providers with certifications...');
    const providers = await prisma.providers.findMany({
      include: {
        certification: {
          select: {
            certification_id: true,
            certification_name: true,
            status_active: true,
          },
        },
      },
    });
    console.log(`Found ${providers.length} providers`);
    console.log('');

    // Example 10: Search certifications by name
    console.log('10. Searching certifications by name...');
    const searchResults = await prisma.certification.findMany({
      where: {
        certification_name: {
          contains: 'AWS',
        },
      },
      take: 5,
    });
    console.log(`Found ${searchResults.length} certifications matching "AWS"`);
    console.log('');

    console.log('=== All examples completed successfully! ===');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
