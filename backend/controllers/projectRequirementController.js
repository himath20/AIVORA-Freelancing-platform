const { sql } = require('../config/db');

// Add project requirement
const addProjectRequirement = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const projectId = Number(req.params.projectId);
        const { req_type, details } = req.body;

        if (!req_type || !details) {
            return res.status(400).json({
                message: 'Please provide requirement type and details.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('clientId', sql.Int, clientId);
        request.input('reqType', sql.VarChar(50), req_type);
        request.input('details', sql.VarChar(sql.MAX), details);

        await request.query(`
            IF NOT EXISTS (
                SELECT 1 FROM dbo.project
                WHERE project_id = @projectId
                AND client_id = @clientId
            )
                THROW 50001, 'Project not found.', 1;

            INSERT INTO dbo.project_requirement
            (project_id, req_type, details)
            VALUES (@projectId, @reqType, @details);
        `);

        return res.status(201).json({
            message: 'Project requirement added successfully!'
        });

    } catch (error) {
        console.error('Add requirement error:', error);

        return res.status(500).json({
            message: 'Failed to add project requirement.'
        });
    }
};

// Get project requirements
const getProjectRequirements = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const projectId = Number(req.params.projectId);

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('clientId', sql.Int, clientId);

        const result = await request.query(`
            SELECT
                pr.requirement_id,
                pr.project_id,
                pr.req_type,
                pr.details
            FROM dbo.project_requirement pr
            INNER JOIN dbo.project p
                ON pr.project_id = p.project_id
            WHERE pr.project_id = @projectId
              AND p.client_id = @clientId
        `);

        return res.status(200).json({
            message: 'Project requirements retrieved successfully!',
            requirements: result.recordset
        });

    } catch (error) {
        console.error('Get requirements error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve project requirements.'
        });
    }
};

module.exports = {
    addProjectRequirement,
    getProjectRequirements
};