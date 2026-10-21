(function () {
  'use strict';

  var CFG = window.VERTICE_CONFIG || {};
  var WA_NUMBER = CFG.WHATSAPP || '5562981338625';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Rastreamento (gtag carregado de forma assíncrona) ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var tagId = CFG.GOOGLE_ADS_ID || CFG.GA4_ID;
  if (tagId) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(tagId);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    if (CFG.GOOGLE_ADS_ID) window.gtag('config', CFG.GOOGLE_ADS_ID);
    if (CFG.GA4_ID) window.gtag('config', CFG.GA4_ID);
  }

  function track(eventName, params) {
    if (!tagId) return;
    window.gtag('event', eventName, params || {});
    var label = CFG.CONVERSION_LABELS && CFG.CONVERSION_LABELS[eventName];
    if (CFG.GOOGLE_ADS_ID && label) {
      window.gtag('event', 'conversion', { send_to: CFG.GOOGLE_ADS_ID + '/' + label });
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (/^https:\/\/wa\.me\//.test(href)) track('clique_whatsapp');
    else if (href.indexOf('tel:') === 0) track('clique_telefone');
    else if (href.indexOf('mailto:') === 0) track('clique_email');
  });

  /* ---------- Parâmetros de campanha (UTM e gclid) ---------- */
  var CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  var campaign = {};
  try { campaign = JSON.parse(sessionStorage.getItem('vertice_campaign') || '{}') || {}; } catch (err) { campaign = {}; }
  var params = new URLSearchParams(window.location.search);
  CAMPAIGN_KEYS.forEach(function (k) { if (params.get(k)) campaign[k] = params.get(k).slice(0, 200); });
  try { sessionStorage.setItem('vertice_campaign', JSON.stringify(campaign)); } catch (err) { /* armazenamento indisponível */ }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu-mobile');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Config: CNPJ e logos ---------- */
  if (CFG.CNPJ) {
    document.querySelectorAll('[data-cnpj]').forEach(function (el) {
      el.querySelector('span').textContent = CFG.CNPJ;
      el.hidden = false;
    });
  }
  if (CFG.SHOW_CLIENT_LOGOS) {
    var logos = document.getElementById('logos-clientes');
    if (logos) logos.hidden = false;
  }

  /* ---------- Acordeão: uma pergunta aberta por vez (reforço para navegadores sem details[name]) ---------- */
  var faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqItems.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });

  /* ---------- Animações de entrada e contadores ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js-anim');

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal, .steps').forEach(function (el) { revealObs.observe(el); });

    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countObs.unobserve(en.target);
        animateCount(en.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObs.observe(el); });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 1000, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = '0' + suffix;
    requestAnimationFrame(frame);
  }

  /* ---------- Cards de serviço: preenche o "Serviço de interesse" ---------- */
  var servicoSelect = document.getElementById('final-servico');
  document.querySelectorAll('[data-servico]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (servicoSelect) servicoSelect.value = a.getAttribute('data-servico');
    });
  });

  /* ---------- Formulários ---------- */
  function onlyDigits(v) { return (v || '').replace(/\D/g, ''); }

  function formatPhone(v) {
    var d = onlyDigits(v).slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var ERROR_ICON = '<svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg>';

  function fieldError(input) {
    var v = input.value.trim();
    if (input.hasAttribute('data-whatsapp')) {
      var n = onlyDigits(v).length;
      return (n === 10 || n === 11) ? '' : input.getAttribute('data-error');
    }
    if (input.type === 'email') {
      return (!v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) ? '' : input.getAttribute('data-error');
    }
    if (input.required && !v) return input.getAttribute('data-error');
    return '';
  }

  function showError(input, msg) {
    var box = document.getElementById(input.id + '-erro');
    if (!box) return;
    if (msg) {
      box.innerHTML = ERROR_ICON + '<span></span>';
      box.querySelector('span').textContent = msg;
      box.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      box.hidden = true;
      input.removeAttribute('aria-invalid');
    }
  }

  function whatsappUrl(data) {
    var msg = 'Olá! Vim pelo site e gostaria de um orçamento.';
    msg += '\nNome: ' + data.nome;
    if (data.empresa) msg += '\nEmpresa: ' + data.empresa;
    if (data.servico) msg += '\nServiço: ' + data.servico;
    msg += '\nFuncionários: ' + data.funcionarios;
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  document.querySelectorAll('.lead-form').forEach(function (form) {
    var fields = form.querySelectorAll('input:not([name="website"]), select');
    var success = form.querySelector('.form-success');
    var submitBtn = form.querySelector('[type="submit"]');
    var sending = false;

    form.querySelectorAll('[data-whatsapp]').forEach(function (input) {
      input.addEventListener('input', function () { input.value = formatPhone(input.value); });
    });
    fields.forEach(function (input) {
      // Limpa o erro assim que o valor fica válido (no "blur" o botão de envio se deslocaria e perderia o clique).
      input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
        if (input.getAttribute('aria-invalid') === 'true' && !fieldError(input)) showError(input, '');
      });
      if (input.tagName !== 'SELECT') {
        input.addEventListener('blur', function () {
          if (input.value && input.getAttribute('aria-invalid') !== 'true') showError(input, fieldError(input));
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;

      var firstInvalid = null;
      fields.forEach(function (input) {
        var msg = fieldError(input);
        showError(input, msg);
        if (msg && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = String(v).trim(); });
      data.origem = form.getAttribute('data-origem');
      data.pagina = window.location.href.slice(0, 500);
      CAMPAIGN_KEYS.forEach(function (k) { data[k] = campaign[k] || ''; });

      var waUrl = whatsappUrl(data);
      sending = true;
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');

      var controller = 'AbortController' in window ? new AbortController() : null;
      var timer = controller ? setTimeout(function () { controller.abort(); }, 6000) : null;

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller ? controller.signal : undefined
      }).catch(function () { /* falhou: segue para o WhatsApp mesmo assim */ })
        .then(function () {
          if (timer) clearTimeout(timer);
          track('lead_formulario', { origem: data.origem });
          success.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check-circle"/></svg>' +
            '<div><p>Recebemos seu pedido. Em instantes você será levado ao WhatsApp para falar com a nossa equipe.</p>' +
            '<a target="_blank" rel="noopener">Abrir o WhatsApp</a></div>';
          success.querySelector('a').href = waUrl;
          success.hidden = false;
          form.reset();
          sending = false;
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          setTimeout(function () { window.location.href = waUrl; }, 1500);
        });
    });
  });
})();
