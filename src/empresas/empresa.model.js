import { Schema, model } from "mongoose";

const EmpresaSchema = Schema({
    impacto: {
        type: String,
        required: [true, "El impacto es obligatorio."],
        maxlength: [500, "El impacto debe tener máximo 500 caracteres."],
        trim: true,
    },

    trayectoria: {
        type: String,
        required: [true, "La trayectoria es obligatoria."],
        enum: [
            'Tecnología y Comunicaciones',
            'Electrónica y Equipos de Seguridad',
            'Energía Renovable',
            'Alimentos y Bebidas',
            'Construcción y Arquitectura',
            'Moda y Textiles',
            'Turismo y Hospitalidad',
            'Productos Químicos y Materiales',
            'Salud y Medicina',
            'Logística y Transporte',
        ],
        trim: true,
        maxlength: [500, "La trayectoria debe tener máximo 500 caracteres."]
    },

    categoria: {
        type: String,
        required: [true, "La categoría empresarial es obligatoria."],
        enum: [
            'Microempresa',
            'Startup',
            'Gran Empresa',
            'Corporación',
            'Multinacional',
        ],
        trim: true,
        maxlength: [500, "La categoría debe tener máximo 500 caracteres."]
    },

    estado: {
        type: Boolean,
        default: true,
    }
},
{
    timestamps: true,
    versionKey: false,
});

export default model('Empresa', EmpresaSchema);