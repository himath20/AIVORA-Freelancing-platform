const { sql } = require('../config/db');

// Get all clients
const getAllClients = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const result = await new sql.Request().query(`
            SELECT
                client_id,
                org_name,
                contact_person,
                email,
                phone,
                country,
                client_type,
                avg_rating,
                account_status,
                joined_date
            FROM dbo.client
            ORDER BY client_id DESC
        `);

        return res.status(200).json({
            clients: result.recordset
        });

    } catch (error) {
        console.error('Get clients error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve clients.'
        });
    }
};


// Get one client by ID
const getClientById = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const clientId = Number(req.params.clientId);

        if (!Number.isInteger(clientId) || clientId <= 0) {
            return res.status(400).json({
                message: 'Invalid client ID.'
            });
        }

        const request = new sql.Request();
        request.input('clientId', sql.Int, clientId);

        const result = await request.query(`
            SELECT
                client_id,
                org_name,
                contact_person,
                email,
                phone,
                country,
                client_type,
                avg_rating,
                account_status,
                joined_date
            FROM dbo.client
            WHERE client_id = @clientId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Client not found.'
            });
        }

        return res.status(200).json({
            client: result.recordset[0]
        });

    } catch (error) {
        console.error('Get client details error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve client details.'
        });
    }
};


// Update client account status
const updateClientStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const clientId = Number(req.params.clientId);
        const { account_status } = req.body;

        if (!Number.isInteger(clientId) || clientId <= 0) {
            return res.status(400).json({
                message: 'Invalid client ID.'
            });
        }

        const allowedStatuses = [
            'ACTIVE',
            'SUSPENDED',
            'CLOSED'
        ];

        if (!allowedStatuses.includes(account_status)) {
            return res.status(400).json({
                message: 'Invalid account status.'
            });
        }

        const request = new sql.Request();
        request.input('clientId', sql.Int, clientId);
        request.input('accountStatus', sql.VarChar(20), account_status);

        const result = await request.query(`
            UPDATE dbo.client
            SET account_status = @accountStatus
            OUTPUT INSERTED.account_status
            WHERE client_id = @clientId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Client not found.'
            });
        }

        return res.status(200).json({
            message: 'Client account status updated successfully.',
            account_status: result.recordset[0].account_status
        });

    } catch (error) {
        console.error('Update client status error:', error);

        return res.status(500).json({
            message: 'Failed to update client account status.'
        });
    }
};


module.exports = {
    getAllClients,
    getClientById,
    updateClientStatus
};
