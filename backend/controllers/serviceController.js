const { sql } = require('../config/db');

// =====================================
// GET ALL AI SERVICES
// =====================================

const getAllServices = async (req, res) => {
    try {
        const request = new sql.Request();

        const result = await request.query(`
            SELECT
                service_id,
                category_id,
                service_name,
                description
            FROM dbo.ai_service
            ORDER BY service_id;
        `);

        return res.status(200).json({
            message: 'AI services retrieved successfully!',
            total: result.recordset.length,
            services: result.recordset
        });

    } catch (error) {
        console.error('Get AI services error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve AI services.'
        });
    }
};

module.exports = {
    getAllServices
};