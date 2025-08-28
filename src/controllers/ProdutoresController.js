const conn = require('../database/database')
const { z, ZodError } = require('zod');

const produtorSchema = z.object({
	nome: z.string().min(4).max(100),
	localizacao: z.string().min(5).max(100),
});

async function store(req, res) {
	try {
		const payload = produtorSchema.parse(req.body);
		const result = await conn('produtores').insert(payload);
		const id = Array.isArray(result) ? result[0] : result;

		const produtor = await conn('produtores').where({ id }).first();

		res.status(201).json({ message: 'Produtor criado com sucesso', data: produtor });

	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ errors: error.errors });
		}
		
		return res.status(500).json({
			error: 'Falha ao tentar registar produtor!',
			hint: process.env.NODE_ENV === 'development' ? error.sqlMessage || error.message : undefined
		});
	}

}


async function atribuirProdutor(req, res, next) {

	const id = z.number().int().positive();
	const atribuir = z.object({
		produtor_id: id,
		tecnico_id: id,
		campanha_id: id
	});

	const parsed = atribuir.safeParse(req.body);

	if (!parsed.success) return next(parsed.error);
	const { produtor_id, tecnico_id, campanha_id } = parsed.data;

	try {
		await conn.transaction(async trx => {

			const produtor = await trx('produtores').where({ id: produtor_id }).first();
			if (!produtor) throw new Error('Produtor não encontrado');

			const tecnico = await trx('tecnicos').where({ id: tecnico_id }).first();
			if (!tecnico) throw new Error('Técnico não encontrado');
			
			if (tecnico.campanha_id !== campanha_id) throw new Error('Técnico não pertence à campanha informada');

			await trx('produtores_campanhas')
				.where({ produtor_id, campanha_id })
				.whereNull('data_transferencia')
				.update({ data_transferencia: trx.fn.now() });

			const result = await trx('produtores_campanhas').insert({ produtor_id, campanha_id, tecnico_id });
			
			// result_id = Array.isArray(result) ? result[0] : result;
			// await conn('produtores_campanhas').where({ id: result_id }).first();
		});


		return res.status(201).json({
            message: 'Produtor atribuído com sucesso',
            // data: await getProdutores(produtor_id),
        });

	} catch (e) { 
		if (e instanceof ZodError) {
			return res.status(400).json({ errors: e.errors });
		}
	
		return res.status(500).json({
			error: 'Falha ao registar empresa',
			hint: process.env.NODE_ENV === 'development' ? e.sqlMessage || e.message : undefined
		});
	}
}

// async function getProdutores(id) {

// 	try {
// 		const data = await db('produtores_campanhas as prod_c')
// 		.join('produtores as prod', 'prod.id', 'prod_c.produtor_id')
// 		.select('prod.id', 'prod.nome', 'prod.localizacao')
// 		.where('prod_c.produtor_id', id) 
// 		return data;

// 	} catch (e) { 
// 		if (e instanceof ZodError) {
// 			return res.status(400).json({ errors: e.errors });
// 		}
	
// 		return res.status(500).json({
// 			error: 'Falha ao registar empresa',
// 			hint: process.env.NODE_ENV === 'development' ? e.sqlMessage || e.message : undefined
// 		});
// 	}
// }



async function transferirProdutor(req, res, next) {

	const id = z.number().int().positive();

	const transferir = z.object({
		produtor_id: id,
		tecnico_antigo_id: id,
		tecnico_novo_id: id,
		campanha_id: id
	}).refine(d => d.tecnico_antigo_id !== d.tecnico_novo_id, {
		message: 'Técnico novo deve ser diferente do antigo',
		path: ['tecnico_novo_id']
	});

	const parsed = transferir.safeParse(req.body);
	if (!parsed.success) return next(parsed.error);
	const { produtor_id, tecnico_antigo_id, tecnico_novo_id, campanha_id } = parsed.data;

	try {
		await conn.transaction(async trx => {
			const tec_antigo = await trx('tecnicos').where({ id: tecnico_antigo_id }).first();

			const tec_novo = await trx('tecnicos').where({ id: tecnico_novo_id }).first();
			if (!tec_antigo || !tec_novo) throw new Error('Técnico(s) não encontrado(s)');

			if (tec_antigo.campanha_id !== campanha_id || tec_novo.campanha_id !== campanha_id) {
				throw new Error('Ambos os técnicos devem pertencer à campanha');
			}

			const ativo = await trx('produtores_campanhas')
				.where({ produtor_id, campanha_id, tecnico_id: tecnico_antigo_id })
				.whereNull('data_transferencia')
				.first();
			if (!ativo) throw new Error('Não existe atribuição ativa com o técnico antigo');

			await trx('produtores_campanhas').where({ id: ativo.id })
				.update({ data_transferencia: trx.fn.now() });

			await trx('produtores_campanhas')
				.insert({ produtor_id, campanha_id, tecnico_id: tecnico_novo_id });
		});

		res.json({ message: 'Transferência concluída' });
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




module.exports = { store, atribuirProdutor, transferirProdutor };

