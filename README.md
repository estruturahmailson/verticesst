# Landing page da Vértice Consultoria em SST

Site de uma página (PGR, PCMSO e LTCAT em Goiânia) em HTML, CSS e JavaScript puros, pronto para publicar na Vercel.

## Estrutura

```
index.html                     Landing page (10 seções)
politica-de-privacidade.html   Política de Privacidade (texto provisório)
css/critical.css               CSS do topo (tokens, cabeçalho, hero). Copiado inline no index.html
css/styles.css                 Restante dos estilos
js/config.js                   Configurações da empresa (CNPJ, Google Ads, logos de clientes)
js/main.js                     Menu, acordeão, contadores, formulários e rastreamento
api/lead.js                    Função da Vercel que recebe os formulários e envia por e-mail
img/                           Imagens (WebP)
tools/inline-critical.mjs      Copia css/critical.css para dentro do index.html
robots.txt, sitemap.xml, vercel.json, favicon.*
```

## Como publicar na Vercel

1. Importe este repositório em vercel.com (Add New > Project). Não é preciso configurar build: é um site estático com uma função em `/api`.
2. Em **Settings > Environment Variables**, cadastre:
   - `RESEND_API_KEY`: chave da conta [Resend](https://resend.com) (envio de e-mail dos leads).
   - `LEAD_TO_EMAIL`: e-mail que recebe os leads (pode ter vários, separados por vírgula).
   - `LEAD_FROM_EMAIL`: remetente com domínio verificado no Resend, por exemplo `Site Vértice <site@verticeconsultoriaemsst.com.br>`.
3. Aponte o domínio `verticeconsultoriaemsst.com.br` para o projeto (Settings > Domains).

Sem as variáveis de e-mail, o site funciona e o visitante é levado ao WhatsApp normalmente; o lead fica registrado só nos logs da função (Vercel > Logs).

## O que a empresa precisa preencher em `js/config.js`

- `CNPJ`: aparece no rodapé e na Política de Privacidade. Vazio, a linha fica oculta.
- `GOOGLE_ADS_ID` e `CONVERSION_LABELS`: ID da conta Google Ads (`AW-...`) e o rótulo de cada conversão (`lead_formulario`, `clique_whatsapp`, `clique_telefone`, `clique_email`). Sem o ID, nenhuma tag do Google é carregada.
- `GA4_ID` (opcional): ID do Google Analytics 4.
- `SHOW_CLIENT_LOGOS`: só mude para `true` com autorização dos clientes e com os arquivos `img/logo-cliente-*.webp` (240 x 120 px) no lugar.

## Imagens provisórias

As imagens atuais são **ilustrações provisórias** geradas com as cores da marca. Para trocar, basta substituir o arquivo mantendo **o mesmo nome e a mesma proporção**:

| Arquivo | Tamanho |
|---|---|
| `img/hero-visita-tecnica-vertice.webp` | 1200 x 800 (até 120 KB) |
| `img/hero-visita-tecnica-vertice-750.webp` | 750 x 500 (versão mobile do hero) |
| `img/card-pgr.webp`, `card-pcmso`, `card-ltcat`, `card-pacote-pcmso-pgr-ltcat`, `card-laudo-insalubridade`, `card-laudo-ergonomico`, `card-nr1-riscos-psicossociais`, `card-treinamentos`, `card-palestras-sipat` | 640 x 360 (até 40 KB) |
| `img/sobre-simone-espinar.webp` | 640 x 800 (até 70 KB) |
| `img/sobre-equipe-vertice.webp` | 960 x 640 (até 80 KB). Se não houver foto, remover o bloco no HTML |
| `img/consequencias-gestor-documentos.webp` | 800 x 600 (até 60 KB) |
| `img/como-funciona-entrega-explicada.webp` | 960 x 640 (até 80 KB) |
| `img/mapa-vertice-goiania.webp` | 800 x 500 (até 50 KB). Print estático do mapa com o pino |
| `img/og-image.jpg` | 1200 x 630 (imagem de compartilhamento) |

Logomarca: foi usada a imagem enviada (`img/logo-vertice-consultoria-sst.png`, 180 x 48). O ideal é receber a versão **SVG** (ou PNG com o dobro do tamanho) para ficar nítida em telas de alta densidade. O favicon (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`) é um desenho provisório inspirado no símbolo da marca.

## Ao editar

- **CSS do topo**: edite `css/critical.css` e rode `node tools/inline-critical.mjs` para atualizar o bloco inline do `index.html`.
- **Cache**: CSS e JS têm cache de 1 ano. Ao alterá-los, aumente o `?v=1` nos links do `index.html` e da política (ex.: `?v=2`). Imagens têm cache de 7 dias.
- **FAQ**: o texto das perguntas está no HTML e repetido no JSON-LD `FAQPage` no `<head>`. Altere nos dois lugares.

## Pontos a confirmar antes de publicar

Os textos foram publicados como estão na copy, **sem** as marcações `[CONFIRMAR]`. Confirme:

1. **Conselho da engenheira (CAU ou CREA)**: aparece na seção Sobre e no rodapé como "CAU A186460-2".
2. **Médico responsável pelo PCMSO**: quem coordena e assina (FAQ, pergunta 1) e se os exames estão inclusos.
3. **Ajustes sem custo, suporte depois da entrega e prazo por escrito** (seções 7 e 9). Publicar só o que será cumprido.
4. **Condições de pagamento e prazo médio** (FAQ, perguntas 6 e 7).
5. **"Você fala com quem faz o trabalho"** e a composição da equipe (seção 5).
6. **Contador "10 setores"** (faixa de confiança).
7. **Autorização** para os logos de clientes e para o caso da gráfica.
8. **Revisão técnica** das respostas do FAQ sobre PGR/PPRA e NR-1.
9. **CNPJ** (`js/config.js`), **Política de Privacidade** (revisão por advogado) e **fotos reais**.
10. **E-mail** `contato@verticeconsultoriaemsst.com.br` funcionando.
11. **H1 com "Melhor Preço"**: se o Google Ads reprovar, trocar por "Preço Justo" ou "Orçamento sem Compromisso".
12. **"Entrega Rápida" e "Garantia de entrega"**: definir prazo médio real e o que a garantia significa.
13. **Texto do hero**: "todos tamanhos" / "Não te deixamos na mão" mantidos como enviados.
14. **Domínio**: canonical, Open Graph, sitemap e JSON-LD usam `https://verticeconsultoriaemsst.com.br/`. Se o domínio for outro, troque nesses arquivos.
15. **Aviso de cookies**: não foi incluído. Se a empresa quiser exibir, definir o texto.

**Não publique** enquanto CNPJ, Política de Privacidade e os itens 1 a 3 não estiverem confirmados.
