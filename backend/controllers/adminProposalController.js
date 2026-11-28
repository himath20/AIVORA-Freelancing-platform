const { sql } = require('../config/db');

const ALLOWED_STATUSES = [
    'SUBMITTED',
    'SHORTLISTED',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN'
];

const getAllProposals = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const result = await new sql.Request().query(`
            SELECT
                p.proposal_id,
                p.project_id,
                p.freelancer_id,
                p.bid_amount,
                p.estimated_days,
                p.status,
                p.submitted_at,
                pr.title AS project_title,
                f.full_name AS freelancer_name,
                f.email AS freelancer_email
            FROM dbo.proposal p
            INNER JOIN dbo.project pr ON p.project_id = pr.project_id
            INNER JOIN dbo.freelancer f ON p.freelancer_id = f.freelancer_id
            ORDER BY p.submitted_at DESC
        `);

        return res.status(200).json({ proposals: result.recordset });
    } catch (error) {
        console.error('Get proposals error:', error);
        return res.status(500).json({ message: 'Unable to retrieve proposals.' });
    }
};

const getProposalById = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const proposalId = Number(req.params.proposalId);

        if (!Number.isInteger(proposalId) || proposalId <= 0) {
            return res.status(400).json({ message: 'Invalid proposal ID.' });
        }

        const request = new sql.Request();
        request.input('proposalId', sql.Int, proposalId);

        const result = await request.query(`
            SELECT
                p.proposal_id,
                p.project_id,
                p.freelancer_id,
                p.cover_letter,
                p.bid_amount,
                p.estimated_days,
                p.status,
                p.submitted_at,
                pr.title AS project_title,
                pr.description AS project_description,
                f.full_name AS freelancer_name,
                f.email AS freelancer_email,
                f.phone AS freelancer_phone
            FROM dbo.proposal p
            INNER JOIN dbo.project pr ON p.project_id = pr.project_id
            INNER JOIN dbo.freelancer f ON p.freelancer_id = f.freelancer_id
            WHERE p.proposal_id = @proposalId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Proposal not found.' });
        }

        return res.status(200).json({ proposal: result.recordset[0] });
    } catch (error) {
        console.error('Get proposal details error:', error);
        return res.status(500).json({ message: 'Unable to retrieve proposal details.' });
    }
};

const updateProposalStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const proposalId = Number(req.params.proposalId);
        const { status } = req.body;

        if (!Number.isInteger(proposalId) || proposalId <= 0) {
            return res.status(400).json({ message: 'Invalid proposal ID.' });
        }

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid proposal status.' });
        }

        const request = new sql.Request();
        request.input('proposalId', sql.Int, proposalId);
        request.input('status', sql.VarChar(12), status);

        const result = await request.query(`
            UPDATE dbo.proposal
            SET status = @status
            OUTPUT INSERTED.status
            WHERE proposal_id = @proposalId
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Proposal not found.' });
        }

        return res.status(200).json({
            message: 'Proposal status updated successfully.',
            status: result.recordset[0].status
        });
    } catch (error) {
        console.error('Update proposal status error:', error);
        return res.status(500).json({ message: 'Failed to update proposal status.' });
    }
};

module.exports = {
    getAllProposals,
    getProposalById,
    updateProposalStatus
};
