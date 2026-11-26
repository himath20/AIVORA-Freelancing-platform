const { sql } = require('../config/db');

// =====================================
// GET ALL SKILLS
// =====================================

const getAllSkills = async (req, res) => {
    try {
        const request = new sql.Request();

        const result = await request.query(`
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

        return res.status(200).json({
            message: 'Skills retrieved successfully!',
            total: result.recordset.length,
            skills: result.recordset
        });

    } catch (error) {
        console.error('Get skills error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve skills.'
        });
    }
};

module.exports = {
    getAllSkills
};