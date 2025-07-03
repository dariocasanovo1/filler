

// ARCHIVO filler.js (súbelo a GitHub o cualquier CDN):
(function(){
  const data = {
    firstName: 'Dario',
    lastName: 'Timoszko',
    fullName: 'Dario Timoszko',
    email: 'dario@szkcgi.com',
    subject: 'A small query..',
    message: 'Hi!\n\nI\'m Darío Timoszko, an architect and 3D artist with 10+ years of experience, specializing in small to medium projects.\n\nI provide high-quality visuals with a personalized approach—no agency fees, just direct collaboration.\n\nWant to test the waters? I\'m happy to create a free sample image (no strings attached) so you can evaluate my work before committing.\n\nExplore my portfolio here (many projects are U.S.-based):\ninstagram.com/szk.cgi\n\nIf you have a project in mind, just reply with a few details and I\'ll get back to you promptly.\n\nBest regards,\nDarío'
  };

  function fill(el, val) {
    el.focus();
    el.value = val;
    ['input', 'change', 'blur'].forEach(e => el.dispatchEvent(new Event(e, {bubbles:true})));
  }

  function getType(el) {
    const c = el.className + ' ' + (el.getAttribute('name') || '');
    const t = document.querySelector(`label[for="${el.id}"]`)?.textContent || '';
    const ctx = (c + ' ' + t).toLowerCase();
    
    if (el.type === 'email' || ctx.includes('email')) return 'email';
    if (ctx.includes('first') && ctx.includes('name')) return 'firstName';
    if (ctx.includes('last') && ctx.includes('name')) return 'lastName';
    if (ctx.includes('name')) return 'name';
    if (ctx.includes('subject')) return 'subject';
    if (el.tagName === 'TEXTAREA' || ctx.includes('message') || ctx.includes('comment')) return 'message';
    return null;
  }

  let count = 0;
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.offsetHeight === 0 || el.name === 'wpforms[hp]') return;
    
    const type = getType(el);
    let val = '';
    
    switch(type) {
      case 'firstName': val = data.firstName; break;
      case 'lastName': val = data.lastName; break;
      case 'name': val = data.fullName; break;
      case 'email': val = data.email; break;
      case 'subject': val = data.subject; break;
      case 'message': val = data.message; break;
    }
    
    if (val) {
      fill(el, val);
      el.style.border = '2px solid #4CAF50';
      setTimeout(() => el.style.border = '', 2000);
      count++;
    }
  });

  const div = document.createElement('div');
  div.innerHTML = `<div style="position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:15px;border-radius:8px;z-index:10000;font-family:Arial">✓ ${count} campos rellenados</div>`;
  document.body.appendChild(div);
  setTimeout(() => document.body.removeChild(div), 3000);
})();