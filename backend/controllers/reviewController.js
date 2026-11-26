const { sql } = require('../config/db');

// =====================================
// CREATE REVIEW
// =====================================

const createReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;

        const projectId = Number(req.params.projectId);
        const { rating, comment } = req.body;

        if (!['client', 'freelancer'].includes(role)) {
            return res.status(403).json({
                message: 'Access denied.'
            });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'Rating must be between 1 and 5.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('userId', sql.Int, userId);
        request.input('rating', sql.TinyInt, rating);
        request.input('comment', sql.VarChar(1000), comment || null);

        const reviewerType = role.toUpperCase();

        request.input('reviewerType', sql.VarChar(20), reviewerType);

        const result = await request.query(`
            INSERT INTO dbo.review
            (
                project_id,
                client_id,
                freelancer_id,
                reviewer_type,
                rating,
                comment
            )
            SELECT
                p.project_id,
                p.client_id,
                pa.freelancer_id,
                @reviewerType,
                @rating,
                @comment
            FROM dbo.project p
            INNER JOIN dbo.project_assignment pa
                ON p.project_id = pa.project_id
            WHERE p.project_id = @projectId
              AND p.status = 'COMPLETED'
              AND (
                  (p.client_id = @userId AND @reviewerType = 'CLIENT')
                  OR
                  (pa.freelancer_id = @userId AND @reviewerType = 'FREELANCER')
              )
              AND NOT EXISTS (
                  SELECT 1
                  FROM dbo.review r
                  WHERE r.project_id = p.project_id
                    AND r.reviewer_type = @reviewerType
                    AND (
                        (@reviewerType = 'CLIENT' AND r.client_id = @userId)
                        OR
                        (@reviewerType = 'FREELANCER' AND r.freelancer_id = @userId)
                    )
              );

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(400).json({
                message: 'Project not completed, unauthorized, or review already submitted.'
            });
        }

        return res.status(201).json({
            message: 'Review submitted successfully!'
        });

    } catch (error) {
        console.error('Create review error:', error);

        return res.status(500).json({
            message: 'Failed to submit review.'
        });
    }
};

module.exports = {
    createReview
};