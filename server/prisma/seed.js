const prisma = require('../prismaClient');

async function main() {
  // Create "HR - Recruitment" permission
  const recruitmentPermission = await prisma.permission.upsert({
    where: { name: 'HR - Recruitment' },
    update: {},
    create: { name: 'HR - Recruitment' },
  })

  // Create "Staff" profile and associate with "HR - Recruitment"
  await prisma.profile.upsert({
    where: { name: 'Staff' },
    update: {},
    create: {
      name: 'Staff',
      permissions: {
        connect: { id: recruitmentPermission.id },
      },
    },
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
