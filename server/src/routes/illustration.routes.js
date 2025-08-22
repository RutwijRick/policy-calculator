import { Router } from 'express';
import { IllustrationRow, Policy } from '../models/index.js';
import { buildIllustration } from '../services/calc.js';
import auth from '../middleware/auth.js';

const r = Router();

r.post('/:policyId/generate', auth, async (req, res) => {
    const policy = await Policy.findByPk(req.params.policyId);
    if (!policy || policy.userId !== req.user.uid) return res.status(404).json({ message: 'Not found' });

    const rows = buildIllustration(policy);
    await IllustrationRow.destroy({ where: { policyId: policy.id } });
    await IllustrationRow.bulkCreate(rows.map(rw => ({ ...rw, policyId: policy.id })));

    res.json({ policyId: policy.id, rows });
});

r.get('/:policyId', auth, async (req, res) => {
    const rows = await IllustrationRow.findAll({ where: { policyId: req.params.policyId }, order: [['year', 'ASC']] });
    res.json({ rows });
});

export default r;
