const prisma = require('../prismaClient');

// Function to fetch applicant data based on their ID
const getApplicantData = async (applicantId) => {
    return await prisma.applicant.findUnique({
        where: { id: applicantId },
        select: {
            education: true, 
            certificate: true, 
            experience: true,
            skills: true, 
            attachments: true,
            languages: true,
        }
    });
};

// Function to fetch evaluation criteria from the database
const fetchEvaluationCriteria = async (jobRoleId) => {
    const evaluationCriteria = await prisma.evaluationCriteria.findFirst({
        where: { jobRoleId: jobRoleId },
        select: {
            id: true,
            jobRoleId: true,
            createdAt: true,
            createdByEmail: true,
            criteria: {
                select: {
                    id: true,
                    label: true,
                    weight: true,
                    options: {
                        select: {
                            id: true,
                            label: true,
                            points: true,
                        },
                    },
                },
            }, 
        },
    });

    console.log("Fetched Evaluation Criteria:", evaluationCriteria);

    return evaluationCriteria ? evaluationCriteria.criteria : null;
};

// Function to calculate the applicant's score based on fetched criteria
const calculateScore = async (applicantData, jobRoleId) => {
    const criteria = await fetchEvaluationCriteria(jobRoleId);

    if (!criteria) {
        throw new Error(`No evaluation criteria found for the job role with ID: ${jobRoleId}`);
    }

    let totalScore = 0;
    const breakdown = {
        education: 0,
        certifications: 0,
        experience: 0,
        skills: 0,
        languages: 0,
    };

    console.log("Processing Criteria...");

    criteria.forEach((criterion, index) => {
        const { label, weight, options } = criterion || {};
        console.log(`Processing Criterion ${index + 1}...`);
        console.log(`Label: ${label}`);
        console.log(`Weight: ${weight}`);
        console.log(`Options:`, options);

        if (!options) {
            console.error(`No options found for ${label}. Skipping...`);
            return;
        }

        let criterionScore = 0;

        if (label.toLowerCase() === 'education') {
            const educationLevels = applicantData.education || [];
            let educationPoints = 0;
        
            educationLevels.forEach(education => {
                const level = education.level;
                if (typeof level === 'string') {
                    const normalizedLevel = level.toLowerCase().trim();
                    const matchedOption = options.find(option => option.label.toLowerCase().trim() === normalizedLevel);
                    if (matchedOption) {
                        console.log(`Found ${level} in education. Points: ${matchedOption.points}`);
                        educationPoints += matchedOption.points;
                    } else {
                        console.log(`${level} not found in criteria options.`);
                    }
                } else {
                    console.log(`Skipping non-string education level:`, level);
                }
            });
        
            const maxPoints = options.reduce((acc, option) => acc + option.points, 0);
            console.log(`Total education points: ${educationPoints}`);
            console.log(`Max education points possible: ${maxPoints}`);
        
            if (maxPoints > 0) {
                criterionScore = (educationPoints / maxPoints) * weight;
            }
            breakdown.education = criterionScore;

        } else if (label.toLowerCase() === 'skill') {
            const skills = applicantData.skills || [];
            let skillPoints = 0;
        
            skills.forEach(skillObj => {
                const skill = skillObj.skillDescription;  // Access the skill description
                if (typeof skill === 'string') {
                    const normalizedSkill = skill.toLowerCase().trim();
                    const matchedOption = options.find(option => option.label.toLowerCase().trim() === normalizedSkill);
                    if (matchedOption) {
                        console.log(`Found ${skill} in skills. Points: ${matchedOption.points}`);
                        skillPoints += matchedOption.points;
                    } else {
                        console.log(`${skill} not found in criteria options.`);
                    }
                } else {
                    console.log(`Skipping non-string skill:`, skill);
                }
            });
        
            const maxPoints = options.reduce((acc, option) => acc + option.points, 0);
            console.log(`Total skill points: ${skillPoints}`);
            console.log(`Max skill points possible: ${maxPoints}`);
        
            if (maxPoints > 0) {
                criterionScore = (skillPoints / maxPoints) * weight;
            }
            breakdown.skills = criterionScore;

        } else if (label.toLowerCase() === 'experience') {
            const experiences = applicantData.experience || [];
            let experienceYears = 0;
            let experiencePoints = 0;
        
            // Calculate total years of experience
            experiences.forEach(experience => {
                const startDate = new Date(experience.startDate);
                const endDate = experience.endDate ? new Date(experience.endDate) : new Date();
                const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);  // Convert milliseconds to years
                experienceYears += years;
            });
        
            const totalExperienceYears = Math.floor(experienceYears);
            console.log(`Total experience years: ${totalExperienceYears}`);
        
            // Accumulate points based on all applicable experience ranges
            options.forEach(option => {
                const range = option.label.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);  // Match the range pattern "X-Y years"
                if (range) {
                    const minYears = parseFloat(range[1]);
                    const maxYears = parseFloat(range[3]);
        
                    if (totalExperienceYears >= minYears) {
                        console.log(`Adding points for range ${minYears}-${maxYears}: ${option.points}`);
                        experiencePoints += option.points;
                    }
                }
            });
        
            const maxPoints = options.reduce((acc, option) => acc + option.points, 0);
            console.log(`Total experience points: ${experiencePoints}`);
            console.log(`Max experience points possible: ${maxPoints}`);
        
            if (maxPoints > 0) {
                criterionScore = (experiencePoints / maxPoints) * weight;
            }
            breakdown.experience = criterionScore;

        } else if (label.toLowerCase() === 'certification') {
            const certifications = applicantData.certificate || [];
            let certificationPoints = 0;
        
            certifications.forEach(certificationObj => {
                const certification = certificationObj.certificateName;  // Access the certificate name
                if (typeof certification === 'string') {
                    const normalizedCertification = certification.toLowerCase().trim();
                    
                    // Improved matching logic
                    const matchedOption = options.find(option => {
                        const normalizedOptionLabel = option.label.toLowerCase().trim();
                        return normalizedCertification.includes(normalizedOptionLabel) || 
                               normalizedOptionLabel.includes(normalizedCertification);
                    });
        
                    if (matchedOption) {
                        console.log(`Found ${certification} in certifications. Points: ${matchedOption.points}`);
                        certificationPoints += matchedOption.points;
                    } else {
                        console.log(`${certification} not found in criteria options.`);
                    }
                } else {
                    console.log(`Skipping non-string certification:`, certification);
                }
            });
        
            const maxPoints = options.reduce((acc, option) => acc + option.points, 0);
            console.log(`Total certification points: ${certificationPoints}`);
            console.log(`Max certification points possible: ${maxPoints}`);
        
            if (maxPoints > 0) {
                criterionScore = (certificationPoints / maxPoints) * weight;
            }
            breakdown.certifications = criterionScore;

        } else if (label.toLowerCase() === 'language') {
            const languages = applicantData.languages || [];
            let languagePoints = 0;
        
            languages.forEach(languageObj => {
                const language = languageObj.languageName;  // Adjust based on your data structure
                if (typeof language === 'string') {
                    const normalizedLanguage = language.toLowerCase().trim();
                    const matchedOption = options.find(option => option.label.toLowerCase().trim() === normalizedLanguage);
                    if (matchedOption) {
                        console.log(`Found ${language} in languages. Points: ${matchedOption.points}`);
                        languagePoints += matchedOption.points;
                    } else {
                        console.log(`${language} not found in criteria options.`);
                    }
                } else {
                    console.log(`Skipping non-string language:`, language);
                }
            });
        
            const maxPoints = options.reduce((acc, option) => acc + option.points, 0);
            console.log(`Total language points: ${languagePoints}`);
            console.log(`Max language points possible: ${maxPoints}`);
        
            if (maxPoints > 0) {
                criterionScore = (languagePoints / maxPoints) * weight;
            }
            breakdown.languages = criterionScore;

        }

        console.log(`${label} score: ${criterionScore}`);
        totalScore += criterionScore;
    });

    breakdown.total = totalScore;

    console.log("Final Score Breakdown:", breakdown);

    return breakdown;
};

module.exports = {
    getApplicantData,
    fetchEvaluationCriteria,
    calculateScore
};
