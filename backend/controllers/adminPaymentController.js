const { sql } = require('../config/db');

// GET ALL PAYMENTS (ADMIN)
const getAllPayments = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin access required.'
            });
        }

        const result = await new sql.Request().query(`
            SELECT
                pay.payment_id,
                pay.assignment_id,
                pay.amount,
                pay.platform_fee,
                pay.payment_method,
                pay.payment_type,
                pay.status,
                pay.payment_date,
                p.project_id,
                p.title AS project_title,
                c.client_id,
                c.org_name AS client_name,
                f.freelancer_id,
                f.full_name AS freelancer_name
            FROM dbo.payment pay
            INNER JOIN dbo.project_assignment pa
                ON pay.assignment_id = pa.assignment_id
            INNER JOIN dbo.project p
                ON pa.project_id = p.project_id
            INNER JOIN dbo.client c
                ON p.client_id = c.client_id
            INNER JOIN dbo.freelancer f
                ON pa.freelancer_id = f.freelancer_id
            ORDER BY pay.payment_date DESC, pay.payment_id DESC;
        `);

        return res.status(200).json({
            message: 'Payments retrieved successfully.',
            total: result.recordset.length,
            payments: result.recordset
        });

    } catch (error) {
        console.error('Admin get payments error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve payments.'
        });
    }
};

module.exports = { getAllPayments };