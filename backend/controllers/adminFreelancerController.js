const { sql } = require('../config/db');

// Get all freelancers
const getAllFreelancers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const result = await new sql.Request().query(`
            SELECT
                freelancer_id,
                full_name,
                email,
                phone,
                country,
                bio,
                hourly_rate,
                avg_rating,
                account_status,
                joined_date
            FROM dbo.freelancer
            ORDER BY freelancer_id DESC
        `);

        return res.status(200).json({
            freelancers: result.recordset
        });

    } catch (error) {
        console.error('Get freelancers error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve freelancers.'
        });
    }
};


// Get one freelancer by ID
const getFreelancerById = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const freelancerId = Number(req.params.freelancerId);

        if (!Number.isInteger(freelancerId) || freelancerId <= 0) {
            return res.status(400).json({
                message: 'Invalid freelancer ID.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);

        const result = await request.query(`
            SELECT
                freelancer_id,
                full_name,
                email,
                phone,
                country,
                bio,
                hourly_rate,
                avg_rating,
                account_status,
                joined_date
            FROM dbo.freelancer
            WHERE freelancer_id = @freelancerId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Freelancer not found.'
            });
        }

        return res.status(200).json({
            freelancer: result.recordset[0]
        });

    } catch (error) {
        console.error('Get freelancer details error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve freelancer details.'
        });
    }
};


// Update freelancer account status
const updateFreelancerStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const freelancerId = Number(req.params.freelancerId);
        const { account_status } = req.body;

        if (!Number.isInteger(freelancerId) || freelancerId <= 0) {
            return res.status(400).json({
                message: 'Invalid freelancer ID.'
            });
        }

        const allowedStatuses = [
            'ACTIVE',
            'SUSPENDED',
            'CLOSED'
        ];

        if (!allowedStatuses.includes(account_status)) {
            return res.status(400).json({
                message: 'Invalid account status. Allowed values are ACTIVE, SUSPENDED, or CLOSED.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);
        request.input('accountStatus', sql.VarChar(20), account_status);

        const result = await request.query(`
            UPDATE dbo.freelancer
            SET account_status = @accountStatus
            OUTPUT INSERTED.account_status
            WHERE freelancer_id = @freelancerId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Freelancer not found.'
            });
        }

        return res.status(200).json({
            message: 'Freelancer account status updated successfully.',
            account_status: result.recordset[0].account_status
        });

    } catch (error) {
        console.error('Update freelancer status error:', error);

        return res.status(500).json({
            message: 'Failed to update freelancer account status.'
        });
    }
};


module.exports = {
    getAllFreelancers,
    getFreelancerById,
    updateFreelancerStatus
};
