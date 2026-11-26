
const { sql } = require('../config/db');

// =====================================
// ADD FREELANCER SKILL
// =====================================

const addFreelancerSkill = async (req, res) => {
    try {
        const freelancerId = req.user.userId;

        const {
            skill_id,
            proficiency,
            years_experience
        } = req.body;

        if (!skill_id || !Number.isInteger(Number(skill_id))) {
            return res.status(400).json({
                message: 'Please provide a valid skill ID.'
            });
        }

        const allowedProficiency = [
            'BEGINNER',
            'INTERMEDIATE',
            'EXPERT'
        ];

        const selectedProficiency = proficiency || 'INTERMEDIATE';

        if (!allowedProficiency.includes(selectedProficiency)) {
            return res.status(400).json({
                message: 'Invalid proficiency level.'
            });
        }

        const experience = years_experience ?? 0;

        if (
            !Number.isInteger(experience) ||
            experience < 0 ||
            experience > 255
        ) {
            return res.status(400).json({
                message: 'Years of experience must be between 0 and 255.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);
        request.input('skillId', sql.Int, Number(skill_id));
        request.input('proficiency', sql.VarChar(12), selectedProficiency);
        request.input('experience', sql.TinyInt, experience);

        await request.query(`
            INSERT INTO dbo.freelancer_skill
                (freelancer_id, skill_id, proficiency, years_experience)
            VALUES
                (@freelancerId, @skillId, @proficiency, @experience);
        `);

        return res.status(201).json({
            message: 'Skill added to freelancer profile successfully!'
        });

    } catch (error) {
        console.error('Add freelancer skill error:', error);

        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This skill is already added to your profile.'
            });
        }

        if (error.number === 547) {
            return res.status(400).json({
                message: 'Invalid freelancer ID or skill ID.'
            });
        }

        return res.status(500).json({
            message: 'Failed to add skill.'
        });
    }
};


// =====================================
// GET FREELANCER SKILLS
// =====================================

const getFreelancerSkills = async (req, res) => {
    try {
        const freelancerId = req.user.userId;

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);

        const result = await request.query(`
            SELECT
                fs.freelancer_id,
                fs.skill_id,
                s.skill_name,
                s.category_id,
                c.category_name,
                fs.proficiency,
                fs.years_experience
            FROM dbo.freelancer_skill fs
            INNER JOIN dbo.skill s
                ON fs.skill_id = s.skill_id
            INNER JOIN dbo.ai_category c
                ON s.category_id = c.category_id
            WHERE fs.freelancer_id = @freelancerId
            ORDER BY fs.skill_id;
        `);

        return res.status(200).json({
            message: 'Freelancer skills retrieved successfully!',
            total: result.recordset.length,
            skills: result.recordset
        });

    } catch (error) {
        console.error('Get freelancer skills error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve freelancer skills.'
        });
    }
};


// =====================================
// REMOVE FREELANCER SKILL
// =====================================

const removeFreelancerSkill = async (req, res) => {
    try {
        const freelancerId = req.user.userId;
        const skillId = Number(req.params.skillId);

        if (!Number.isInteger(skillId) || skillId <= 0) {
            return res.status(400).json({
                message: 'Please provide a valid skill ID.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);
        request.input('skillId', sql.Int, skillId);

        const result = await request.query(`
            DELETE FROM dbo.freelancer_skill
            WHERE freelancer_id = @freelancerId
              AND skill_id = @skillId;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Skill not found in your profile.'
            });
        }

        return res.status(200).json({
            message: 'Skill removed from freelancer profile successfully!'
        });

    } catch (error) {
        console.error('Remove freelancer skill error:', error);

        return res.status(500).json({
            message: 'Failed to remove skill.'
        });
    }
};


// =====================================
// EXPORT FUNCTIONS
// =====================================

module.exports = {
    addFreelancerSkill,
    getFreelancerSkills,
    removeFreelancerSkill
};
