const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

const app = express();

// Import routes
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const skillRoutes = require('./routes/skillRoutes');
const freelancerSkillRoutes = require('./routes/freelancerSkillRoutes');
const freelancerServiceRoutes = require('./routes/freelancerServiceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectRequirementRoutes = require('./routes/projectRequirementRoutes');
const projectSkillRoutes = require('./routes/projectSkillRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminComplaintRoutes = require('./routes/adminComplaintRoutes');
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/freelancer-skills', freelancerSkillRoutes);
app.use('/api/freelancer-services', freelancerServiceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-requirements', projectRequirementRoutes);
app.use('/api/project-skills', projectSkillRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin/complaints', adminComplaintRoutes);
// Home route
app.get('/', (req, res) => {
    res.send('AI Freelancing Platform API is running!');
});

const PORT = process.env.PORT || 5000;

// Connect to SQL Server
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});