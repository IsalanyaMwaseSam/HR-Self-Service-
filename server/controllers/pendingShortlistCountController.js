const prisma = require('../prismaClient');

const getPendingShortlistCounts = async (req, res) => {
    try {
        const pendingShortlistVacancies = await prisma.postedJob.findMany({
            where: {
                applications: {
                    some: {
                        applicationStatus: 'Longlisted',
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
                        applicationStatus: 'Longlisted',
                    },
                    select: {
                        id: true,
                    }
                }
            },
        });

        const count = pendingShortlistVacancies.length;

        res.status(200).json({ count, vacancies: pendingShortlistVacancies });
    } catch (error) {
        console.error('Error fetching pending shortlist counts:', error);
        res.status(500).json({ message: 'Error fetching pending shortlist counts', error });
    }
};

module.exports = { getPendingShortlistCounts };


