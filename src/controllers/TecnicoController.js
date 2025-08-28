const conn = require('../database/database')
const { z, ZodError } = require('zod');

const tecnicoSchema = z.object({
	nome: z.string().min(2).max(100),
	campanha_id: z.number().int().positive(),
});

async function store(req, res) {
	try {
		const payload = tecnicoSchema.parse(req.body);
		const result = await conn('tecnicos').insert(payload);
		const id = Array.isArray(result) ? result[0] : result;

		const tecnico = await conn('tecnicos').where({ id }).first();

		return res.status(201).json({
			message: 'Técnico registado com sucesso',
			data: tecnico,
		});

	} catch (err) {

		if (err instanceof ZodError) {
			return res.status(400).json({ errors: err.errors });
		}

		return res.status(500).json({
			error: 'Erro ao tentar registar tecnico',
			hint: process.env.NODE_ENV === 'development' ? err.sqlMessage || err.message : undefined
		});
	}
}

async function getProdutores(req, res, next) {

	const paramsSchema = z.object({
		id: z.string()
			.regex(/^\d+$/, 'id deve ser numérico')
			.transform(Number)
			.pipe(z.number().int().positive())
	});

	try {
		const { id } = paramsSchema.parse(req.params);

		const rows = await conn('produtores_campanhas as pc')
			.join('produtores as p', 'p.id', 'pc.produtor_id')
			.select('p.id', 'p.nome', 'p.localizacao')
			.where('pc.tecnico_id', id)
			.whereNull('pc.data_transferencia')
			.orderBy('p.id', 'asc');

		return res.json(rows);

	} catch (err) {
		
		if (err instanceof ZodError) {
			return res.status(400).json({ errors: err.errors });
		}

		return res.status(500).json({
			error: 'Erro ao tentar registar tecnico',
			hint: process.env.NODE_ENV === 'development' ? err.sqlMessage || err.message : undefined
		});

	}
}




module.exports = {
	store,
	getProdutores,
};
