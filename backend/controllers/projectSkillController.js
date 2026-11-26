const { sql } = require('../config/db');

// Add a skill to a project
const addProjectSkill = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const projectId = Number(req.params.projectId);
        const { skill_id, is_mandatory } = req.body;

        if (!skill_id || is_mandatory === undefined) {
            return res.status(400).json({
                message: 'Please provide skill_id and is_mandatory.'
            });
        }

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('clientId', sql.Int, clientId);
        request.input('skillId', sql.Int, skill_id);
        request.input('isMandatory', sql.Bit, is_mandatory);

        await request.query(`
            IF NOT EXISTS (
                SELECT 1 FROM dbo.project
                WHERE project_id = @projectId
                AND client_id = @clientId
            )
                THROW 50001, 'Project not found.', 1;

            INSERT INTO dbo.project_skill
            (project_id, skill_id, is_mandatory)
            VALUES (@projectId, @skillId, @isMandatory);
        `);

        return res.status(201).json({
            message: 'Project skill added successfully!'
        });

    } catch (error) {
        console.error('Add project skill error:', error);

        return res.status(500).json({
            message: 'Failed to add project skill.'
        });
    }
};

// Get skills required for a project
const getProjectSkills = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const projectId = Number(req.params.projectId);

        const request = new sql.Request();

        request.input('projectId', sql.Int, projectId);
        request.input('clientId', sql.Int, clientId);

        const result = await request.query(`
            SELECT
                ps.project_id,
                ps.skill_id,
                s.skill_name,
                ps.is_mandatory
            FROM dbo.project_skill ps
            INNER JOIN dbo.skill s
                ON ps.skill_id = s.skill_id
            INNER JOIN dbo.project p
                ON ps.project_id = p.project_id
            WHERE ps.project_id = @projectId
              AND p.client_id = @clientId
        `);

        return res.status(200).json({
            message: 'Project skills retrieved successfully!',
            skills: result.recordset
        });

    } catch (error) {
        console.error('Get project skills error:', error);

        return res.status(500).json({
            message: 'Failed to retrieve project skills.'
        });
    }
};

module.exports = {
    addProjectSkill,
    getProjectSkills
};