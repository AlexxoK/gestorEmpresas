import Role from '../roles/role.model.js';
import Admin from '../admins/admin.model.js';
import Empresa from '../empresas/empresa.model.js';

export const esRoleValido = async (role = ' ') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`Role ${role} does not exist in the database!`);
    }
}

export const existenteAdminEmail = async (email = ' ') => {
    const existeEmail = await Admin.findOne({ email });

    if (existeEmail) {
        throw new Error(`Email ${email} exists in the database!`);
    }
}

export const existeAdminById = async (id = '') => {
    const existeAdmin = await Admin.findById(id);

    if (!existeAdmin) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeEmpresaById = async (id = '') => {
    const existeEmpresa = await Empresa.findById(id);

    if (!existeEmpresa) {
        throw new Error(`id ${id} dont exists!`);
    }
}