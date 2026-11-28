const { sql } = require('../config/db');

// =====================================
// ACCEPT PROPOSAL AND ASSIGN PROJECT
// =====================================

const acceptProposal = async (req, res) => {
    const transaction = new sql.Transaction();

    try {
        const clientId = req.user.userId;
        const proposalId = Number(req.params.proposalId);

        await transaction.begin();

        const request = new sql.Request(transaction);

        request.input('proposalId', sql.Int, proposalId);
        request.input('clientId', sql.Int, clientId);

        const result = await request.query(`
            SELECT
                p.proposal_id,
                p.project_id,
                p.freelancer_id,
                p.bid_amount,
                p.estimated_days
            FROM dbo.proposal p
            INNER JOIN dbo.project pr
                ON p.project_id = pr.project_id
            WHERE p.proposal_id = @proposalId
              AND pr.client_id = @clientId
              AND p.status = 'SUBMITTED'
              AND pr.status = 'OPEN'
        `);

        if (result.recordset.length === 0) {
            await transaction.rollback();

            return res.status(404).json({
                message: 'Proposal not found or project cannot be assigned.'
            });
        }

        const proposal = result.recordset[0];

        const insertRequest = new sql.Request(transaction);

        insertRequest.input('projectId', sql.Int, proposal.project_id);
        insertRequest.input('proposalId', sql.Int, proposal.proposal_id);
        insertRequest.input('freelancerId', sql.Int, proposal.freelancer_id);
        insertRequest.input('agreedAmount', sql.Decimal(10, 2), proposal.bid_amount);
        insertRequest.input('estimatedDays', sql.Int, proposal.estimated_days);

        await insertRequest.query(`
            INSERT INTO dbo.project_assignment
            (
                project_id,
                proposal_id,
                freelancer_id,
                agreed_amount,
                start_date,
                progress_pct,
                status
            )
            VALUES
            (
                @projectId,
                @proposalId,
                @freelancerId,
                @agreedAmount,
                CAST(GETDATE() AS DATE),
                0,
                'ACTIVE'
            );

            UPDATE dbo.proposal
            SET status = 'ACCEPTED'
            WHERE proposal_id = @proposalId;

            UPDATE dbo.proposal
            SET status = 'REJECTED'
            WHERE project_id = @projectId
              AND proposal_id <> @proposalId
              AND status = 'SUBMITTED';

            UPDATE dbo.project
            SET status = 'IN_PROGRESS'
            WHERE project_id = @projectId;
        `);

        await transaction.commit();

        return res.status(200).json({
            message: 'Proposal accepted and project assigned successfully!'
        });

    } catch (error) {
        if (transaction._aborted !== true) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error('Rollback error:', rollbackError.message);
            }
        }

        console.error('Accept proposal error:', error);

        return res.status(500).json({
            message: 'Failed to assign project.'
        });
    }
};
// =====================================
// GET FREELANCER ASSIGNMENTS
// =====================================

const getFreelancerAssignments = async (req, res) => {
    try {
        const freelancerId = req.user.userId;

        if (req.user.role !== 'freelancer') {
            return res.status(403).json({
                message: 'Only freelancers can view their assignments.'
            });
        }

        const request = new sql.Request();

        request.input('freelancerId', sql.Int, freelancerId);

        const result = await request.query(`
            SELECT
                pa.assignment_id,
                pa.project_id,
                pa.agreed_amount,
                pa.start_date,
                pa.end_date,
                pa.progress_pct,
                pa.status,
                pr.title AS project_title,
                pr.description,
                pr.deadline,
                c.contact_person AS client_name
            FROM dbo.project_assignment pa
            INNER JOIN dbo.project pr
                ON pa.project_id = pr.project_id
            INNER JOIN dbo.client c
                ON pr.client_id = c.client_id
            WHERE pa.freelancer_id = @freelancerId
            ORDER BY pa.start_date DESC
        `);

        return res.status(200).json({
            message: 'Freelancer assignments retrieved successfully!',
            total: result.recordset.length,
            assignments: result.recordset
        });

    } catch (error) {
        console.error('Get freelancer assignments error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve freelancer assignments.'
        });
    }
};
module.exports = {
    acceptProposal,
    getFreelancerAssignments
};