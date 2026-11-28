const { sql } = require('../config/db');

// GET ALL SKILLS
const getAllSkills = async (req, res) => {
    try {
        const result = await new sql.Request().query(`
            SELECT
                s.skill_id,
                s.skill_name,
                s.category_id,
                c.category_name
            FROM dbo.skill s
            INNER JOIN dbo.ai_category c
                ON s.category_id = c.category_id
            ORDER BY s.skill_id;
        `);

        res.status(200).json({
            total: result.recordset.length,
            skills: result.recordset
        });
    } catch (error) {
        console.error('Admin get skills error:', error);
        res.status(500).json({
            message: 'Failed to retrieve skills.'
        });
    }
};

// GET ONE SKILL
const getSkillById = async (req, res) => {
    try {
        const skillId = Number(req.params.skillId);

        if (!Number.isInteger(skillId) || skillId <= 0) {
            return res.status(400).json({
                message: 'Invalid skill ID.'
            });
        }

        const request = new sql.Request();
        request.input('skillId', sql.Int, skillId);

        const result = await request.query(`
            SELECT
                s.skill_id,
                s.skill_name,
                s.category_id,
                c.category_name
            FROM dbo.skill s
            INNER JOIN dbo.ai_category c
                ON s.category_id = c.category_id
            WHERE s.skill_id = @skillId;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Skill not found.'
            });
        }

        res.status(200).json({
            skill: result.recordset[0]
        });
    } catch (error) {
        console.error('Admin get skill error:', error);
        res.status(500).json({
            message: 'Failed to retrieve skill.'
        });
    }
};

// UPDATE SKILL
const updateSkill = async (req, res) => {
    try {
        const skillId = Number(req.params.skillId);
        const { skill_name, category_id } = req.body;

        if (!Number.isInteger(skillId) || skillId <= 0) {
            return res.status(400).json({
                message: 'Invalid skill ID.'
            });
        }

        if (
            typeof skill_name !== 'string' ||
            !skill_name.trim() ||
            skill_name.trim().length > 80
        ) {
            return res.status(400).json({
                message: 'Skill name is required and must not exceed 80 characters.'
            });
        }

        const categoryId = Number(category_id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(400).json({
                message: 'A valid category is required.'
            });
        }

        const request = new sql.Request();

        request.input('skillId', sql.Int, skillId);
        request.input('skillName', sql.VarChar(80), skill_name.trim());
        request.input('categoryId', sql.Int, categoryId);

        const result = await request.query(`
            UPDATE dbo.skill
            SET
                skill_name = @skillName,
                category_id = @categoryId
            WHERE skill_id = @skillId;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Skill not found.'
            });
        }

        res.status(200).json({
            message: 'Skill updated successfully.'
        });
    } catch (error) {
        console.error('Admin update skill error:', error);

        if (error.number === 547) {
            return res.status(400).json({
                message: 'The selected category does not exist.'
            });
        }

        res.status(500).json({
            message: 'Failed to update skill.'
        });
    }
};

module.exports = {
    getAllSkills,
    getSkillById,
    updateSkill
};
