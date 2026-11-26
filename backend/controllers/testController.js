const testController = (req, res) => {
    res.json({
        message: 'Controller is working successfully!'
    });
};

module.exports = { testController };