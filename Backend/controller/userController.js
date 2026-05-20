const { createUser, existingUser } = require("../model/userModel");

const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const userExists = await existingUser(email);
        if (userExists) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const user = await createUser(name, email, password);

        res.status(201).json({
            message: "User created successfully",
            user,
        });

    } catch (e) {
        res.status(500).json({
            message: "Server error",
            error: e.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await existingUser(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (e) {
        res.status(500).json({
            message: "Server error",
            error: e.message,
        });
    }
};

module.exports = { addUser, login };