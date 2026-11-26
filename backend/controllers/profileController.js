const { sql } = require('../config/db');

// =====================================
// GET USER PROFILE
// =====================================

const getUserProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;

        let result;
        const request = new sql.Request();

        request.input('userId', sql.Int, userId);

        if (role === 'freelancer') {
            result = await request.query(`
                SELECT
                    freelancer_id,
                    full_name,
                    email,
                    phone,
                    country,
                    bio,
                    hourly_rate,
                    avg_rating,
                    account_status,
                    joined_date
                FROM dbo.freelancer
                WHERE freelancer_id = @userId
            `);

        } else if (role === 'client') {
            result = await request.query(`
                SELECT
                    client_id,
                    org_name,
                    contact_person,
                    email,
                    phone,
                    country,
                    client_type,
                    avg_rating,
                    account_status,
                    joined_date
                FROM dbo.client
                WHERE client_id = @userId
            `);

        } else {
            return res.status(403).json({
                message: 'Invalid user role.'
            });
        }

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'User profile not found.'
            });
        }

        return res.status(200).json({
            message: 'Profile retrieved successfully!',
            profile: result.recordset[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve user profile.'
        });
    }
};


// =====================================
// UPDATE USER PROFILE
// =====================================

const updateUserProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'Please provide at least one field to update.'
            });
        }

        let allowedFields;

        if (role === 'freelancer') {
            allowedFields = [
                'full_name', 'phone', 'country', 'bio', 'hourly_rate'
            ];
        } else if (role === 'client') {
            allowedFields = [
                'org_name', 'contact_person', 'phone', 'country'
            ];
        } else {
            return res.status(403).json({
                message: 'Invalid user role.'
            });
        }

        const fields = Object.keys(updates);

        const invalidFields = fields.filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: 'Invalid fields provided.',
                invalid_fields: invalidFields
            });
        }

        const request = new sql.Request();
        request.input('userId', sql.Int, userId);

        const setClauses = [];

        for (const field of fields) {
            const value = updates[field];

            if (field === 'full_name' || field === 'org_name') {
                const maxLength = field === 'org_name' ? 120 : 100;

                if (
                    typeof value !== 'string' ||
                    value.trim().length === 0 ||
                    value.trim().length > maxLength
                ) {
                    return res.status(400).json({
                        message: `Invalid value for ${field}.`
                    });
                }

                request.input(field, sql.VarChar(maxLength), value.trim());

            } else if (field === 'contact_person') {
                if (
                    typeof value !== 'string' ||
                    value.trim().length === 0 ||
                    value.trim().length > 100
                ) {
                    return res.status(400).json({
                        message: 'Invalid contact person name.'
                    });
                }

                request.input(field, sql.VarChar(100), value.trim());

            } else if (
                field === 'phone' ||
                field === 'country' ||
                field === 'bio'
            ) {
                const maxLength = {
                    phone: 20,
                    country: 60,
                    bio: 500
                }[field];

                if (
                    value !== null &&
                    (
                        typeof value !== 'string' ||
                        value.length > maxLength
                    )
                ) {
                    return res.status(400).json({
                        message: `Invalid value for ${field}.`
                    });
                }

                request.input(field, sql.VarChar(maxLength), value);

            } else if (field === 'hourly_rate') {
                if (
                    typeof value !== 'number' ||
                    !Number.isFinite(value) ||
                    value < 0 ||
                    value > 999999.99
                ) {
                    return res.status(400).json({
                        message: 'Invalid hourly rate.'
                    });
                }

                request.input(field, sql.Decimal(8, 2), value);
            }

            setClauses.push(`${field} = @${field}`);
        }

        const table = role === 'freelancer'
            ? 'dbo.freelancer'
            : 'dbo.client';

        const idColumn = role === 'freelancer'
            ? 'freelancer_id'
            : 'client_id';

        const result = await request.query(`
            UPDATE ${table}
            SET ${setClauses.join(', ')}
            WHERE ${idColumn} = @userId;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        if (result.recordset[0].affectedRows === 0) {
            return res.status(404).json({
                message: 'User profile not found.'
            });
        }

        return res.status(200).json({
            message: 'Profile updated successfully!'
        });

    } catch (error) {
        console.error('Update profile error:', error);

        return res.status(500).json({
            message: 'Failed to update user profile.'
        });
    }
};


// =====================================
// EXPORT FUNCTIONS
// =====================================

module.exports = {
    getUserProfile,
    updateUserProfile
};