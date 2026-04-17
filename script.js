(() => {
  const CONFIG = {
    endpoint: '', // Укажите webhook / API CRM endpoint, чтобы заявки отправлялись в CRM автоматически.
    method: 'POST'
  };

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const menuToggle = qs('[data-menu-toggle]');
  const mobileNav = qs('[data-mobile-nav]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    qsa('a', mobileNav).forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const phoneDigits = (value) => value.replace(/\D/g, '');

  const attachUtmParams = (form) => {
    const params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      const field = form.elements[key];
      if (field) field.value = params.get(key) || '';
    });
  };

  const validateForm = (form) => {
    const name = form.elements.name;
    const phone = form.elements.phone;
    const email = form.elements.email;
    const consent = form.elements.consent;
    const honeypot = form.elements.company_website;

    if (honeypot && honeypot.value.trim()) {
      return { valid: false, message: 'Ошибка отправки. Попробуйте еще раз.' };
    }

    if (!name || name.value.trim().length < 2) {
      return { valid: false, message: 'Введите имя.' };
    }

    if (!phone || phoneDigits(phone.value).length < 10) {
      return { valid: false, message: 'Введите корректный телефон.' };
    }

    if (email && email.value.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!ok) {
        return { valid: false, message: 'Введите корректный email.' };
      }
    }

    if (!consent || !consent.checked) {
      return { valid: false, message: 'Подтвердите согласие с политикой конфиденциальности.' };
    }

    return { valid: true, message: '' };
  };

  const serializeForm = (form) => {
    const data = new FormData(form);
    const payload = {};

    for (const [key, value] of data.entries()) {
      if (!value || key === 'consent' || key === 'company_website') continue;
      payload[key] = String(value).trim();
    }

    payload.page = window.location.href;
    payload.submitted_at = new Date().toISOString();
    payload.form_type = form.dataset.form || 'unknown';

    return payload;
  };

  const setMessage = (form, text, type) => {
    const message = qs('.form-message', form);
    if (!message) return;
    message.textContent = text;
    message.classList.remove('is-success', 'is-error');
    if (type) message.classList.add(type === 'success' ? 'is-success' : 'is-error');
  };

  const submitToEndpoint = async (payload) => {
    const response = await fetch(CONFIG.endpoint, {
      method: CONFIG.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json().catch(() => ({}));
  };

  qsa('.demo-form').forEach((form) => {
    attachUtmParams(form);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = qs('button[type="submit"]', form);
      const validation = validateForm(form);

      if (!validation.valid) {
        setMessage(form, validation.message, 'error');
        return;
      }

      const payload = serializeForm(form);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = 'Отправляем...';
      }

      try {
        if (CONFIG.endpoint) {
          await submitToEndpoint(payload);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 650));
          console.info('TMS lead payload', payload);
        }

        form.reset();
        attachUtmParams(form);
        setMessage(form, 'Спасибо! Мы получили заявку и свяжемся с вами для согласования demo.', 'success');
      } catch (error) {
        setMessage(form, 'Не удалось отправить заявку. Попробуйте еще раз или напишите нам на tmsasub@yandex.ru.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || 'Отправить';
        }
      }
    });
  });
})();
