
const { sql } = require('../config/db');

// =====================================
// GET FREELANCER DASHBOARD STATISTICS
// =====================================

const getFreelancerDashboard = async (req, res) => {
    try {
        const { userId, role } = req.user;

        if (role !== 'freelancer') {
            return res.status(403).json({
                message: 'Only freelancers can access this dashboard.'
            });
        }

        const request = new sql.Request();
        request.input('freelancerId', sql.Int, userId);

        const result = await request.query(`
            SELECT
                (
                    SELECT COUNT(*)
                    FROM dbo.project_assignment
                    WHERE freelancer_id = @freelancerId
                      AND status = 'ACTIVE'
                ) AS activeProjects,

                (
                    SELECT COUNT(*)
                    FROM dbo.proposal
                    WHERE freelancer_id = @freelancerId
                ) AS proposalsSent,

                (
                    SELECT COALESCE(SUM(pay.amount), 0)
                    FROM dbo.payment pay
                    INNER JOIN dbo.project_assignment pa
                        ON pay.assignment_id = pa.assignment_id
                    WHERE pa.freelancer_id = @freelancerId
                      AND UPPER(pay.status) = 'COMPLETED'
                ) AS totalEarnings
        `);

        return res.status(200).json({
            message: 'Dashboard statistics retrieved successfully!',
            statistics: result.recordset[0]
        });

    } catch (error) {
        console.error('Freelancer dashboard error:', error);
        return res.status(500).json({
            message: 'Failed to retrieve freelancer dashboard.'
        });
    }
};


// =====================================
// GET CLIENT DASHBOARD STATISTICS
// =====================================

const getClientDashboard = async (req, res) => {
    try {
        const { userId, role } = req.user;

        if (role !== 'client') {
            return res.status(403).json({
                message: 'Only clients can access this dashboard.'
            });
        }

        const request = new sql.Request();
        request.input('clientId', sql.Int, userId);

        const result = await request.query(`
            SELECT
                (
                    SELECT COUNT(*)
                    FROM dbo.project
                    WHERE client_id = @clientId
                      AND UPPER(status) IN ('OPEN', 'IN_PROGRESS')
                ) AS activeProjects,

                (
                    SELECT COUNT(*)
                    FROM dbo.project
                    WHERE client_id = @clientId
                ) AS totalProjects,

                (
                    SELECT COUNT(DISTINCT pa.freelancer_id)
                    FROM dbo.project_assignment pa
                    INNER JOIN dbo.project p
                        ON pa.project_id = p.project_id
                    WHERE p.client_id = @clientId
                ) AS freelancersHired,

                (
                    SELECT COALESCE(SUM(pay.amount), 0)
                    FROM dbo.payment pay
                    INNER JOIN dbo.project_assignment pa
                        ON pay.assignment_id = pa.assignment_id
                    INNER JOIN dbo.project p
                        ON pa.project_id = p.project_id
                    WHERE p.client_id = @clientId
                      AND UPPER(pay.status) = 'COMPLETED'
                ) AS totalSpent,

                (
                    SELECT COALESCE(SUM(pay.amount), 0)
                    FROM dbo.payment pay
                    INNER JOIN dbo.project_assignment pa
                        ON pay.assignment_id = pa.assignment_id
                    INNER JOIN dbo.project p
                        ON pa.project_id = p.project_id
                    WHERE p.client_id = @clientId
                      AND UPPER(pay.status) = 'PENDING'
                ) AS pendingPayments;

            SELECT TOP 4
                p.project_id,
                p.title,
                p.status,
                p.budget_min,
                p.budget_max,
                (
                    SELECT COUNT(*)
                    FROM dbo.proposal pr
                    WHERE pr.project_id = p.project_id
                ) AS proposal_count
            FROM dbo.project p
            WHERE p.client_id = @clientId
            ORDER BY p.posted_date DESC;

            SELECT
                YEAR(pay.payment_date) AS year,
                MONTH(pay.payment_date) AS month,
                SUM(pay.amount) AS total
            FROM dbo.payment pay
            INNER JOIN dbo.project_assignment pa
                ON pay.assignment_id = pa.assignment_id
            INNER JOIN dbo.project p
                ON pa.project_id = p.project_id
            WHERE p.client_id = @clientId
              AND UPPER(pay.status) = 'COMPLETED'
              AND pay.payment_date >= DATEADD(MONTH, -5, GETDATE())
            GROUP BY
                YEAR(pay.payment_date),
                MONTH(pay.payment_date)
            ORDER BY
                YEAR(pay.payment_date),
                MONTH(pay.payment_date);
        `);

        return res.status(200).json({
            message: 'Client dashboard retrieved successfully!',
            statistics: result.recordsets[0][0],
            projects: result.recordsets[1],
            spending: result.recordsets[2]
        });

    } catch (error) {
        console.error('Client dashboard error:', error);
        return res.status(500).json({
            message: 'Failed to retrieve client dashboard.'
        });
    }
};


// =====================================
// GET ADMIN DASHBOARD
// =====================================

const getAdminDashboard = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin access required.'
            });
        }

        const result = await sql.query(`
            SELECT
                (SELECT COUNT(*) FROM dbo.freelancer)
                    AS totalFreelancers,

                (SELECT COUNT(*) FROM dbo.client)
                    AS totalClients,

                (SELECT COUNT(*) FROM dbo.project)
                    AS totalProjects,

                (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM dbo.payment
                    WHERE UPPER(status) = 'COMPLETED'
                ) AS totalRevenue,

                (
                    SELECT COUNT(*)
                    FROM dbo.complaint
                    WHERE UPPER(status) IN (
                        'OPEN',
                        'INVESTIGATING',
                        'UNDER_REVIEW'
                    )
                ) AS openComplaints;

            SELECT TOP 5
                p.project_id,
                p.title,
                p.status,
                p.budget_min,
                p.budget_max,
                c.org_name AS clientName
            FROM dbo.project p
            LEFT JOIN dbo.client c
                ON p.client_id = c.client_id
            ORDER BY p.posted_date DESC;

            SELECT
                YEAR(posted_date) AS year,
                MONTH(posted_date) AS month,
                COUNT(*) AS totalProjects
            FROM dbo.project
            WHERE posted_date >= DATEADD(MONTH, -5, GETDATE())
            GROUP BY
                YEAR(posted_date),
                MONTH(posted_date)
            ORDER BY
                YEAR(posted_date),
                MONTH(posted_date);
        `);

        return res.status(200).json({
            message: 'Admin dashboard retrieved successfully!',
            statistics: result.recordsets[0][0],
            projects: result.recordsets[1],
            projectsChart: result.recordsets[2]
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve admin dashboard.'
        });
    }
};


// =====================================
// EXPORT FUNCTIONS
// =====================================

module.exports = {
    getFreelancerDashboard,
    getClientDashboard,
    getAdminDashboard
};
