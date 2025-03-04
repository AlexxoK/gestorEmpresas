import jwt from 'jsonwebtoken';

import Admin from '../admins/admin.model.js';

export const validarJWTAdmin = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "There is no token in the request!"
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const admin = await Admin.findById(uid);

        if (!admin) {
            return res.status(401).json({
                msg: 'Administrador does not exist in te database!'
            })
        }

        if (!admin.estado) {
            return res.status(401).json({
                msg: 'Token not valid - admins with estado: false!'
            })
        }

        req.admin = admin;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token not valid!"
        })
    }
}