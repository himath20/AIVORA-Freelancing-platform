
const { sql } = require('../config/db');

// =====================================
// CREATE PROJECT
// =====================================

const createProject = async (req, res) => {
    try {
        const clientId = req.user.userId;

        const {
            service_id,
            title,
            description,
            budget_min,
            budget_max,
            deadline
        } = req.body;

        if (!service_id || !title || !description ||
            budget_min == null || budget_max == null || !deadline) {
            return res.status(400).json({
                message: 'Please provide all required fields.'
            });
        }

        const request = new sql.Request();

        request.input('clientId', sql.Int, clientId);
        request.input('serviceId', sql.Int, service_id);
        request.input('title', sql.VarChar(150), title);
        request.input('description', sql.VarChar(sql.MAX), description);
        request.input('budgetMin', sql.Decimal(10, 2), budget_min);
        request.input('budgetMax', sql.Decimal(10, 2), budget_max);
        request.input('deadline', sql.Date, deadline);

        const result = await request.query(`
            INSERT INTO dbo.project
            (client_id, service_id, title, description,
             budget_min, budget_max, deadline, status, posted_date)
            OUTPUT INSERTED.project_id
            VALUES
            (@clientId, @serviceId, @title, @description,
             @budgetMin, @budgetMax, @deadline, 'OPEN', GETDATE())
        `);

        return res.status(201).json({
            message: 'Project created successfully!',
            project_id: result.recordset[0].project_id
        });

    } catch (error) {
        console.error('Create project error:', error);

        return res.status(500).json({
            message: 'Failed to create project.'
        });
    }
};


// =====================================
// GET CLIENT PROJECTS
// =====================================

const getClientProjects = async (req, res) => {
    try {
        const clientId = req.user.userId;

        const request = new sql.Request();
        request.input('clientId', sql.Int, clientId);

        const result = await request.query(`
            SELECT *
            FROM dbo.project
            WHERE client_id = @clientId
            ORDER BY posted_date DESC
        `);

        return res.status(200).json({
            message: 'Projects retrieved successfully!',
            total: result.recordset.length,
            projects: result.recordset
        });

    } catch (error) {
        console.error('Get projects error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve projects.'
        });
    }
};


// =====================================
// UPDATE PROJECT
// =====================================

const updateProject = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const projectId = Number(req.params.projectId);

        const {
            title,
            description,
            budget_min,
            budget_max,
            deadline
        } = req.body;

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: 'Invalid project ID.'
            });
        }

        if (!title || !description ||
            budget_min == null || budget_max == null || !deadline) {
            return res.status(400).json({
                message: 'Please provide all required fields.'
            });
        }

        const request = new sql.Request();

        request.input('clientId', sql.Int, clientId);
        request.input('projectId', sql.Int, projectId);
        request.input('title', sql.VarChar(150), title);
        request.input('description', sql.VarChar(sql.MAX), description);
        request.input('budgetMin', sql.Decimal(10, 2), budget_min);
        request.input('budgetMax', sql.Decimal(10, 2), budget_max);
        request.input('deadline', sql.Date, deadline);

        const result = await request.query(`
            UPDATE dbo.project
            SET title = @title,
                description = @description,
                budget_min = @budgetMin,
                budget_max = @budgetMax,
                deadline = @deadline
            WHERE project_id = @projectId
              AND client_id = @clientId;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Project not found.'
            });
        }

        return res.status(200).json({
            message: 'Project updated successfully!'
        });

    } catch (error) {
        console.error('Update project error:', error);

        return res.status(500).json({
            message: 'Failed to update project.'
        });
    }
};


// =====================================
// EXPORT FUNCTIONS
// =====================================

module.exports = {
    createProject,
    getClientProjects,
    updateProject
};
