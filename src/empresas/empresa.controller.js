import { response, request } from "express";
import Empresa from "./empresa.model.js";

import { writeFile } from 'fs';
import * as XLSX from 'xlsx';

export const saveEmpresa = async (req, res) => {
    try {
        const data = req.body;

        const trayectoriasValidas = [
            'Tecnología y Comunicaciones', 
            'Electrónica y Equipos de Seguridad', 
            'Energía Renovable', 
            'Alimentos y Bebidas', 
            'Construcción y Arquitectura', 
            'Moda y Textiles', 
            'Turismo y Hospitalidad', 
            'Productos Químicos y Materiales', 
            'Salud y Medicina', 
            'Logística y Transporte'
        ];

        if (!trayectoriasValidas.includes(data.trayectoria)) {
            return res.status(400).json({
                success: false,
                message: `La trayectoria proporcionada no es válida. Las trayectorias válidas son: ${trayectoriasValidas.join(', ')}`
            });
        }

        const categoriasValidas = [
            'Microempresa', 
            'Startup', 
            'Gran Empresa', 
            'Corporación', 
            'Multinacional'
        ];

        if (!categoriasValidas.includes(data.categoria)) {
            return res.status(400).json({
                success: false,
                message: `La categoría proporcionada no es válida. Las categorías válidas son: ${categoriasValidas.join(', ')}`
            });
        }

        const empresa = new Empresa(data);
        await empresa.save();

        const wb = XLSX.utils.book_new();
        const ws_data = [
            ["ID", "Impacto", "Trayectoria", "Categoría", "Estado", "Fecha de Creación"],
            [empresa._id, empresa.impacto, empresa.trayectoria, empresa.categoria, empresa.estado, empresa.createdAt]
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Empresa");

        const filePath = `./reportes/reporteEmpresa_${empresa._id}.xlsx`;
        writeFile(filePath, XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }), (err) => {
            if (err) {
                console.error('Error al guardar el archivo Excel:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al generar el archivo Excel.',
                    error: err
                });
            }
            console.log(`Archivo Excel generado en: ${filePath}`);
        });

        res.status(200).json({
            success: true,
            message: 'Empresa guardada con éxito y archivo Excel generado!',
            empresa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar la empresa!',
            error
        });
    }
};

export const findAllEmpresas = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, empresas] = await Promise.all([
            Empresa.countDocuments(query),
            Empresa.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            empresas
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las empresas!',
            error
        })
    }
}

export const findAllEmpresasByTrayectoria = async (req, res) => {
    try {
        const { trayectoria } = req.params;

        const empresas = await Empresa.find({ trayectoria: trayectoria });

        if (empresas.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron empresas con esa trayectoria!'
            });
        }

        res.status(200).json({
            success: true,
            empresas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las empresas!',
            error
        });
    }
};

export const findAllEmpresasByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;

        const empresas = await Empresa.find({ categoria: categoria });

        if (empresas.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron empresas con esa categoría!'
            });
        }

        res.status(200).json({
            success: true,
            empresas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las empresas!',
            error
        });
    }
};

export const findAllEmpresasByOrden = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0, orden = 'asc' } = req.query;
        const query = { estado: true };

        const ordenCondicion = orden === 'desc' ? { categoria: -1 } : { categoria: 1 };

        const [total, empresas] = await Promise.all([
            Empresa.countDocuments(query),
            Empresa.find(query)
                .sort(ordenCondicion)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            empresas
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las empresas!',
            error
        });
    }
};

export const putEmpresaById = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const empresa = await Empresa.findById(id);

        if (!empresa) {
            return res.status(404).json({
                success: false,
                msg: 'Empresa no encontrada!',
            });
        }

        const updatedEmpresa = await Empresa.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Empresa actualizada con éxito!',
            empresa: updatedEmpresa,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la empresa!',
            error: error.message || 'Error interno del servidor',
        });
    }
};