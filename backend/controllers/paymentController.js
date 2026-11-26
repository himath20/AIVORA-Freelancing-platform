const { sql } = require('../config/db');

// =====================================
// CREATE PAYMENT
// =====================================

const createPayment = async (req, res) => {
    try {
        const clientId = req.user.userId;

        const {
            assignment_id,
            amount,
            payment_method,
            payment_type
        } = req.body;

        if (!assignment_id || !amount || !payment_method) {
            return res.status(400).json({
                message: 'Assignment ID, amount and payment method are required.'
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: 'Payment amount must be greater than zero.'
            });
        }

        const allowedMethods = [
            'CARD',
            'BANK_TRANSFER',
            'PAYPAL',
            'WALLET'
        ];

        const allowedTypes = [
            'ADVANCE',
            'MILESTONE',
            'FINAL'
        ];

        const method = payment_method.toUpperCase();
        const type = (payment_type || 'MILESTONE').toUpperCase();

        if (!allowedMethods.includes(method)) {
            return res.status(400).json({
                message: 'Invalid payment method.'
            });
        }

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                message: 'Invalid payment type.'
            });
        }

        const request = new sql.Request();

        request.input('assignmentId', sql.Int, assignment_id);
        request.input('clientId', sql.Int, clientId);
        request.input('amount', sql.Decimal(10, 2), amount);
        request.input('paymentMethod', sql.VarChar, method);
        request.input('paymentType', sql.VarChar, type);

        const result = await request.query(`
            IF EXISTS (
                SELECT 1
                FROM dbo.project_assignment pa
                INNER JOIN dbo.project p
                    ON pa.project_id = p.project_id
                WHERE pa.assignment_id = @assignmentId
                  AND p.client_id = @clientId
            )
            BEGIN
                INSERT INTO dbo.payment
                (
                    assignment_id,
                    amount,
                    platform_fee,
                    payment_method,
                    payment_type,
                    status
                )
                VALUES
                (
                    @assignmentId,
                    @amount,
                    0,
                    @paymentMethod,
                    @paymentType,
                    'PENDING'
                );

                SELECT SCOPE_IDENTITY() AS payment_id;
            END
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Assignment not found.'
            });
        }

        return res.status(201).json({
            message: 'Payment created successfully!',
            payment_id: result.recordset[0].payment_id
        });

    } catch (error) {
        console.error('Create payment error:', error);

        return res.status(500).json({
            message: 'Failed to create payment.'
        });
    }
};
// =====================================
// GET ASSIGNMENT PAYMENTS
// =====================================

const getAssignmentPayments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        const assignmentId = Number(req.params.assignmentId);

        if (!['client', 'freelancer'].includes(role)) {
            return res.status(403).json({
                message: 'Access denied.'
            });
        }

        const request = new sql.Request();

        request.input('assignmentId', sql.Int, assignmentId);
        request.input('userId', sql.Int, userId);

        const result = await request.query(`
            SELECT
                pay.payment_id,
                pay.assignment_id,
                pay.amount,
                pay.platform_fee,
                pay.payment_method,
                pay.payment_type,
                pay.status,
                pay.payment_date
            FROM dbo.payment pay
            INNER JOIN dbo.project_assignment pa
                ON pay.assignment_id = pa.assignment_id
            INNER JOIN dbo.project p
                ON pa.project_id = p.project_id
            WHERE pa.assignment_id = @assignmentId
              AND (
                  (p.client_id = @userId AND '${role}' = 'client')
                  OR
                  (pa.freelancer_id = @userId AND '${role}' = 'freelancer')
              )
            ORDER BY pay.payment_date DESC
        `);

        return res.status(200).json({
            message: 'Payments retrieved successfully!',
            payments: result.recordset
        });

    } catch (error) {
        console.error('Get payments error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve payments.'
        });
    }
};
// =====================================
// UPDATE PAYMENT STATUS (ADMIN)
// =====================================

const updatePaymentStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Only administrators can update payment status.'
            });
        }

        const paymentId = Number(req.params.paymentId);
        const { status } = req.body;

        const allowedStatuses = [
            'COMPLETED',
            'FAILED',
            'REFUNDED'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid payment status.'
            });
        }

        const request = new sql.Request();

        request.input('paymentId', sql.Int, paymentId);
        request.input('status', sql.VarChar, status);

        const result = await request.query(`
            UPDATE dbo.payment
            SET status = @status
            WHERE payment_id = @paymentId
              AND status = 'PENDING';

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'Pending payment not found.'
            });
        }

        return res.status(200).json({
            message: 'Payment status updated successfully!'
        });

    } catch (error) {
        console.error('Update payment status error:', error);

        return res.status(500).json({
            message: 'Failed to update payment status.'
        });
    }
};
module.exports = {
    createPayment,
    getAssignmentPayments,
    updatePaymentStatus
};