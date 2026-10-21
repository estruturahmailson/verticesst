// Função da Vercel que recebe os leads dos formulários e envia por e-mail (Resend).
// Variáveis de ambiente (configurar no painel da Vercel, nunca no código):
//   RESEND_API_KEY   chave da conta Resend
//   LEAD_TO_EMAIL    e-mail que recebe os leads (vários separados por vírgula)
//   LEAD_FROM_EMAIL  remetente verificado no Resend, ex.: "Site Vértice <site@verticeconsultoriaemsst.com.br>"
// Sem essas variáveis, o lead é registrado nos logs da função (Vercel > Logs) para não se perder.

const LIMITS = {
  nome: 80, empresa: 120, whatsapp: 20, email: 120, funcionarios: 40, servico: 80,
  origem: 40, pagina: 500, utm_source: 200, utm_medium: 200, utm_campaign: 200,
  utm_term: 200, utm_content: 200, gclid: 200
};

const LABELS = {
  nome: 'Nome', empresa: 'Empresa', whatsapp: 'WhatsApp', email: 'E-mail',
  funcionarios: 'Funcionários', servico: 'Serviço de interesse', origem: 'Formulário',
  pagina: 'Página', utm_source: 'utm_source', utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign', utm_term: 'utm_term', utm_content: 'utm_content', gclid: 'gclid'
};

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fail(res, status) {
  return res.status(status).json({ ok: false, error: 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp.' });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405);
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return fail(res, 400); }
  }
  if (!body || typeof body !== 'object') return fail(res, 400);

  // Campo isca preenchido = robô. Responde sucesso sem fazer nada.
  if (body.website) return res.status(200).json({ ok: true });

  const lead = {};
  for (const key of Object.keys(LIMITS)) lead[key] = clean(body[key], LIMITS[key]);

  const digits = lead.whatsapp.replace(/\D/g, '');
  if (!lead.nome || (digits.length !== 10 && digits.length !== 11)) return fail(res, 400);
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) lead.email = '';

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_TO_EMAIL) {
    console.log('LEAD (e-mail não configurado):', JSON.stringify(lead));
    return res.status(200).json({ ok: true });
  }

  const rows = Object.keys(LABELS)
    .filter((k) => lead[k])
    .map((k) => `<tr><td style="padding:4px 12px 4px 0"><strong>${LABELS[k]}</strong></td><td style="padding:4px 0">${escapeHtml(lead[k])}</td></tr>`)
    .join('');
  const text = Object.keys(LABELS).filter((k) => lead[k]).map((k) => `${LABELS[k]}: ${lead[k]}`).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL || 'Site Vértice <onboarding@resend.dev>',
        to: LEAD_TO_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: lead.email || undefined,
        subject: `Novo lead do site: ${lead.nome}${lead.servico ? ' - ' + lead.servico : ''}`,
        html: `<h2>Novo pedido de orçamento</h2><table>${rows}</table>`,
        text
      })
    });
    if (!r.ok) {
      console.error('Resend respondeu', r.status, await r.text());
      console.log('LEAD (falha no envio):', JSON.stringify(lead));
      return fail(res, 502);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar lead', err);
    console.log('LEAD (falha no envio):', JSON.stringify(lead));
    return fail(res, 500);
  }
};
