// form-filler.js - Guarda este archivo en GitHub
(function() {
  'use strict';
  
  // ===== CONFIGURACIÓN =====
  const FORM_DATA = {
    firstName: 'Dario',
    lastName: 'Timoszko',
    fullName: 'Dario Timoszko',
    email: 'dario@szkcgi.com',
    phone: '843.819.4002',
    subject: 'A small query..',
    company: 'SZK CGI',
    website: 'instagram.com/szk.cgi',
    message: `Hi!

I'm Darío Timoszko, an architect and 3D artist with 10+ years of experience, specializing in small to medium projects.

I provide high-quality visuals with a personalized approach—no agency fees, just direct collaboration.

Want to test the waters? I'm happy to create a free sample image (no strings attached) so you can evaluate my work before committing.

Explore my portfolio here (many projects are U.S.-based):
instagram.com/szk.cgi

If you have a project in mind, just reply with a few details and I'll get back to you promptly.

Best regards,
Darío`
  };

  // ===== DETECTORES UNIVERSALES =====
  
  // Detectores por atributos comunes
  const FIELD_PATTERNS = {
    name: {
      selectors: [
        'input[name*="name"]:not([name*="last"]):not([name*="first"])',
        'input[placeholder*="name" i]:not([placeholder*="last" i]):not([placeholder*="first" i])',
        'input[id*="name"]:not([id*="last"]):not([id*="first"])',
        'input[class*="name"]:not([class*="last"]):not([class*="first"])'
      ],
      keywords: ['name', 'nombre', 'nom'],
      value: 'fullName'
    },
    firstName: {
      selectors: [
        'input[name*="first" i]',
        'input[placeholder*="first" i]',
        'input[id*="first" i]',
        'input[class*="first" i]',
        '.wpforms-field-name-first input',
        '.wixui-text-input__input[placeholder*="first" i]'
      ],
      keywords: ['first', 'primer', 'prénom'],
      value: 'firstName'
    },
    lastName: {
      selectors: [
        'input[name*="last" i]',
        'input[placeholder*="last" i]',
        'input[id*="last" i]',
        'input[class*="last" i]',
        '.wpforms-field-name-last input',
        '.wixui-text-input__input[placeholder*="last" i]'
      ],
      keywords: ['last', 'apellido', 'surname'],
      value: 'lastName'
    },
    email: {
      selectors: [
        'input[type="email"]',
        'input[name*="email" i]',
        'input[placeholder*="email" i]',
        'input[id*="email" i]',
        'input[class*="email" i]',
        '.wpforms-field-email input',
        '.wixui-text-input__input[type="email"]'
      ],
      keywords: ['email', 'e-mail', 'correo', 'mail'],
      value: 'email'
    },
    phone: {
      selectors: [
        'input[type="tel"]',
        'input[name*="phone" i]',
        'input[name*="tel" i]',
        'input[placeholder*="phone" i]',
        'input[placeholder*="tel" i]',
        'input[id*="phone" i]',
        'input[class*="phone" i]'
      ],
      keywords: ['phone', 'tel', 'teléfono', 'móvil', 'celular'],
      value: 'phone'
    },
    subject: {
      selectors: [
        'input[name*="subject" i]',
        'input[placeholder*="subject" i]',
        'input[id*="subject" i]',
        'input[class*="subject" i]'
      ],
      keywords: ['subject', 'asunto', 'tema', 'sujet'],
      value: 'subject'
    },
    company: {
      selectors: [
        'input[name*="company" i]',
        'input[placeholder*="company" i]',
        'input[id*="company" i]',
        'input[class*="company" i]'
      ],
      keywords: ['company', 'empresa', 'organization', 'compañía'],
      value: 'company'
    },
    website: {
      selectors: [
        'input[name*="website" i]',
        'input[placeholder*="website" i]',
        'input[id*="website" i]',
        'input[type="url"]'
      ],
      keywords: ['website', 'url', 'web', 'site'],
      value: 'website'
    },
    message: {
      selectors: [
        'textarea',
        'input[name*="message" i]',
        'input[placeholder*="message" i]',
        'input[name*="comment" i]',
        'input[placeholder*="comment" i]',
        '.wpforms-field-textarea textarea',
        '.wixui-text-box__input'
      ],
      keywords: ['message', 'comment', 'mensaje', 'comentario', 'description'],
      value: 'message'
    }
  };

  // ===== FUNCIONES PRINCIPALES =====
  
  function getFieldContext(element) {
    const contexts = [];
    
    // Atributos del elemento
    ['name', 'id', 'class', 'placeholder', 'aria-label', 'data-field', 'type'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) contexts.push(value);
    });
    
    // Labels asociados
    const labelFor = document.querySelector(`label[for="${element.id}"]`);
    if (labelFor) contexts.push(labelFor.textContent);
    
    // Label contenedor
    const parentLabel = element.closest('label');
    if (parentLabel) contexts.push(parentLabel.textContent);
    
    // Contenedores de campo (WordPress, Wix, etc.)
    const fieldContainers = element.closest('[class*="field"], [class*="form-group"], [class*="input-group"], [class*="wixui"], [class*="wpforms"]');
    if (fieldContainers) {
      const containerLabels = fieldContainers.querySelectorAll('label');
      containerLabels.forEach(label => {
        if (!element.contains(label)) contexts.push(label.textContent);
      });
    }
    
    return contexts.join(' ').toLowerCase();
  }
  
  function identifyFieldType(element) {
    const context = getFieldContext(element);
    
    // Buscar por selectores específicos primero
    for (const [fieldType, config] of Object.entries(FIELD_PATTERNS)) {
      for (const selector of config.selectors) {
        if (element.matches(selector)) {
          return fieldType;
        }
      }
    }
    
    // Buscar por palabras clave en el contexto
    for (const [fieldType, config] of Object.entries(FIELD_PATTERNS)) {
      for (const keyword of config.keywords) {
        if (context.includes(keyword)) {
          return fieldType;
        }
      }
    }
    
    return null;
  }
  
  function isFieldVisible(element) {
    const style = window.getComputedStyle(element);
    return element.offsetHeight > 0 && 
           element.offsetWidth > 0 && 
           style.display !== 'none' && 
           style.visibility !== 'hidden' &&
           style.opacity !== '0';
  }
  
  function isHoneypot(element) {
    const honeypotPatterns = [
      'wpforms[hp]',
      'honeypot',
      'bot-field',
      'spam-check'
    ];
    
    const name = element.getAttribute('name') || '';
    const className = element.className || '';
    const id = element.id || '';
    
    return honeypotPatterns.some(pattern => 
      name.includes(pattern) || 
      className.includes(pattern) || 
      id.includes(pattern)
    ) || !isFieldVisible(element);
  }
  
  function fillField(element, value) {
    try {
      // Enfocar el campo
      element.focus();
      
      // Limpiar valor anterior
      element.value = '';
      
      // Establecer nuevo valor
      element.value = value;
      
      // Disparar eventos para diferentes frameworks
      const events = [
        'input', 'change', 'keyup', 'blur', 'keydown'
      ];
      
      events.forEach(eventType => {
        const event = new Event(eventType, { 
          bubbles: true, 
          cancelable: true 
        });
        element.dispatchEvent(event);
      });
      
      // Eventos específicos para React/Vue
      const reactEvent = new Event('input', { bubbles: true });
      Object.defineProperty(reactEvent, 'target', { value: element });
      element.dispatchEvent(reactEvent);
      
      // Validar que el valor se estableció
      if (element.value !== value) {
        // Intentar método alternativo para campos problemáticos
        const descriptor = Object.getOwnPropertyDescriptor(element, 'value') || 
                          Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
        if (descriptor && descriptor.set) {
          descriptor.set.call(element, value);
        }
      }
      
      return true;
    } catch (error) {
      console.warn('Error filling field:', error);
      return false;
    }
  }
  
  function showNotification(filledFields) {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 16px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="font-weight: bold; margin-bottom: 8px;">
          ✓ Formulario Completado
        </div>
        <div style="font-size: 13px; opacity: 0.9;">
          ${filledFields.length} campos rellenados:<br>
          ${filledFields.join('<br>')}
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => document.body.removeChild(notification), 300);
      }
    }, 4000);
  }
  
  // ===== FUNCIÓN PRINCIPAL =====
  
  function fillAllForms() {
    const filledFields = [];
    
    // Buscar todos los campos de entrada
    const allFields = document.querySelectorAll('input, textarea, select');
    
    allFields.forEach(field => {
      // Saltar campos no válidos
      if (isHoneypot(field) || field.type === 'hidden' || field.type === 'submit') {
        return;
      }
      
      const fieldType = identifyFieldType(field);
      
      if (fieldType && FIELD_PATTERNS[fieldType]) {
        const valueKey = FIELD_PATTERNS[fieldType].value;
        const value = FORM_DATA[valueKey];
        
        if (value && fillField(field, value)) {
          filledFields.push(fieldType);
          
          // Resaltar campo rellenado
          const originalBorder = field.style.border;
          const originalBackground = field.style.backgroundColor;
          
          field.style.border = '2px solid #4CAF50';
          field.style.backgroundColor = '#f0fff0';
          
          setTimeout(() => {
            field.style.border = originalBorder;
            field.style.backgroundColor = originalBackground;
          }, 2000);
        }
      }
    });
    
    // Mostrar resultado
    if (filledFields.length > 0) {
      showNotification(filledFields);
      console.log('Form Filler: Campos rellenados:', filledFields);
    } else {
      showNotification(['No se encontraron campos compatibles']);
    }
  }
  
  // ===== EJECUTAR =====
  fillAllForms();
  
})();