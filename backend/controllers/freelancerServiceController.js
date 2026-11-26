const { sql } = require('../config/db');

// Add freelancer service
const addFreelancerService = async (req, res) => {
    try {
        const freelancerId = req.user.userId;
        const { service_id, price, delivery_days } = req.body;

        if (!service_id || !price || !delivery_days) {
            return res.status(400).json({
                message: 'Please provide all required fields.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);
        request.input('serviceId', sql.Int, service_id);
       request.input('basePrice', sql.Decimal(8, 2), price);
        request.input('deliveryDays', sql.Int, delivery_days);

        await request.query(`
            INSERT INTO dbo.freelancer_service
            (freelancer_id, service_id, base_price, delivery_days)
            VALUES
            (@freelancerId, @serviceId, @basePrice, @deliveryDays)
        `);

        return res.status(201).json({
            message: 'Service added successfully!'
        });

    } catch (error) {
        console.error('Add freelancer service error:', error);

        return res.status(500).json({
            message: 'Failed to add service.'
        });
    }
};

// Get freelancer services
const getFreelancerServices = async (req, res) => {
    try {
        const freelancerId = req.user.userId;

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);

        const result = await request.query(`
            SELECT fs.*, s.service_name
            FROM dbo.freelancer_service fs
            INNER JOIN dbo.ai_service s
                ON fs.service_id = s.service_id
            WHERE fs.freelancer_id = @freelancerId
        `);

        return res.status(200).json({
            message: 'Freelancer services retrieved successfully!',
            total: result.recordset.length,
            services: result.recordset
        });

    } catch (error) {
        console.error('Get freelancer services error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve services.'
        });
    }
};
// Remove freelancer service
const removeFreelancerService = async (req, res) => {
    try {
        const freelancerId = req.user.userId;
        const serviceId = Number(req.params.serviceId);

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: 'Please provide a valid service ID.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);
        request.input('serviceId', sql.Int, serviceId);

        const result = await request.query(`
            DELETE FROM dbo.freelancer_service
            WHERE freelancer_id = @freelancerId
              AND service_id = @serviceId;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Service not found in your profile.'
            });
        }

        return res.status(200).json({
            message: 'Service removed successfully!'
        });

    } catch (error) {
        console.error('Remove freelancer service error:', error);

        return res.status(500).json({
            message: 'Failed to remove service.'
        });
    }
};

module.exports = {
    addFreelancerService,
    getFreelancerServices,
    removeFreelancerService
};