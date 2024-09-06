const prisma = require('../prismaClient');

const getPendingLonglistCounts = async (req, res) => {
    try {
        const pendingLonglistVacancies = await prisma.postedJob.findMany({
            where: {
                applications: {
                    some: {
                        applicationStatus: 'Applied',
                    },
                },
            },
            select: {
                id: true,
                vacancyCode: true,
                jobTitle: true,
                orgDepartment: true,
                dutyStation: true,
                applications: {
                    where: {
                        applicationStatus: 'Applied',
                    },
                    select: {
                        id: true,
                    }
                }
            },
        });

        const count = pendingLonglistVacancies.length;

        res.status(200).json({ count, vacancies: pendingLonglistVacancies });
    } catch (error) {
        console.error('Error fetching pending longlist counts:', error);
        res.status(500).json({ message: 'Error fetching pending longlist counts', error });
    }
};

module.exports = { getPendingLonglistCounts };

