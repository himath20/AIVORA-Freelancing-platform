const { sql } = require('../config/db');

// GET ALL SERVICES
const getAllServices = async (req, res) => {
    try {
        const result = await new sql.Request().query(`
            SELECT
                s.service_id,
                s.service_name,
                s.description,
                s.category_id,
                c.category_name
            FROM dbo.ai_service s
            INNER JOIN dbo.ai_category c
                ON s.category_id = c.category_id
            ORDER BY s.service_id;
        `);

        res.status(200).json({
            total: result.recordset.length,
            services: result.recordset
        });
    } catch (error) {
        console.error('Admin get services error:', error);
        res.status(500).json({
            message: 'Failed to retrieve services.'
        });
    }
};

// GET ONE SERVICE
const getServiceById = async (req, res) => {
    try {
        const serviceId = Number(req.params.serviceId);

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: 'Invalid service ID.'
            });
        }

        const request = new sql.Request();
        request.input('serviceId', sql.Int, serviceId);

        const result = await request.query(`
            SELECT
                s.service_id,
                s.service_name,
                s.description,
                s.category_id,
                c.category_name
            FROM dbo.ai_service s
            INNER JOIN dbo.ai_category c
                ON s.category_id = c.category_id
            WHERE s.service_id = @serviceId;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Service not found.'
            });
        }

        res.status(200).json({
            service: result.recordset[0]
        });
    } catch (error) {
        console.error('Admin get service error:', error);
        res.status(500).json({
            message: 'Failed to retrieve service.'
        });
    }
};

// UPDATE SERVICE
const updateService = async (req, res) => {
    try {
        const serviceId = Number(req.params.serviceId);
        const { service_name, description, category_id } = req.body;

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: 'Invalid service ID.'
            });
        }

        if (
            typeof service_name !== 'string' ||
            !service_name.trim() ||
            service_name.trim().length > 100
        ) {
            return res.status(400).json({
                message: 'Service name is required and must not exceed 100 characters.'
            });
        }

        if (
            description !== null &&
            description !== undefined &&
            (typeof description !== 'string' || description.length > 255)
        ) {
            return res.status(400).json({
                message: 'Description must not exceed 255 characters.'
            });
        }

        const categoryId = Number(category_id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(400).json({
                message: 'A valid category is required.'
            });
        }

        const request = new sql.Request();

        request.input('serviceId', sql.Int, serviceId);
        request.input('serviceName', sql.VarChar(100), service_name.trim());
        request.input('description', sql.VarChar(255), description?.trim() || null);
        request.input('categoryId', sql.Int, categoryId);

        const result = await request.query(`
            UPDATE dbo.ai_service
            SET
                service_name = @serviceName,
                description = @description,
                category_id = @categoryId
            WHERE service_id = @serviceId;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Service not found.'
            });
        }

        res.status(200).json({
            message: 'Service updated successfully.'
        });
    } catch (error) {
        console.error('Admin update service error:', error);

        if (error.number === 547) {
            return res.status(400).json({
                message: 'The selected category does not exist.'
            });
        }

        res.status(500).json({
            message: 'Failed to update service.'
        });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    updateService
};
