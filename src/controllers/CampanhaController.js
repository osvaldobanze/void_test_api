const conn = require('../database/database');
const { z, ZodError } = require('zod');
 
const dateYMD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

const campanhaSchema = z.object({
    nome: z.string().min(2).max(100),
    empresa_id: z.number().int().positive(),
    data_inicio: dateYMD,
    data_fim: dateYMD.optional()
});

async function store(req, res) {
    try {

        const payload = campanhaSchema.parse(req.body);
         
        const result = await conn('campanhas').insert(payload);
        const id = Array.isArray(result) ? result[0] : result;

        const campanha = await conn('campanhas').where({ id }).first();

        return res.status(201).json({
            message: 'Campanha registada com sucesso',
            data: campanha,
        });

    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ errors: err.errors });
        }
        
        return res.status(500).json({
            error: 'Falha ao registar campanha',
            hint: process.env.NODE_ENV === 'development' ? err.sqlMessage || err.message : undefined
        });
    }
}

module.exports = {
    store
};