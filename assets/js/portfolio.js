(() => {
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const isEnglish = pathParts[0] === 'en';
  const localizedParts = isEnglish ? pathParts.slice(1) : pathParts;
  const filename = localizedParts[localizedParts.length - 1] || 'index.html';
  const isProjectFolder = localizedParts[0] === 'projects';
  const isProjectsIndex = isProjectFolder && filename === 'index.html';
  const isHome = !isProjectFolder && filename === 'index.html';
  const localeRoot = isEnglish ? '/en' : '';

  const labels = {
    home: isEnglish ? 'Home' : 'Accueil',
    projects: isEnglish ? 'Projects' : 'Projets',
    skills: isEnglish ? 'Skills' : 'Competences',
    contact: 'Contact',
    menu: 'Menu',
    switchLang: isEnglish ? 'Switch language to French' : 'Changer en anglais'
  };

  const homeHref = `${localeRoot}/index.html`;
  const projectsHref = `${localeRoot}/projects/index.html`;
  const skillsHref = `${homeHref}${isEnglish ? '#skills' : '#competences'}`;
  const contactHref = `${homeHref}#contact`;

  const relativePath = localizedParts.join('/') || 'index.html';
  const counterpartHref = isEnglish ? `/${relativePath}` : `/en/${relativePath}`;

  const topbar = document.querySelector('.topbar');
  if (topbar) {
    topbar.innerHTML = `
      <div class="container topbar-row">
        <a class="brand" href="${homeHref}">Alexandre Honore</a>
        <button class="mobile-toggle" type="button">${labels.menu}</button>
        <nav class="topnav">
          <a class="${isHome ? 'active' : ''}" href="${homeHref}">${labels.home}</a>
          <a class="${isProjectsIndex || isProjectFolder ? 'active' : ''}" href="${projectsHref}">${labels.projects}</a>
          <a href="${skillsHref}">${labels.skills}</a>
          <a href="${contactHref}">${labels.contact}</a>
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
})();