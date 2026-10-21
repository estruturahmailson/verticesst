// Configurações que a empresa preenche. Não coloque chaves secretas aqui: este arquivo é público.
window.VERTICE_CONFIG = {
  // CNPJ exibido no rodapé e na Política de Privacidade. Vazio = linha oculta.
  CNPJ: '',

  // WhatsApp que recebe os leads (somente números, com 55 + DDD).
  WHATSAPP: '5562981338625',

  // Logos de clientes na faixa de confiança. Só ative com autorização dos clientes
  // e depois de colocar os arquivos em /img (nomes no index.html).
  SHOW_CLIENT_LOGOS: false,

  // Google Ads: ID da conta (ex.: 'AW-123456789') e rótulos de conversão de cada evento.
  GOOGLE_ADS_ID: '',
  CONVERSION_LABELS: {
    lead_formulario: '',
    clique_whatsapp: '',
    clique_telefone: '',
    clique_email: ''
  },

  // Google Analytics 4 (opcional, ex.: 'G-XXXXXXXXXX').
  GA4_ID: ''
};
