const { createApplication, fetchApplicationsByEmail, updateApplicationStatus } = require('../models/myApplicationsModel');

const createApplicationHandler = async (req, res) => {
  const data = req.body;
  try {
    const application = await createApplication(data);
    res.status(201).json({ message: 'Application successfully made' });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationsHandler = async (req, res) => {
  const userEmail = req.user?.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email is missing' });
  }

  try {
    const applications = await fetchApplicationsByEmail(userEmail);

    // Prevent editing/withdrawing if application is longlisted or the deadline is passed
    const currentDate = new Date();
    applications.forEach((application) => {
      application.canEditOrWithdraw = application.applicationStatus !== 'Longlisted' && new Date(application.vacancyDeadline) > currentDate;
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error.message);
    res.status(500).json({ error: `Error fetching applications: ${error.message}` });
  }
};

const updateApplicationStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await prisma.application.findUnique({ where: { id: parseInt(id) } });

    // Check if the application is longlisted or past the deadline
    if (application.applicationStatus === 'Longlisted' || new Date(application.vacancyDeadline) < new Date()) {
      return res.status(400).json({ error: 'Cannot update or withdraw this application' });
    }

    const updatedApplication = await updateApplicationStatus(id, status);
    res.status(200).json({ message: 'Successfully updated your application' });
  } catch (error) {
    console.error('Error updating application status:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createApplicationHandler, getApplicationsHandler, updateApplicationStatusHandler };
