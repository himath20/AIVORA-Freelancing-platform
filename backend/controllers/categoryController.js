const { sql } = require('../config/db');

// =====================================
// GET ALL AI CATEGORIES
// =====================================

const getAllCategories = async (req, res) => {
    try {
        const request = new sql.Request();

        const result = await request.query(`
            SELECT
                category_id,
                category_name,
                description
            FROM dbo.ai_category
            ORDER BY category_id;
        `);

        return res.status(200).json({
            message: 'AI categories retrieved successfully!',
            total: result.recordset.length,
            categories: result.recordset
        });

    } catch (error) {
        console.error('Get AI categories error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve AI categories.'
        });
    }
};

module.exports = {
    getAllCategories
};