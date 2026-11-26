const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');

// =====================================
// USER REGISTRATION
// =====================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            org_name,
            contact_person,
            email,
            password,
            role
        } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Email, password and role are required.'
            });
        }

        // Admin registration is not allowed
        if (!['freelancer', 'client'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid user role.'
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email) || email.length > 120) {
            return res.status(400).json({
                message: 'Please provide a valid email address.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters.'
            });
        }

        // Check duplicate email
        const checkRequest = new sql.Request();

        checkRequest.input('email', sql.VarChar(120), email);

        const existingUser = await checkRequest.query(`
            SELECT email FROM dbo.client WHERE email = @email
            UNION
            SELECT email FROM dbo.freelancer WHERE email = @email
        `);

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                message: 'This email is already registered.'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Register freelancer
        if (role === 'freelancer') {

            if (!name || name.trim().length === 0 || name.length > 100) {
                return res.status(400).json({
                    message: 'Please provide a valid full name.'
                });
            }

            const request = new sql.Request();

            request.input('full_name', sql.VarChar(100), name.trim());
            request.input('email', sql.VarChar(120), email);
            request.input('password_hash', sql.VarChar(255), passwordHash);

            const result = await request.query(`
                INSERT INTO dbo.freelancer
                (
                    full_name,
                    email,
                    password_hash
                )
                OUTPUT
                    INSERTED.freelancer_id,
                    INSERTED.full_name,
                    INSERTED.email
                VALUES
                (
                    @full_name,
                    @email,
                    @password_hash
                )
            `);

            return res.status(201).json({
                message: 'Freelancer registered successfully!',
                user: {
                    ...result.recordset[0],
                    role: 'freelancer'
                }
            });
        }

        // Register client
        if (role === 'client') {

            if (
                !org_name ||
                !contact_person ||
                org_name.trim().length === 0 ||
                contact_person.trim().length === 0 ||
                org_name.length > 120 ||
                contact_person.length > 100
            ) {
                return res.status(400).json({
                    message: 'Please provide a valid organization name and contact person.'
                });
            }

            const request = new sql.Request();

            request.input('org_name', sql.VarChar(120), org_name.trim());
            request.input('contact_person', sql.VarChar(100), contact_person.trim());
            request.input('email', sql.VarChar(120), email);
            request.input('password_hash', sql.VarChar(255), passwordHash);

            const result = await request.query(`
                INSERT INTO dbo.client
                (
                    org_name,
                    contact_person,
                    email,
                    password_hash
                )
                OUTPUT
                    INSERTED.client_id,
                    INSERTED.org_name,
                    INSERTED.contact_person,
                    INSERTED.email
                VALUES
                (
                    @org_name,
                    @contact_person,
                    @email,
                    @password_hash
                )
            `);

            return res.status(201).json({
                message: 'Client registered successfully!',
                user: {
                    ...result.recordset[0],
                    role: 'client'
                }
            });
        }

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Registration failed. Please try again.'
        });
    }
};


// =====================================
// USER LOGIN
// =====================================

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Email, password and role are required.'
            });
        }

        if (!['freelancer', 'client', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid user role.'
            });
        }

        const request = new sql.Request();

        request.input('email', sql.VarChar(120), email);

        let result;

        // Freelancer login
        if (role === 'freelancer') {

            result = await request.query(`
                SELECT
                    freelancer_id AS user_id,
                    full_name AS name,
                    email,
                    password_hash,
                    account_status
                FROM dbo.freelancer
                WHERE email = @email
            `);

        }

        // Client login
        else if (role === 'client') {

            result = await request.query(`
                SELECT
                    client_id AS user_id,
                    contact_person AS name,
                    email,
                    password_hash,
                    account_status
                FROM dbo.client
                WHERE email = @email
            `);

        }

        // Admin login
        else if (role === 'admin') {

            result = await request.query(`
                SELECT
                    admin_id AS user_id,
                    full_name AS name,
                    email,
                    password_hash,
                    role AS admin_role
                FROM dbo.admin_staff
                WHERE email = @email
            `);

        }

        // Check whether user exists
        if (!result || result.recordset.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const user = result.recordset[0];

        // Check account status
        if (role !== 'admin' && user.account_status !== 'ACTIVE') {
            return res.status(403).json({
                message: 'Your account is not active.'
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.user_id,
                email: user.email,
                role: role,
                adminRole: user.admin_role || null
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: role
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Login failed. Please try again.'
        });
    }
};


// =====================================
// EXPORT FUNCTIONS
// =====================================

module.exports = {
    registerUser,
    loginUser
};