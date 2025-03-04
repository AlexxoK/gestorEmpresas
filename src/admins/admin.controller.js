import { response, request } from "express";
import { hash, verify } from "argon2";
import Admin from "./admin.model.js";

export const saveAdmin = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const admin = await Admin.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
        })

        return res.status(201).json({
            message: "Admin registered successfully!",
            adminDetails: {
                admin: admin.email
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error registering Admin!",
            error: err.message
        })

    }
}

export const findAllAdmins = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, admins] = await Promise.all([
            Admin.countDocuments(query),
            Admin.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            admins
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting admins!',
            error
        })
    }
}

export const findOneAdminById = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                msg: 'Admin not found!'
            })
        }

        res.status(200).json({
            success: true,
            admin
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting admin!',
            error
        })
    }
}

export const putAdminById = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, password, ...data } = req.body;

        if (password) {
            data.password = await hash(password)
        }

        const admin = await Admin.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Admin update!',
            admin
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error update!',
            error
        })
    }
}

export const deleteAdminById = async (req, res) => {
    try {

        const { id } = req.params;

        const admin = await Admin.findByIdAndUpdate(id, { estado: false }, { new: true });

        const authenticatedAdmin = req.admin;

        res.status(200).json({
            success: true,
            msg: 'Deactivate admin!',
            admin,
            authenticatedAdmin
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Deactivate error!',
            error
        })
    }
}