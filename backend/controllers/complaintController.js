const { sql } = require('../config/db');

// =====================================
// CREATE COMPLAINT
// =====================================

const createComplaint = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { projectId } = req.params;
        const { description } = req.body;

        if (!['client', 'freelancer'].includes(role)) {
            return res.status(403).json({
                message: 'Only clients and freelancers can raise complaints.'
            });
        }

        if (!description || description.trim().length === 0) {
            return res.status(400).json({
                message: 'Complaint description is required.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('userId', sql.Int, userId);
        request.input('role', sql.VarChar(10), role.toUpperCase());
        request.input('description', sql.VarChar(1000), description.trim());

        const result = await request.query(`
            INSERT INTO dbo.complaint
            (
                project_id,
                raised_by,
                description,
                status,
                created_at
            )
            OUTPUT INSERTED.complaint_id
            SELECT
                @projectId,
                @role,
                @description,
                'OPEN',
                GETDATE()
            WHERE EXISTS (
                SELECT 1
                FROM dbo.project p
                WHERE p.project_id = @projectId
                AND (
                    (@role = 'CLIENT' AND p.client_id = @userId)
                    OR
                    (@role = 'FREELANCER' AND EXISTS (
                        SELECT 1
                        FROM dbo.project_assignment pa
                        WHERE pa.project_id = p.project_id
                        AND pa.freelancer_id = @userId
                    ))
                )
            );
        `);

        if (result.recordset.length === 0) {
            return res.status(403).json({
                message: 'Project not found or you are not authorized to complain about it.'
            });
        }

        res.status(201).json({
            message: 'Complaint submitted successfully!',
            complaint_id: result.recordset[0].complaint_id
        });

    } catch (error) {
        console.error('Create complaint error:', error);

        res.status(500).json({
            message: 'Failed to submit complaint.'
        });
    }
};
// =====================================
// GET USER COMPLAINTS
// =====================================

const getComplaints = async (req, res) => {
    try {
        const { userId, role } = req.user;

        const request = new sql.Request();

        request.input('userId', sql.Int, userId);
        request.input('role', sql.VarChar(10), role.toUpperCase());

        const result = await request.query(`
            SELECT
                complaint_id,
                project_id,
                raised_by,
                description,
                status,
                resolution,
                created_at,
                resolved_at
            FROM dbo.complaint
            WHERE raised_by = @role
            AND (
                (@role = 'CLIENT' AND project_id IN (
                    SELECT project_id
                    FROM dbo.project
                    WHERE client_id = @userId
                ))
                OR
                (@role = 'FREELANCER' AND project_id IN (
                    SELECT project_id
                    FROM dbo.project_assignment
                    WHERE freelancer_id = @userId
                ))
            )
            ORDER BY created_at DESC
        `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error('Get complaints error:', error);

        res.status(500).json({
            message: 'Failed to retrieve complaints.'
        });
    }
};
module.exports = {
    createComplaint,
    getComplaints
};