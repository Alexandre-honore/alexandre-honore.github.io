(() => {
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const isEnglish = pathParts[0] === 'en';
  const localizedParts = isEnglish ? pathParts.slice(1) : pathParts;
  const filename = localizedParts[localizedParts.length - 1] || 'index.html';
  const isProjectFolder = localizedParts[0] === 'projects';
  const isHome = !isProjectFolder && filename === 'index.html';
  const localeRoot = isEnglish ? '/en' : '';

  const labels = {
    home: isEnglish ? 'Home' : 'Accueil',
    projects: isEnglish ? 'Projects' : 'Projets',
    skills: isEnglish ? 'Skills' : 'Compétences',
    contact: 'Contact',
    menu: 'Menu',
    switchLang: isEnglish ? 'Switch language to French' : 'Changer en anglais'
  };

  const homeHref = `${localeRoot}/index.html`;
  const projectsHref = `${homeHref}#projects`;
  const skillsHref = `${homeHref}${isEnglish ? '#skills' : '#competences'}`;
  const contactHref = `${homeHref}#contact`;

  const getActiveState = () => {
    const hash = window.location.hash || '';
    const isProjectsActive = isProjectFolder || (isHome && hash === '#projects');
    const isSkillsActive = isHome && hash === (isEnglish ? '#skills' : '#competences');
    const isContactActive = isHome && hash === '#contact';
    const isHomeActive = isHome && !isProjectsActive && !isSkillsActive && !isContactActive;

    return { isHomeActive, isProjectsActive, isSkillsActive, isContactActive };
  };

  const relativePath = localizedParts.join('/') || 'index.html';
  const counterpartHref = isEnglish ? `/${relativePath}` : `/en/${relativePath}`;

  const topbar = document.querySelector('.topbar');
  if (topbar) {
    const active = getActiveState();

    topbar.innerHTML = `
      <div class="container topbar-row">
        <a class="brand" href="${homeHref}">Alexandre Honore</a>
        <button class="mobile-toggle" type="button">${labels.menu}</button>
        <nav class="topnav">
          <a data-nav="home" class="${active.isHomeActive ? 'active' : ''}" href="${homeHref}">${labels.home}</a>
          <a data-nav="projects" class="${active.isProjectsActive ? 'active' : ''}" href="${projectsHref}">${labels.projects}</a>
          <a data-nav="skills" class="${active.isSkillsActive ? 'active' : ''}" href="${skillsHref}">${labels.skills}</a>
          <a data-nav="contact" class="${active.isContactActive ? 'active' : ''}" href="${contactHref}">${labels.contact}</a>
          <span class="spacer" aria-hidden="true"></span>
          <button class="lang-toggle ${isEnglish ? 'is-en' : ''}" type="button" aria-label="${labels.switchLang}">
            <span class="label ${!isEnglish ? 'active' : ''}">FR</span>
            <span class="toggle-track"><span class="toggle-knob"></span></span>
            <span class="label ${isEnglish ? 'active' : ''}">EN</span>
          </button>
        </nav>
      </div>
    `;

    const toggle = topbar.querySelector('.mobile-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        topbar.classList.toggle('open');
      });
    }

    const langToggle = topbar.querySelector('.lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        window.location.href = counterpartHref;
      });
    }

    const updateActiveNav = () => {
      const navState = getActiveState();
      topbar.querySelectorAll('.topnav a[data-nav]').forEach((link) => {
        link.classList.remove('active');
      });

      if (navState.isHomeActive) {
        topbar.querySelector('.topnav a[data-nav="home"]')?.classList.add('active');
      }
      if (navState.isProjectsActive) {
        topbar.querySelector('.topnav a[data-nav="projects"]')?.classList.add('active');
      }
      if (navState.isSkillsActive) {
        topbar.querySelector('.topnav a[data-nav="skills"]')?.classList.add('active');
      }
      if (navState.isContactActive) {
        topbar.querySelector('.topnav a[data-nav="contact"]')?.classList.add('active');
      }
    };

    window.addEventListener('hashchange', updateActiveNav);
  }

  const foot = document.querySelector('.foot');
  if (foot) {
    const currentYear = new Date().getFullYear();
    const cvHref = `/resources/cv_honore_alexandre${isEnglish ? '_en' : ''}.pdf`;

    foot.innerHTML = `
      <section class="site-footer">
        <div class="footer-inner">
          <div class="footer-head">
            <strong>Alexandre Honore</strong>
          </div>
          <div class="footer-grid">
            <article class="footer-block">
              <h4>${isEnglish ? 'Navigation' : 'Navigation'}</h4>
              <div class="footer-links">
                <a href="${homeHref}">${labels.home}</a>
                <a href="${projectsHref}">${labels.projects}</a>
                <a href="${contactHref}">${labels.contact}</a>
              </div>
            </article>
            <article class="footer-block">
              <h4>${isEnglish ? 'Profiles' : 'Profils'}</h4>
              <div class="footer-links">
                <a href="https://www.linkedin.com/in/honore-alexandre/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://alexandre-h.itch.io" target="_blank" rel="noopener noreferrer">itch.io</a>
              </div>
            </article>
            <article class="footer-block">
              <h4>${isEnglish ? 'Resources' : 'Ressources'}</h4>
              <div class="footer-links">
                <a href="${cvHref}" target="_blank" rel="noopener noreferrer">${isEnglish ? 'Resume PDF' : 'CV PDF'}</a>
                <a href="${projectsHref}">${isEnglish ? 'Project catalogue' : 'Catalogue projets'}</a>
              </div>
            </article>
          </div>
          <div class="footer-bottom">
            <span>© ${currentYear} Alexandre Honore</span>
          </div>
        </div>
      </section>
    `;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  if (galleryImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <figure class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Aperçu de l'image">
        <button class="lightbox-close" type="button" data-lightbox-close aria-label="Fermer l'aperçu">×</button>
        <img class="lightbox-image" alt="" />
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButtons = lightbox.querySelectorAll('[data-lightbox-close]');
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      if (lightboxImage) {
        lightboxImage.removeAttribute('src');
        lightboxImage.alt = '';
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = '';
      }
    };

    const openLightbox = (img) => {
      const figure = img.closest('figure');
      const captionText = figure?.querySelector('figcaption')?.textContent?.trim() || '';

      if (lightboxImage) {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt || captionText || 'Aperçu de l\'image';
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText;
        lightboxCaption.hidden = !captionText;
      }

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    };

    galleryImages.forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `${img.alt || 'Aperçu'} - ouvrir en grand`);
      img.addEventListener('click', () => openLightbox(img));
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(img);
        }
      });
    });

    closeButtons.forEach((button) => button.addEventListener('click', closeLightbox));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.hasAttribute('data-lightbox-close')) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }
})();