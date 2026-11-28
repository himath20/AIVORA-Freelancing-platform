const { sql } = require('../config/db');

// Valid project statuses
const ALLOWED_STATUSES = [
    'OPEN',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED'
];


// Get all projects
const getAllProjects = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const result = await new sql.Request().query(`
            SELECT
                p.project_id,
                p.client_id,
                p.service_id,
                p.title,
                p.description,
                p.budget_min,
                p.budget_max,
                p.deadline,
                p.status,
                p.posted_date,
                p.completed_date,
                c.org_name,
                c.contact_person,
                c.email AS client_email,
                s.service_name
            FROM dbo.project p
            INNER JOIN dbo.client c
                ON p.client_id = c.client_id
            LEFT JOIN dbo.ai_service s
                ON p.service_id = s.service_id
            ORDER BY p.project_id DESC
        `);

        return res.status(200).json({
            projects: result.recordset
        });

    } catch (error) {
        console.error('Get projects error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve projects.'
        });
    }
};


// Get one project by ID
const getProjectById = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const projectId = Number(req.params.projectId);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: 'Invalid project ID.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);

        const result = await request.query(`
            SELECT
                p.project_id,
                p.client_id,
                p.service_id,
                p.title,
                p.description,
                p.budget_min,
                p.budget_max,
                p.deadline,
                p.status,
                p.posted_date,
                p.completed_date,
                c.org_name,
                c.contact_person,
                c.email AS client_email,
                c.phone AS client_phone,
                s.service_name
            FROM dbo.project p
            INNER JOIN dbo.client c
                ON p.client_id = c.client_id
            LEFT JOIN dbo.ai_service s
                ON p.service_id = s.service_id
            WHERE p.project_id = @projectId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found.'
            });
        }

        return res.status(200).json({
            project: result.recordset[0]
        });

    } catch (error) {
        console.error('Get project details error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve project details.'
        });
    }
};


// Update project status
const updateProjectStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        const projectId = Number(req.params.projectId);
        const { status } = req.body;

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: 'Invalid project ID.'
            });
        }

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                message: 'Invalid project status.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('status', sql.VarChar(12), status);

        const result = await request.query(`
            UPDATE dbo.project
            SET
                status = @status,
                completed_date = CASE
                    WHEN @status = 'COMPLETED'
                        THEN CAST(GETDATE() AS DATE)
                    ELSE completed_date
                END
            OUTPUT
                INSERTED.status,
                INSERTED.completed_date
            WHERE project_id = @projectId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Project not found.'
            });
        }

        return res.status(200).json({
            message: 'Project status updated successfully.',
            status: result.recordset[0].status,
            completed_date: result.recordset[0].completed_date
        });

    } catch (error) {
        console.error('Update project status error:', error);

        return res.status(500).json({
            message: 'Failed to update project status.'
        });
    }
};


module.exports = {
    getAllProjects,
    getProjectById,
    updateProjectStatus
};