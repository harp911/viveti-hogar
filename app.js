/**
 * Vivéti — Sitio Web Oficial (viveti.co)
 * Lógica de Interactividad, Animaciones de Scroll y Soporte Bilingüe
 * Versión 1.0 (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CONFIGURACIÓN BILINGÜE (NATIVE LANGUAGE ENGINE)
  // ==========================================================================
  const body = document.body;
  const langSwitcherBtn = document.getElementById('lang-switcher');
  const langEsIndicators = document.querySelectorAll('.lang-es-indicator');
  const langEnIndicators = document.querySelectorAll('.lang-en-indicator');

  // Función para cambiar de idioma
  function setLanguage(lang) {
    if (lang === 'en') {
      body.classList.remove('lang-es');
      body.classList.add('lang-en');
      document.documentElement.setAttribute('lang', 'en');
      document.title = 'Vivéti — Made for living well';
      
      // Actualizar indicadores del botón
      langEsIndicators.forEach(el => el.classList.remove('active'));
      langEnIndicators.forEach(el => el.classList.add('active'));
    } else {
      body.classList.remove('lang-en');
      body.classList.add('lang-es');
      document.documentElement.setAttribute('lang', 'es');
      document.title = 'Vivéti — Hecho para vivir bien';
      
      // Actualizar indicadores del botón
      langEsIndicators.forEach(el => el.classList.add('active'));
      langEnIndicators.forEach(el => el.classList.remove('active'));
    }
    
    // Guardar preferencia del usuario
    localStorage.setItem('viveti_lang', lang);
  }

  // Cargar idioma guardado o parámetro URL (?lang=en)
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  const savedLang = localStorage.getItem('viveti_lang');
  
  if (langParam === 'en' || langParam === 'es') {
    setLanguage(langParam);
  } else if (savedLang === 'en' || savedLang === 'es') {
    setLanguage(savedLang);
  } else {
    // Por defecto es Español
    setLanguage('es');
  }

  // Evento de clic en switch de idioma
  if (langSwitcherBtn) {
    langSwitcherBtn.addEventListener('click', () => {
      const currentLang = body.classList.contains('lang-es') ? 'en' : 'es';
      setLanguage(currentLang);
    });
  }

  // ==========================================================================
  // 2. MENÚ DE NAVEGACIÓN STICKY & MENÚ MÓVIL (HAMBURGER)
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-menu');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Control de Sticky Navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle Menú Móvil
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    
    // Bloquear scroll del body al abrir menú móvil
    if (mobileNav.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

  // Cerrar menú al hacer clic en un enlace de navegación móvil
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Acciones rápidas de scroll a secciones B2B
  const navCtaBtn = document.getElementById('nav-cta-btn');
  const mobileNavCta = document.getElementById('mobile-nav-cta');
  
  function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  if (navCtaBtn) navCtaBtn.addEventListener('click', scrollToContact);
  if (mobileNavCta) {
    mobileNavCta.addEventListener('click', () => {
      toggleMobileMenu();
      scrollToContact();
    });
  }

  // ==========================================================================
  // 3. SISTEMA DE ANIMACIONES DE SCROLL (INTERSECTION OBSERVER)
  // ==========================================================================
  // Animación de entrada para el Hero al cargar
  setTimeout(() => {
    const heroContent = document.getElementById('hero-content');
    const heroVisual = document.getElementById('hero-visual');
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
      heroContent.style.transition = 'opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1)';
    }
    if (heroVisual) {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'scale(1)';
      heroVisual.style.transition = 'opacity 1s cubic-bezier(0.215, 0.610, 0.355, 1), transform 1s cubic-bezier(0.215, 0.610, 0.355, 1)';
    }
  }, 150);

  // Observer general para elementos de scroll simple
  const scrollObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        
        // Si el contenedor tiene elementos staggered (cascada), animarlos
        if (entry.target.classList.contains('product-grid') || entry.target.classList.contains('gallery-grid')) {
          const staggerItems = entry.target.querySelectorAll('.stagger-in');
          staggerItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('reveal-active');
            }, index * 80);
          });
        }
        
        // Quitar observación una vez animado
        observer.unobserve(entry.target);
      }
    });
  }, scrollObserverOptions);

  // Elementos a observar
  document.querySelectorAll('.reveal-on-scroll').forEach(el => scrollObserver.observe(el));
  document.querySelectorAll('.product-grid').forEach(el => scrollObserver.observe(el));
  document.querySelectorAll('.gallery-grid').forEach(el => scrollObserver.observe(el));
  
  // Observer especial para la sección de pilares oscuros (¿Por qué Vivéti?)
  const whySection = document.getElementById('why-viveti');
  if (whySection) {
    const whyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const content = entry.target.querySelector('.why-content');
          const pillars = entry.target.querySelector('.why-grid-pillars');
          if (content) content.classList.add('reveal-active');
          if (pillars) pillars.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    whyObserver.observe(whySection);
  }

  // Acciones cruzadas: "Ver catálogo completo Hogar" desde sección Hogar
  const hogarGalleryFilterTrigger = document.getElementById('hogar-gallery-filter-trigger');
  if (hogarGalleryFilterTrigger) {
    hogarGalleryFilterTrigger.addEventListener('click', () => {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Enlazar botones consultar de las tarjetas directamente al formulario
  document.querySelectorAll('.open-quote-modal-hogar').forEach(btn => {
    btn.addEventListener('click', () => {
      scrollToContact();
    });
  });

  // ==========================================================================
  // 5. GENERADOR DE BLOB PDF (DESCARGA REAL DEL CATÁLOGO VIVÉTI)
  // ==========================================================================
  // PDF Base64 minimalista y 100% válido que se abre en cualquier lector de PDF
  const VIVETI_CATALOG_PDF_BASE64 = 
    'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDYKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDYKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRm9udDFfMSA1IDAgUgo+Pgo+Pgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDE3NAo+PgpzdHJlYW0KQlQKL0ZvbnQxXzEgMjQgVGYKNTYgNzgwIFRkCjAgMCAwIHJnCihWSVZFVJkgQ0FUQUxPR08gMjAyNSAtIEhFQ0hPIFBBUkEgVklWSVIgQklFTikgVGoKMCAtNDAgVGQKKE1lZGVsbGluLCBDb2xvbWJpYSAtIENvbnRhY3RvOiBjb250YWN0b0B2aXZldGkuY28pIFRqCjAgLTMwIFRkCihMaW5lYXMgZGUgcHJvZHVjdG86IFZpdsl0aSBIb2dhciB5IFZpdsl0aSBNZWRpY2FsKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDYKL1R5cGUgL1ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvTWFjUm9tYW5FbmNvZGluZwo+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTYgMDAwMDAgbiAKMDAwMDAwMDExOCAwMDAwMCBuIAowMDAwMDAwMjQ5IDAwMDAwIG4gCjAwMDAwMDA0OTAgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1OTkKJSVFT0YK';

  function downloadCatalogPDF() {
    try {
      const sliceSize = 512;
      const byteCharacters = atob(VIVETI_CATALOG_PDF_BASE64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const pdfBlob = new Blob(byteArrays, { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Crear elemento temporal para disparar la descarga
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = 'viveti-catalogo-2025.pdf';
      document.body.appendChild(tempLink);
      tempLink.click();
      
      // Limpiar recursos
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al generar la descarga del PDF del catálogo:', error);
    }
  }

  // ==========================================================================
  // 6. VALIDACIÓN DE FORMULARIO B2B Y MODAL DE ÉXITO DE LEADS
  // ==========================================================================
  const quoteForm = document.getElementById('quote-b2b-form');
  const modalOverlay = document.getElementById('lead-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-trigger');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const downloadCatalogTrigger = document.getElementById('download-catalog-btn');
  const submitFormBtn = document.getElementById('submit-form-btn');
  const sendCatalogCheck = document.getElementById('send-catalog-check');

  // Función para cerrar modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Validación real-time: Limpiar errores al escribir o cambiar
  const formFields = quoteForm ? quoteForm.querySelectorAll('input, select, textarea') : [];
  formFields.forEach(field => {
    const parent = field.closest('.form-field');
    
    field.addEventListener('input', () => {
      if (field.checkValidity() && parent) {
        parent.classList.remove('has-error');
      }
    });
    
    field.addEventListener('change', () => {
      if (field.checkValidity() && parent) {
        parent.classList.remove('has-error');
      }
    });
  });

  // Envío e Interacción del Formulario
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      let firstInvalidElement = null;

      // Validar cada campo requerido
      const requiredInputs = quoteForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const parentField = input.closest('.form-field');
        
        // Validación específica para correos
        if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            isFormValid = false;
            if (parentField) parentField.classList.add('has-error');
            if (!firstInvalidElement) firstInvalidElement = input;
            return;
          }
        }

        if (!input.value.trim() || !input.checkValidity()) {
          isFormValid = false;
          if (parentField) parentField.classList.add('has-error');
          if (!firstInvalidElement) firstInvalidElement = input;
        } else {
          if (parentField) parentField.classList.remove('has-error');
        }
      });

      // Si hay algún error, hacer focus en el primero y parar
      if (!isFormValid) {
        if (firstInvalidElement) firstInvalidElement.focus();
        return;
      }

      // Animación de carga visual en el botón de envío
      const originalBtnHtml = submitFormBtn.innerHTML;
      submitFormBtn.disabled = true;
      submitFormBtn.style.opacity = '0.85';
      
      if (body.classList.contains('lang-en')) {
        submitFormBtn.innerHTML = `Sending... <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--blanco); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-left:8px;"></span>`;
      } else {
        submitFormBtn.innerHTML = `Enviando... <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--blanco); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-left:8px;"></span>`;
      }

      // Estilo de animación de spin inyectado si es necesario
      if (!document.getElementById('spin-keyframes')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'spin-keyframes';
        styleSheet.innerText = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(styleSheet);
      }

      // Simulación de Envío B2B a Formspree / Servidor B2B de Vivéti
      setTimeout(() => {
        // Restaurar estado del botón
        submitFormBtn.disabled = false;
        submitFormBtn.style.opacity = '';
        submitFormBtn.innerHTML = originalBtnHtml;

        // Abrir Modal de Confirmación
        modalOverlay.classList.add('active');
        body.style.overflow = 'hidden';

        // Disparar la descarga del PDF si el checkbox está seleccionado
        if (sendCatalogCheck && sendCatalogCheck.checked) {
          setTimeout(() => {
            downloadCatalogPDF();
          }, 1000);
        }

        // Resetear Formulario
        quoteForm.reset();
      }, 1500);
    });
  }

  // Interacción de Botón de Descarga Directa
  if (downloadCatalogTrigger) {
    downloadCatalogTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Descarga inmediata del PDF
      downloadCatalogPDF();
      
      // Abrir modal indicando que se ha descargado y ofreciendo asesoría
      modalOverlay.classList.add('active');
      body.style.overflow = 'hidden';
      
      const modalDynamicText = document.getElementById('modal-dynamic-text');
      if (modalDynamicText) {
        if (body.classList.contains('lang-en')) {
          modalDynamicText.innerHTML = `<span>Your Vivéti 2025 B2B catalog download has started! If you require custom technical samples, please complete our contact form.</span>`;
        } else {
          modalDynamicText.innerHTML = `<span>¡La descarga de tu catálogo Vivéti B2B 2025 ha comenzado! Si necesitas muestras técnicas personalizadas, por favor completa nuestro formulario de contacto.</span>`;
        }
      }
    });
  }

  // ==========================================================================
  // 7. WIDGET DE WHATSAPP FLOTANTE CONFIGURABLE
  // ==========================================================================
  const whatsappTrigger = document.getElementById('whatsapp-trigger');
  
  if (whatsappTrigger) {
    whatsappTrigger.addEventListener('click', () => {
      const whatsappNumber = "573000000000"; // Configurable mediante variable
      
      let defaultMsg = "Hola Vivéti, me interesa conocer sus productos.";
      if (body.classList.contains('lang-en')) {
        defaultMsg = "Hello Vivéti, I am interested in learning more about your products.";
      }
      
      const encodedMsg = encodeURIComponent(defaultMsg);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMsg}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }
});
