// AVENA front end: oat stalk, menu, gallery, forms and mobile nav. Each part runs only on pages that need it.
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const today = new Date().toISOString().slice(0, 10);

  // Oat stalk (home page hero)
  const grains = $('grains');
  if (grains) {
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 9; i++) {
      const y = 60 + i * 38;
      [-1, 1].forEach(side => {
        const e = document.createElementNS(NS, 'ellipse');
        e.setAttribute('cx', 100 + side * 24);
        e.setAttribute('cy', y + (side > 0 ? 18 : 0));
        e.setAttribute('rx', 8);
        e.setAttribute('ry', 22);
        e.setAttribute('transform', `rotate(${side * 28} ${100 + side * 24} ${y})`);
        grains.appendChild(e);
      });
    }
  }

  // Menu
  const tabs = document.querySelector('.tabs');
  const list = $('dishes');
  if (tabs && list) {
    let menu = null;
    const renderCategory = id => {
      const cat = menu.categories.find(c => c.id === id);
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.id === id)));
      list.innerHTML = '';
      cat.items.forEach(item => {
        const li = document.createElement('li');
        const title = document.createElement('h3');
        title.textContent = item.name;
        item.tags.forEach(t => {
          const s = document.createElement('span');
          s.className = 'tag';
          s.textContent = t;
          title.appendChild(s);
        });
        const price = document.createElement('span');
        price.className = 'price';
        price.textContent = menu.currency + item.price;
        const desc = document.createElement('p');
        desc.textContent = item.desc;
        li.append(title, price, desc);
        list.appendChild(li);
      });
    };
    fetch('data/menu.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        menu = data;
        data.categories.forEach((c, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.role = 'tab';
          b.dataset.id = c.id;
          b.textContent = c.name;
          b.addEventListener('click', () => renderCategory(c.id));
          tabs.appendChild(b);
          if (i === 0) renderCategory(c.id);
        });
      })
      .catch(() => { list.innerHTML = '<li><p>The menu could not load. Refresh the page or ask us in the restaurant.</p></li>'; });
  }

  // Gallery
  const gallery = $('gallery-list');
  if (gallery) {
    fetch('data/gallery.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(items => items.forEach(p => {
        const li = document.createElement('li');
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src = p.src;
        img.alt = p.alt;
        img.width = 800;
        img.height = 600;
        img.loading = 'lazy';
        const cap = document.createElement('figcaption');
        cap.textContent = p.caption;
        fig.append(img, cap);
        li.appendChild(fig);
        gallery.appendChild(li);
      }))
      .catch(() => { gallery.innerHTML = '<li>The gallery could not load.</li>'; });
  }

  // Forms: validate, send to the server, fall back to localStorage on static hosting
  function wireForm(form, statusEl, endpoint, storageKey, check, success) {
    if (!form) return;
    const show = (msg, type) => { statusEl.textContent = msg; statusEl.className = 'status ' + type; };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const problem = check(data);
      if (problem) return show(problem, 'error');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const out = await res.json();
        if (!res.ok) return show(out.error, 'error');
      } catch {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        saved.push(data);
        localStorage.setItem(storageKey, JSON.stringify(saved));
      }
      show(success(data), 'ok');
      form.reset();
      if (form.elements.guests) form.elements.guests.value = 2;
    });
  }

  const reserve = $('reserve-form');
  if (reserve) reserve.elements.date.min = today;
  wireForm(reserve, $('form-status'), '/api/reservations', 'avena-bookings',
    d => (!d.name.trim() || !d.email || !d.date || !d.time) ? 'Fill in your name, email, date and time.' : (d.date < today ? 'Choose today or a later date.' : ''),
    d => `Thanks ${d.name.trim()}. We have your request for ${d.guests} on ${d.date} at ${d.time} and will confirm by email.`);

  wireForm($('contact-form'), $('contact-status'), '/api/messages', 'avena-messages',
    d => (!d.name.trim() || !d.email || d.message.trim().length < 10) ? 'Fill in your name, email and a message of at least 10 characters.' : '',
    d => `Thanks ${d.name.trim()}. We have your message and will reply by email.`);

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = $('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  $('year').textContent = new Date().getFullYear();
})();
