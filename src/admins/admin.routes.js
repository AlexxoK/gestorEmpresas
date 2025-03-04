import { Router } from "express";
import { check } from "express-validator";
import { saveAdmin, findAllAdmins, findOneAdminById, putAdminById, deleteAdminById } from "./admin.controller.js";
import { existeAdminById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTAdmin } from "../middlewares/validar-jwt.js";
import { tieneRoleAdmin } from "../middlewares/validar-roles.js";
import { saveAdminValidator } from "../middlewares/validator.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js";

const router = Router();

router.post(
    '/saveAdmin',
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        saveAdminValidator,
        deleteFileOnError
    ],
    saveAdmin
);

router.get("/findAllAdmins", findAllAdmins);

router.get(
    "/findOneAdminById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    findOneAdminById
)

router.put(
    "/putAdminById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    putAdminById
)

router.delete(
    "/deleteAdminById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos
    ],
    deleteAdminById
)

export default router;