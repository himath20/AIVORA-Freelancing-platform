const { sql } = require('../config/db');

// =====================================
// GET ALL COMPLAINTS (ADMIN ONLY)
// =====================================

const getAllComplaints = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin access required.'
            });
        }

        const result = await sql.query(`
            SELECT
                c.complaint_id,
                c.project_id,
                p.title AS project_title,
                c.raised_by,
                c.description,
                c.status,
                c.handled_by,
                c.resolution,
                c.created_at,
                c.resolved_at
            FROM dbo.complaint c
            INNER JOIN dbo.project p
                ON c.project_id = p.project_id
            ORDER BY c.created_at DESC
        `);

        return res.status(200).json({
            complaints: result.recordset
        });

    } catch (error) {
        console.error('Get all complaints error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve complaints.'
        });
    }
};


// =====================================
// UPDATE COMPLAINT (ADMIN ONLY)
// =====================================

const updateComplaint = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin access required.'
            });
        }

        const { complaintId } = req.params;
        const { status, resolution } = req.body;

        const allowedStatuses = [
            'OPEN',
            'UNDER_REVIEW',
            'RESOLVED',
            'REJECTED'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid complaint status.'
            });
        }

        if (
            (status === 'RESOLVED' || status === 'REJECTED') &&
            (!resolution || resolution.trim().length === 0)
        ) {
            return res.status(400).json({
                message: 'A resolution is required.'
            });
        }

        const request = new sql.Request();

        request.input(
            'complaint_id',
            sql.Int,
            parseInt(complaintId)
        );

        request.input(
            'status',
            sql.VarChar(12),
            status
        );

        request.input(
            'resolution',
            sql.VarChar(1000),
            resolution || null
        );

        request.input(
            'handled_by',
            sql.Int,
            req.user.userId
        );

        const result = await request.query(`
            UPDATE dbo.complaint
            SET
                status = @status,
                resolution = @resolution,
                handled_by = @handled_by,
                resolved_at = CASE
                    WHEN @status IN ('RESOLVED', 'REJECTED')
                    THEN GETDATE()
                    ELSE NULL
                END
            WHERE complaint_id = @complaint_id;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Complaint not found.'
            });
        }

        return res.status(200).json({
            message: 'Complaint updated successfully!'
        });

    } catch (error) {
        console.error('Update complaint error:', error);

        return res.status(500).json({
            message: 'Failed to update complaint.'
        });
    }
};


// =====================================
// EXPORT FUNCTIONS
// =====================================

module.exports = {
    getAllComplaints,
    updateComplaint
};