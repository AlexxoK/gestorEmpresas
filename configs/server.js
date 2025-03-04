'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { hash } from 'argon2';

import Admin from '../src/admins/admin.model.js';

import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import adminRoutes from '../src/admins/admin.routes.js';
import empresaRoutes from '../src/empresas/empresa.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/gestorEmpresas/v1/auth", authRoutes);
    app.use("/gestorEmpresas/v1/admins", adminRoutes);
    app.use("/gestorEmpresas/v1/empresas", empresaRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Succesful connecting to database!')
    } catch (error) {
        console.log('Error connecting to database!');
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3004;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}!`);
    } catch (err) {
        console.log(`Server init failed: ${err}!`);
    }
}

export const createAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("santosk027");

            const admin = new Admin({
                name: "Elmer",
                surname: "Santos",
                username: "SantosK",
                email: "santosk@gmail.com",
                password: hashedPassword,
                phone: "12345678",
                role: "ADMIN_ROLE",
            });

            await admin.save();
            console.log("Administrador creado con éxito!");
        } else {
            console.log("El administrador ya existe!");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error.message);
    }
};