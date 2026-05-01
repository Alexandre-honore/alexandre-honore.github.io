(() => {
  if (window.__portfolioCarouselInitialized) {
    return;
  }

  // Carousel functionality
  const isEnglish = window.location.pathname.includes('/en/');

  const projectsDataFR = [
    {
      id: 'it-takes-io',
      title: 'It Takes IO',
      category: 'C++',
      tags: ['C++', 'SFML', 'Coop locale'],
      description: 'Puzzle-plateformer à deux basé sur la logique électronique et la communication.',
      image: 'images/iti_main.jpg',
      link: 'projects/it-takes-io.html'
    },
    {
      id: 'le-nectar-des-etoiles',
      title: 'Le Nectar des Étoiles',
      category: 'Unreal Engine',
      tags: ['Unreal Engine', 'Narratif', 'Jam 48h'],
      description: 'Jeu narratif à fins multiples, 1re place WonderJam Hiver 2026.',
      image: 'images/nde_main.jpg',
      link: 'projects/le-nectar-des-etoiles.html'
    },
    {
      id: 'pokebot-discord',
      title: 'PokeBot Discord',
      category: 'JavaScript',
      tags: ['JavaScript', 'MongoDB', 'Discord'],
      description: 'Boucle de progression persistante: collection, économie et zones de difficulté.',
      image: 'images/pkb_profile.png',
      link: 'projects/pokebot-discord.html'
    },
    {
      id: 'isiweb4shop',
      title: 'IsIWeb4Shop',
      category: 'PHP',
      tags: ['PHP', 'MySQL', 'E-commerce'],
      description: 'Boutique en ligne fonctionnelle avec panier, commandes et factures PDF.',
      image: 'images/isiweb4shop/isi_acceuil.png',
      link: 'projects/isiweb4shop.html'
    }
  ];

  const projectsDataEN = [
    {
      id: 'it-takes-io',
      title: 'It Takes IO',
      category: 'C++',
      tags: ['C++', 'SFML', 'Local co-op'],
      description: 'Two-player puzzle platformer based on logic circuits and communication.',
      image: '../images/iti_main.jpg',
      link: 'projects/it-takes-io.html'
    },
    {
      id: 'le-nectar-des-etoiles',
      title: 'Le Nectar des Étoiles',
      category: 'Unreal Engine',
      tags: ['Unreal Engine', 'Narrative', '48h Jam'],
      description: 'Choice-driven narrative prototype, 1st place at WonderJam Winter 2026.',
      image: '../images/nde_main.jpg',
      link: 'projects/le-nectar-des-etoiles.html'
    },
    {
      id: 'pokebot-discord',
      title: 'PokeBot Discord',
      category: 'JavaScript',
      tags: ['JavaScript', 'MongoDB', 'Discord'],
      description: 'Persistent progression loop combining collection, economy, and upgrades.',
      image: '../images/pkb_profile.png',
      link: 'projects/pokebot-discord.html'
    },
    {
      id: 'isiweb4shop',
      title: 'IsIWeb4Shop',
      category: 'PHP',
      tags: ['PHP', 'MySQL', 'E-commerce'],
      description: 'Functional online shop with cart, orders and PDF invoice generation.',
      image: '../images/isiweb4shop/isi_acceuil.png',
      link: 'projects/isiweb4shop.html'
    }
  ];

  const projectsData = isEnglish ? projectsDataEN : projectsDataFR;
  const buttonText = isEnglish ? 'Open case study' : 'Voir le projet';

  const initCarousel = () => {
    try {
      console.log('[carousel] initCarousel start', { pathname: window.location.pathname });
      const categoriesNav = document.getElementById('categoriesNav');
      const carouselWrapper = document.getElementById('carouselWrapper');

      console.log('[carousel] elements', { categoriesNav: !!categoriesNav, carouselWrapper: !!carouselWrapper });

      if (!categoriesNav || !carouselWrapper) {
        console.warn('[carousel] containers missing, aborting init');
        return;
      }

    // Get unique categories in order
    const categories = [...new Set(projectsData.map(p => p.category))];
    let currentCategoryIndex = 0;

    // Helper: build a track element filled with cards for a category
    const buildTrackForCategory = (category) => {
      const track = document.createElement('div');
      track.className = 'carousel-track';
      track.setAttribute('role', 'list');
      const categoryProjects = projectsData.filter(p => p.category === category);
      categoryProjects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'carousel-card';
        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}" />
          <div class="carousel-card-body">
            <div class="tag-row">
              ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <h3>${project.title}</h3>
            <p class="lead">${project.description}</p>
            <a class="button secondary" href="${project.link}" style="margin-top: auto;">
              ${buttonText}
            </a>
          </div>
        `;
        track.appendChild(card);
      });
      return track;
    };

    // Render categories buttons
    categories.forEach((category, index) => {
      const btn = document.createElement('button');
      btn.className = `category-btn${index === 0 ? ' active' : ''}`;
      btn.textContent = category;
      btn.type = 'button';
      btn.addEventListener('click', () => selectCategory(index));
      categoriesNav.appendChild(btn);
    });

    console.log('[carousel] categories', categories);
    // Insert initial track
    let currentTrack = buildTrackForCategory(categories[0]);
    currentTrack.classList.add('to-center');
    carouselWrapper.appendChild(currentTrack);

    let incomingTrack = null;
    let isTransitioning = false;

    const startTransition = () => {
      carouselWrapper.classList.add('is-transitioning');
      isTransitioning = true;
    };

    const endTransition = () => {
      carouselWrapper.classList.remove('is-transitioning');
      isTransitioning = false;
    };

    const selectCategory = (index) => {
      if (index === currentCategoryIndex || isTransitioning) return;
      const direction = index > currentCategoryIndex ? 'left' : 'right';
      const wrapperWidth = carouselWrapper.clientWidth;

      startTransition();

      // prepare incoming track
      incomingTrack = buildTrackForCategory(categories[index]);
      incomingTrack.style.transition = 'none';
      incomingTrack.style.transform = `translateX(${direction === 'left' ? wrapperWidth + 'px' : -wrapperWidth + 'px'})`;
      carouselWrapper.appendChild(incomingTrack);

      // force reflow
      void incomingTrack.offsetWidth;

      // enable transitions
      incomingTrack.style.transition = '';
      currentTrack.style.transition = '';

      // animate
      incomingTrack.style.transform = 'translateX(0px)';
      currentTrack.style.transform = `translateX(${direction === 'left' ? -wrapperWidth + 'px' : wrapperWidth + 'px'})`;

      // update buttons
      const categoryButtons = categoriesNav.querySelectorAll('.category-btn');
      categoryButtons.forEach((btn, i) => btn.classList.toggle('active', i === index));

      const oldTrack = currentTrack;
      const incomingRef = incomingTrack;
      const handler = (ev) => {
        try {
          console.log('[carousel] selectCategory cleanup', { oldTrackChildren: oldTrack.childElementCount, incomingChildren: incomingRef.childElementCount });
          oldTrack.remove();
        } catch (e) { console.warn('[carousel] failed to remove oldTrack', e); }
        currentTrack = incomingRef;
        incomingTrack = null;
        currentCategoryIndex = index;
        endTransition();
        try { ev.target.removeEventListener('transitionend', handler); } catch (e) {}
      };

      incomingRef.addEventListener('transitionend', handler);
    };

    // Pointer drag for interactive sliding
    let pointerDown = false;
    let dragStartX = 0;
    let lastDx = 0;
    let dragDirection = null; // 'left' or 'right'

    const onPointerDown = (e) => {
      if (isTransitioning) return;
      pointerDown = true;
      dragStartX = e.clientX;
      lastDx = 0;
      dragDirection = null;
      carouselWrapper.setPointerCapture && carouselWrapper.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - dragStartX;
      lastDx = dx;
      const absDx = Math.abs(dx);
      const wrapperWidth = carouselWrapper.clientWidth;

      // determine direction and create incoming track lazily
      if (!incomingTrack && absDx > 8) {
        if (dx < 0 && currentCategoryIndex < categories.length - 1) dragDirection = 'left';
        else if (dx > 0 && currentCategoryIndex > 0) dragDirection = 'right';
        else dragDirection = null;

        if (dragDirection) {
          incomingTrack = buildTrackForCategory(categories[dragDirection === 'left' ? currentCategoryIndex + 1 : currentCategoryIndex - 1]);
          // stop CSS transitions while dragging
          incomingTrack.style.transition = 'none';
          currentTrack.style.transition = 'none';
          incomingTrack.style.transform = `translateX(${dragDirection === 'left' ? wrapperWidth + 'px' : -wrapperWidth + 'px'})`;
          carouselWrapper.appendChild(incomingTrack);
        }
      }

      if (incomingTrack && dragDirection) {
        // move both tracks according to dx
        const wrapperW = wrapperWidth;
        currentTrack.style.transform = `translateX(${dx}px)`;
        incomingTrack.style.transform = `translateX(${(dragDirection === 'left' ? wrapperW + dx : -wrapperW + dx)}px)`;
      }
    };

    const onPointerUp = (e) => {
      if (!pointerDown) return;
      pointerDown = false;
      carouselWrapper.releasePointerCapture && carouselWrapper.releasePointerCapture(e.pointerId);
      const wrapperWidth = carouselWrapper.clientWidth;
      const commitThreshold = Math.max(80, wrapperWidth * 0.25);

      if (!incomingTrack || !dragDirection) {
        // no meaningful drag
        return;
      }

      // decide to commit or revert
      if (Math.abs(lastDx) > commitThreshold) {
        // commit
        startTransition();
        // enable transitions
        incomingTrack.style.transition = '';
        currentTrack.style.transition = '';

        incomingTrack.style.transform = 'translateX(0px)';
        currentTrack.style.transform = dragDirection === 'left' ? `translateX(${-wrapperWidth}px)` : `translateX(${wrapperWidth}px)`;

        const oldTrack = currentTrack;
        const incomingRef = incomingTrack;
        const handler = (ev) => {
          try {
            console.log('[carousel] commit cleanup', { oldTrackChildren: oldTrack.childElementCount, incomingChildren: incomingRef.childElementCount });
            oldTrack.remove();
          } catch (e) { console.warn('[carousel] failed to remove oldTrack', e); }
          currentTrack = incomingRef;
          incomingTrack = null;
          currentCategoryIndex = dragDirection === 'left' ? currentCategoryIndex + 1 : currentCategoryIndex - 1;
          endTransition();
          try { ev.target.removeEventListener('transitionend', handler); } catch (e) {}
        };

        incomingRef.addEventListener('transitionend', handler);
      } else {
        // revert
        startTransition();
        incomingTrack.style.transition = '';
        currentTrack.style.transition = '';
        incomingTrack.style.transform = dragDirection === 'left' ? `${wrapperWidth}px` : `${-wrapperWidth}px`;
        currentTrack.style.transform = 'translateX(0px)';

        const incomingRef = incomingTrack;
        const handler = (ev) => {
          try { console.log('[carousel] revert cleanup', { incomingChildren: incomingRef.childElementCount }); } catch (e) {}
          try { incomingRef.remove(); } catch (e) { console.warn('[carousel] failed to remove incomingRef', e); }
          incomingTrack = null;
          endTransition();
          try { ev.target.removeEventListener('transitionend', handler); } catch (e) {}
        };

        incomingRef.addEventListener('transitionend', handler);
      }
    };

    carouselWrapper.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
  } catch (err) {
    console.error('[carousel] init error', err);
  }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

})();

(() => {
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const isWindowsFilePath = /^[A-Za-z]:$/.test(pathParts[0] || '');
  const folderDepth = Math.max(pathParts.length - (isWindowsFilePath ? 3 : 1), 0);
  const faviconHref = `${'../'.repeat(folderDepth)}assets/favicon.svg`;

  if (!document.querySelector('link[rel="icon"][type="image/svg+xml"]')) {
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/svg+xml';
    faviconLink.href = faviconHref;
    document.head.appendChild(faviconLink);
  }

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