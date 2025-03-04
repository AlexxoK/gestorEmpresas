import Admin from '../admins/admin.model.js';
import { verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {

    const { email, password, username } = req.body;

    try {

        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const admin = await Admin.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!admin) {
            return res.status(400).json({
                msg: 'Incorrect credentials - email does not exist in the database!'
            });
        }

        if (!admin.estado) {
            return res.status(400).json({
                msg: 'Admin does not exist in the database!'
            });
        }

        const validPassword = await verify(admin.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect!'
            });
        }

        const token = await generarJWT(admin.id);

        return res.status(200).json({
            msg: 'Login OK!',
            adminDetails: {
                username: admin.username,
                token: token
            }
        })

    } catch (e) {

        console.log(e);

        return res.status(500).json({
            message: "Server error!",
            error: e.message
        })
    }
}