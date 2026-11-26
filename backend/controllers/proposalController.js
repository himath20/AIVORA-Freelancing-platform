const { sql } = require('../config/db');

// =====================================
// SUBMIT PROPOSAL
// =====================================

const submitProposal = async (req, res) => {
    try {
        const freelancerId = req.user.userId;
        const projectId = Number(req.params.projectId);

        const {
            cover_letter,
            bid_amount,
            estimated_days
        } = req.body;

        if (!cover_letter || !bid_amount || !estimated_days) {
            return res.status(400).json({
                message: 'Please provide all proposal details.'
            });
        }

        if (Number(bid_amount) <= 0 || Number(estimated_days) <= 0) {
            return res.status(400).json({
                message: 'Bid amount and estimated days must be positive.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('freelancerId', sql.Int, freelancerId);
        request.input('coverLetter', sql.VarChar(sql.MAX), cover_letter);
        request.input('bidAmount', sql.Decimal(10, 2), bid_amount);
        request.input('estimatedDays', sql.SmallInt, estimated_days);

        await request.query(`
            INSERT INTO dbo.proposal
            (
                project_id,
                freelancer_id,
                cover_letter,
                bid_amount,
                estimated_days,
                status,
                submitted_at
            )
            VALUES
            (
                @projectId,
                @freelancerId,
                @coverLetter,
                @bidAmount,
                @estimatedDays,
                'SUBMITTED',
                GETDATE()
            )
        `);

        return res.status(201).json({
            message: 'Proposal submitted successfully!'
        });

    } catch (error) {
        console.error('Submit proposal error:', error);

        return res.status(500).json({
            message: 'Failed to submit proposal.'
        });
    }
};
// =====================================
// GET PROJECT PROPOSALS (CLIENT)
// =====================================

const getProjectProposals = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const projectId = Number(req.params.projectId);

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('clientId', sql.Int, clientId);

        const result = await request.query(`
            SELECT
                p.proposal_id,
                p.project_id,
                p.freelancer_id,
                f.full_name,
                f.email,
                p.cover_letter,
                p.bid_amount,
                p.estimated_days,
                p.status,
                p.submitted_at
            FROM dbo.proposal p
            INNER JOIN dbo.freelancer f
                ON p.freelancer_id = f.freelancer_id
            INNER JOIN dbo.project pr
                ON p.project_id = pr.project_id
            WHERE p.project_id = @projectId
              AND pr.client_id = @clientId
            ORDER BY p.submitted_at DESC
        `);

        return res.status(200).json({
            message: 'Project proposals retrieved successfully!',
            proposals: result.recordset
        });

    } catch (error) {
        console.error('Get project proposals error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve project proposals.'
        });
    }
};
module.exports = {
    submitProposal,
    getProjectProposals
};