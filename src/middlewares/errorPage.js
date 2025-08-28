module.exports = (err, req, res, next) => {
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      error: 'Erro na Validação',
      details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno, tente mais tarde!' });
};