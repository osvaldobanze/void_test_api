const conn = require('../database/database');
const { z, ZodError } = require('zod');

const empresaSchema = z.object({
    nome: z.string().min(2).max(100),
    cnpj: z.string().min(14).max(30),
    email: z.string().email(),
    telefone: z.string().min(9).max(15),
});

async function store(req, res) {
    try {
        const payload = empresaSchema.parse(req.body);

        const result = await conn('empresas').insert(payload);
        const id = Array.isArray(result) ? result[0] : result;

        const empresa = await conn('empresas').where({ id }).first();

        return res.status(201).json({
            message: 'Empresa registada com sucesso',
            data: empresa,
        });
        
    } catch (err) {
        
        if (err instanceof ZodError) {
            return res.status(400).json({ errors: err.errors });
        }
       
        return res.status(500).json({
            error: 'Falha ao registar empresa',
            hint: process.env.NODE_ENV === 'development' ? err.sqlMessage || err.message : undefined
        });
    }
}

module.exports = { store };
