const Application  = require('../models/longlistModel');
const prisma = require('../prismaClient')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendLonglistEmail = async (applicantEmail, fullName) => {
  const msg = {
      from: 's.isalanya@teslaitsolutions.co.ug', 
      to: applicantEmail,
      subject: 'Congratulations! You have been Longlisted',
      html: `
          <p>Dear ${fullName},</p>
          <p>Congratulations! Your application has been successfully longlisted. Please prepare for the next steps in the shortlisting process. Further details will be communicated to you shortly.</p>
          <p>Best regards,<br>Recruitment Team</p>
      `,
  };

  try {
      await sgMail.send(msg);
      console.log(`Longlisting email sent to ${applicantEmail}`);
  } catch (error) {
      console.error(`Failed to send email to ${applicantEmail}:`, error);
  }
};

const addToLonglist = async (req, res) => {
  try {
    const { applicationIds, vacancyCode } = req.body;

    if (!applicationIds || applicationIds.length === 0) {
      return res.status(400).json({ message: 'No application IDs provided' });
    }

    // Update the applicationStatus to Longlisted for the given applicationIds
    const updatedApplications = await prisma.application.updateMany({
      where: {
        id: { in: applicationIds }
      },
      data: {
        applicationStatus: 'Longlisted'
      }
    });

    if (updatedApplications.count === 0) {
      return res.status(404).json({ message: 'No applications were updated' });
    }

    // Fetch the longlisted applicants to send them emails
    const longlistedApplicants = await prisma.application.findMany({
      where: {
        id: { in: applicationIds }
      },
      include: {
        applicant: {
          include: {
            personal: true, // Include the Personal relation to get names
          },
        },
      },
    });

    // Send an email to each longlisted applicant
    for (const application of longlistedApplicants) {
      const applicantEmail = application.applicant.email; 
      const personalDetails = application.applicant.personal;
      const fullName = `${personalDetails.firstName} ${personalDetails.middleName || ''} ${personalDetails.lastName}`.trim();

      await sendLonglistEmail(applicantEmail, fullName);
    }

    // Now, reject the remaining applications (those not longlisted)
    const rejectedApplications = await prisma.application.updateMany({
      where: {
        id: { notIn: applicationIds },
        vacancyCode: vacancyCode,
        applicationStatus: 'Applied' // Only reject applications that are still 'Applied'
      },
      data: {
        applicationStatus: 'Unsuccessful'
      }
    });

    res.status(200).json({
      message: 'Candidates longlisted and remaining applications rejected successfully',
      updatedApplications,
      rejectedApplicationsCount: rejectedApplications.count
    });

  } catch (error) {
    console.error('Error longlisting candidates:', error);
    res.status(500).json({ message: 'Error longlisting candidates', error });
  }
};


const getLonglistedCandidates = async (req, res) => {
  try {
      // Map jobRoleId to vacancyCode
      const { jobRoleId } = req.query;
      const vacancyCode = jobRoleId;

      if (!vacancyCode) {
          return res.status(400).json({ message: 'Job Role ID (Vacancy Code) is required' });
      }

      // Query the database to find candidates who are longlisted for the specified vacancy code
      const longlistedCandidates = await prisma.application.findMany({
        where: {
          vacancyCode: jobRoleId,
          applicationStatus: 'Longlisted',
        },
        include: {
          applicant: {
            include: {
              personal: true,
              education: true,
              certificate: true,
              experience: true,
              skills: true,
              languages: true,
              attachments: true,
            },
          },
        },
      });
      console.log("The longlisted candidates are:", longlistedCandidates)
      if (longlistedCandidates.length === 0) {
          return res.status(404).json({ message: 'No longlisted candidates found for this job role' });
      }

      res.status(200).json(longlistedCandidates);
  } catch (error) {
      console.error('Error fetching longlisted candidates:', error);
      res.status(500).json({ message: 'Error fetching longlisted candidates', error });
  }
};


console.log('addToLonglist function:', addToLonglist);
module.exports = { 
  addToLonglist,
  getLonglistedCandidates 
};

