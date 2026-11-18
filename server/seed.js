const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete existing data to prevent duplicates on multiple runs
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'SNCHO',
      slug: 'sncho-healthcare',
      shortDesc: 'Designing a connected healthcare experience that helps patients, healthcare managers and doctors collaborate more efficiently.',
      category: 'Healthcare Management Platform',
      status: 'Published',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
      heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
      order: 1
    }
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'NEXUS',
      slug: 'nexus-fintech',
      shortDesc: 'A comprehensive financial dashboard that visualizes complex data streams into actionable insights for retail investors.',
      category: 'Fintech Dashboard',
      status: 'Published',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
      order: 2
    }
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'LUMINA',
      slug: 'lumina-smarthome',
      shortDesc: 'An intuitive control system for smart home environments, emphasizing ambient computing and minimal intervention.',
      category: 'Smart Home Interface',
      status: 'Published',
      thumbnail: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2070',
      heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2070',
      order: 3
    }
  });

  // Create Experiences
  await prisma.experience.create({
    data: {
      company: 'Studio Aethel',
      position: 'UI/UX Designer',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      description: 'Leading product design for enterprise SaaS applications. Spearheaded the design system overhaul resulting in a 40% reduction in development time.',
      order: 1
    }
  });

  await prisma.experience.create({
    data: {
      company: 'Fintech Solutions Inc.',
      position: 'Product Designer',
      startDate: '2020',
      endDate: '2022',
      isCurrent: false,
      description: 'Designed intuitive financial dashboards for retail investors. Conducted extensive user research and usability testing.',
      order: 2
    }
  });

  console.log('Dummy data inserted successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
