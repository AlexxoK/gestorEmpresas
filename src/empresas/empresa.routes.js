import { Router } from "express";
import { check } from "express-validator";
import { saveEmpresa, findAllEmpresas, findAllEmpresasByTrayectoria, findAllEmpresasByCategoria, findAllEmpresasByOrden, putEmpresaById } from "./empresa.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTAdmin } from "../middlewares/validar-jwt.js";
import { tieneRoleAdmin } from "../middlewares/validar-roles.js";
import { existeEmpresaById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/saveEmpresa",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        validarCampos
    ],
    saveEmpresa
)

router.get("/findAllEmpresas", findAllEmpresas)

router.get("/findAllEmpresasByTrayectoria/:trayectoria", findAllEmpresasByTrayectoria)

router.get("/findAllEmpresasByCategoria/:categoria", findAllEmpresasByCategoria)

router.get("/findAllEmpresasByOrden", findAllEmpresasByOrden)

router.put(
    "/putEmpresaById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeEmpresaById),
        validarCampos
    ],
    putEmpresaById
)

export default router;