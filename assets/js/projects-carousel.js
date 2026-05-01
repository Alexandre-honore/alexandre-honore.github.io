(() => {
  const pathname = window.location.pathname;
  const isEnglish = pathname.includes('/en/');
  const basePath = isEnglish ? '..' : '.';

  const projectsData = isEnglish
    ? [
        {
          category: 'C++',
          title: 'It Takes IO',
          tags: ['C++', 'SFML', 'Local co-op'],
          description: 'Two-player puzzle where signals 0 and 1 travel through logic circuits.',
          image: `${basePath}/images/iti_main.jpg`,
          link: 'projects/it-takes-io.html',
        },
        {
          category: 'Java',
          title: 'sokIOban',
          tags: ['Java', 'Swing', 'Puzzle'],
          description: 'Sokoban clone with modular architecture and asset management.',
          image: `${basePath}/images/sokIOban/sk_room0.png`,
          link: 'projects/sokIOban.html',
        },
        {
          category: 'Unreal Engine',
          title: 'Le Nectar des Étoiles',
          tags: ['Unreal Engine', 'Narrative', '48h Jam'],
          description: 'Choice-driven narrative game, 1st place at WonderJam Winter 2026.',
          image: `${basePath}/images/nde_main.jpg`,
          link: 'projects/le-nectar-des-etoiles.html',
        },
        {
          category: 'JavaScript',
          title: 'PokeBot Discord',
          tags: ['JavaScript', 'MongoDB', 'Discord'],
          description: 'Persistent bot with collection, economy, and area-based progression.',
          image: `${basePath}/images/pkb_profile.png`,
          link: 'projects/pokebot-discord.html',
        },
        {
          category: 'PHP',
          title: 'IsIWeb4Shop',
          tags: ['PHP', 'MySQL', 'E-commerce'],
          description: 'Functional online shop with cart, orders, and PDF invoice generation.',
          image: `${basePath}/images/isiweb4shop/isi_acceuil.png`,
          link: 'projects/isiweb4shop.html',
        },
      ]
    : [
        {
          category: 'C++',
          title: 'It Takes IO',
          tags: ['C++', 'SFML', 'Coop locale'],
          description: 'Puzzle coop où deux signaux 0/1 traversent des circuits logiques.',
          image: `${basePath}/images/iti_main.jpg`,
          link: 'projects/it-takes-io.html',
        },
        {
          category: 'Java',
          title: 'sokIOban',
          tags: ['Java', 'Swing', 'Puzzle'],
          description: 'Clone de Sokoban avec architecture modulaire et gestion d\'assets.',
          image: `${basePath}/images/sokIOban/sk_room0.png`,
          link: 'projects/sokIOban.html',
        },
        {
          category: 'Unreal Engine',
          title: 'Le Nectar des Étoiles',
          tags: ['Unreal Engine', 'Narratif', 'Jam 48h'],
          description: 'Jeu narratif à choix multiples, 1re place WonderJam hiver 2026.',
          image: `${basePath}/images/nde_main.jpg`,
          link: 'projects/le-nectar-des-etoiles.html',
        },
        {
          category: 'JavaScript',
          title: 'PokeBot Discord',
          tags: ['JavaScript', 'MongoDB', 'Discord'],
          description: 'Bot avec économie persistante, collection et progression par zones.',
          image: `${basePath}/images/pkb_profile.png`,
          link: 'projects/pokebot-discord.html',
        },
        {
          category: 'PHP',
          title: 'IsIWeb4Shop',
          tags: ['PHP', 'MySQL', 'E-commerce'],
          description: 'Boutique en ligne fonctionnelle avec panier, commandes et factures PDF.',
          image: `${basePath}/images/isiweb4shop/isi_acceuil.png`,
          link: 'projects/isiweb4shop.html',
        },
      ];

  const cardHintText = isEnglish ? 'Open project' : 'Ouvrir le projet';
  const categories = [...new Set(projectsData.map((project) => project.category))];

  const categoriesNav = document.getElementById('categoriesNav');
  const carouselWrapper = document.getElementById('carouselWrapper');
  const carouselTrack = document.getElementById('carouselTrack');

  if (!categoriesNav || !carouselWrapper || !carouselTrack) {
    return;
  }

  window.__portfolioCarouselInitialized = true;

  const createCard = (project) => {
    const card = document.createElement('article');
    card.className = 'carousel-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', `${cardHintText}: ${project.title}`);
    card.dataset.projectLink = project.link;
    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" draggable="false" />
      <div class="carousel-card-body">
        <div class="tag-row">
          ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <h3>${project.title}</h3>
        <p class="lead">${project.description}</p>
        <div class="card-hint" aria-hidden="true">
          <span>${cardHintText}</span>
          <span class="card-hint-icon">→</span>
        </div>
      </div>
    `;
    return card;
  };

  const openProjectCard = (card) => {
    const projectLink = card?.dataset?.projectLink;

    if (projectLink) {
      window.location.href = projectLink;
    }
  };

  const buildTrackForCategory = (category) => {
    const track = document.createElement('div');
    track.className = 'carousel-track';
    track.setAttribute('role', 'list');

    projectsData
      .filter((project) => project.category === category)
      .forEach((project) => {
        track.appendChild(createCard(project));
      });

    return track;
  };

  categoriesNav.innerHTML = '';
  categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.className = `category-btn${index === 0 ? ' active' : ''}`;
    button.type = 'button';
    button.textContent = category;
    button.addEventListener('click', () => selectCategory(index));
    categoriesNav.appendChild(button);
  });

  const navPrevButton = carouselWrapper.querySelector('.carousel-nav-prev');
  const navNextButton = carouselWrapper.querySelector('.carousel-nav-next');

  const handleNavPrev = () => {
    selectCategory(getWrappedCategoryIndex(currentCategoryIndex - 1));
  };

  const handleNavNext = () => {
    selectCategory(getWrappedCategoryIndex(currentCategoryIndex + 1));
  };

  if (navPrevButton) navPrevButton.addEventListener('click', handleNavPrev);
  if (navNextButton) navNextButton.addEventListener('click', handleNavNext);

  const initialCategory = categories[0];
  carouselTrack.innerHTML = '';
  projectsData
    .filter((project) => project.category === initialCategory)
    .forEach((project) => {
      carouselTrack.appendChild(createCard(project));
    });

  let currentTrack = carouselTrack;
  let incomingTrack = null;
  let currentCategoryIndex = 0;
  let isTransitioning = false;
  let pointerDown = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDistance = 0;
  let dragDirection = null;
  let isScrolling = null;

  const setActiveCategoryButton = (index) => {
    categoriesNav.querySelectorAll('.category-btn').forEach((button, buttonIndex) => {
      button.classList.toggle('active', buttonIndex === index);
    });
  };

  const getWrappedCategoryIndex = (index) => (index + categories.length) % categories.length;

  const getDraggedCategoryIndex = (direction) => {
    if (direction === 'left') {
      return getWrappedCategoryIndex(currentCategoryIndex + 1);
    }

    return getWrappedCategoryIndex(currentCategoryIndex - 1);
  };

  const calculateHeightForCategory = (category) => {
    const projectCount = projectsData.filter((project) => project.category === category).length;
    const cardHeight = 380;
    const padding = 32;
    return cardHeight + padding;
  };

  const updateCarouselHeight = (category) => {
    const height = calculateHeightForCategory(category);
    carouselWrapper.style.minHeight = `${height}px`;
  };

  updateCarouselHeight(initialCategory);

  const startTransition = () => {
    carouselWrapper.classList.add('is-transitioning');
    isTransitioning = true;
  };

  const endTransition = () => {
    carouselWrapper.classList.remove('is-transitioning');
    isTransitioning = false;
  };

  const removeIncomingTrack = () => {
    if (incomingTrack && incomingTrack.parentNode) {
      incomingTrack.parentNode.removeChild(incomingTrack);
    }
    incomingTrack = null;
  };

  const selectCategory = (index) => {
    if (index === currentCategoryIndex || isTransitioning) {
      return;
    }

    const direction = index > currentCategoryIndex ? 'left' : 'right';
    const wrapperWidth = carouselWrapper.clientWidth;
    const nextIndex = getWrappedCategoryIndex(index);

    startTransition();
    updateCarouselHeight(categories[nextIndex]);
    setActiveCategoryButton(nextIndex);

    incomingTrack = buildTrackForCategory(categories[nextIndex]);
    incomingTrack.style.transition = 'none';
    incomingTrack.style.transform = `translateX(${direction === 'left' ? wrapperWidth : -wrapperWidth}px)`;
    carouselWrapper.appendChild(incomingTrack);

    void incomingTrack.offsetWidth;

    incomingTrack.style.transition = '';
    currentTrack.style.transition = '';
    incomingTrack.style.transform = 'translateX(0px)';
    currentTrack.style.transform = `translateX(${direction === 'left' ? -wrapperWidth : wrapperWidth}px)`;

    const oldTrack = currentTrack;
    const nextTrack = incomingTrack;
    const handleTransitionEnd = (event) => {
      if (event.target !== nextTrack) {
        return;
      }

      if (oldTrack.parentNode) {
        oldTrack.parentNode.removeChild(oldTrack);
      }

      currentTrack = nextTrack;
      incomingTrack = null;
      currentCategoryIndex = nextIndex;
      endTransition();
      nextTrack.removeEventListener('transitionend', handleTransitionEnd);
    };

    nextTrack.addEventListener('transitionend', handleTransitionEnd);
  };

  const onPointerDown = (event) => {
    if (isTransitioning) {
      return;
    }

    // Ignore clicks on navigation buttons
    if (event.target.closest('.carousel-nav')) {
      return;
    }

    const pressedCard = event.target.closest('.carousel-card');

    pointerDown = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragDistance = 0;
    dragDirection = null;
    isScrolling = null;
    onPointerDown.pressedCard = pressedCard;
    
    currentTrack.classList.add('grabbing');
    document.body.classList.add('carousel-dragging');

    if (carouselWrapper.setPointerCapture) {
      try {
        carouselWrapper.setPointerCapture(event.pointerId);
      } catch (error) {
        // Ignore pointer-capture failures for synthetic or unsupported pointer streams.
      }
    }
  };

  const onPointerMove = (event) => {
    if (!pointerDown) {
      return;
    }

    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    dragDistance = dx;

    if (isScrolling === null) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDy > absDx && absDy > 3) {
        isScrolling = true;
      } else if (absDx > absDy && absDx > 3) {
        isScrolling = false;
      }
    }

    if (isScrolling === true) {
      return;
    }

    if (Math.abs(dx) > 8 && !incomingTrack) {
      if (dx < 0) {
        dragDirection = 'left';
      } else if (dx > 0) {
        dragDirection = 'right';
      } else {
        dragDirection = null;
      }

      if (dragDirection) {
        const nextIndex = getDraggedCategoryIndex(dragDirection);
        const nextCategory = categories[nextIndex];
        incomingTrack = buildTrackForCategory(nextCategory);
        incomingTrack.style.transition = 'none';
        currentTrack.style.transition = 'none';
        incomingTrack.style.transform = `translateX(${dragDirection === 'left' ? carouselWrapper.clientWidth : -carouselWrapper.clientWidth}px)`;
        incomingTrack.classList.add('grabbing');
        carouselWrapper.appendChild(incomingTrack);
      }
    }

    if (incomingTrack && dragDirection) {
      const wrapperWidth = carouselWrapper.clientWidth;
      currentTrack.style.transform = `translateX(${dx}px)`;
      incomingTrack.style.transform = `translateX(${dragDirection === 'left' ? wrapperWidth + dx : -wrapperWidth + dx}px)`;
    }
  };

  const commitOrRevertDrag = (event) => {
    if (!pointerDown) {
      return;
    }

    const pressedCard = onPointerDown.pressedCard;
    const releasedCard = document.elementFromPoint(event.clientX, event.clientY)?.closest('.carousel-card');

    pointerDown = false;
    currentTrack.classList.remove('grabbing');
    if (incomingTrack) {
      incomingTrack.classList.remove('grabbing');
    }
    document.body.classList.remove('carousel-dragging');

    if (carouselWrapper.releasePointerCapture) {
      try {
        carouselWrapper.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Ignore pointer-capture failures for synthetic or unsupported pointer streams.
      }
    }

    const wrapperWidth = carouselWrapper.clientWidth;
    const commitThreshold = Math.max(80, wrapperWidth * 0.25);

    if (!incomingTrack || !dragDirection) {
      if (pressedCard && pressedCard === releasedCard && Math.abs(dragDistance) < commitThreshold) {
        openProjectCard(pressedCard);
      }

      onPointerDown.pressedCard = null;
      currentTrack.style.transition = '';
      return;
    }

    if (Math.abs(dragDistance) > commitThreshold) {
      startTransition();
      incomingTrack.style.transition = '';
      currentTrack.style.transition = '';
      incomingTrack.style.transform = 'translateX(0px)';
      currentTrack.style.transform = dragDirection === 'left' ? `translateX(${-wrapperWidth}px)` : `translateX(${wrapperWidth}px)`;
      const nextIndex = getDraggedCategoryIndex(dragDirection);

      const oldTrack = currentTrack;
      const nextTrack = incomingTrack;
      const handleTransitionEnd = (transitionEvent) => {
        if (transitionEvent.target !== nextTrack) {
          return;
        }

        if (oldTrack.parentNode) {
          oldTrack.parentNode.removeChild(oldTrack);
        }

        currentTrack = nextTrack;
        incomingTrack = null;
        currentCategoryIndex = nextIndex;
        dragDirection = null;
        updateCarouselHeight(categories[currentCategoryIndex]);
        setActiveCategoryButton(currentCategoryIndex);
        endTransition();
        onPointerDown.pressedCard = null;
        nextTrack.removeEventListener('transitionend', handleTransitionEnd);
      };

      nextTrack.addEventListener('transitionend', handleTransitionEnd);
      return;
    }

    startTransition();
    incomingTrack.style.transition = '';
    currentTrack.style.transition = '';
    incomingTrack.style.transform = dragDirection === 'left' ? `translateX(${wrapperWidth}px)` : `translateX(${-wrapperWidth}px)`;
    currentTrack.style.transform = 'translateX(0px)';

    const nextTrack = incomingTrack;
    const handleTransitionEnd = (transitionEvent) => {
      if (transitionEvent.target !== nextTrack) {
        return;
      }

      removeIncomingTrack();
      dragDirection = null;
      onPointerDown.pressedCard = null;
      endTransition();
      nextTrack.removeEventListener('transitionend', handleTransitionEnd);
    };

    nextTrack.addEventListener('transitionend', handleTransitionEnd);
  };

  carouselWrapper.addEventListener('pointerdown', onPointerDown, { passive: true });
  carouselWrapper.addEventListener('keydown', (event) => {
    const activeCard = document.activeElement?.closest?.('.carousel-card');

    if (!activeCard) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectCard(activeCard);
    }
  });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', commitOrRevertDrag, { passive: true });
  window.addEventListener('pointercancel', commitOrRevertDrag, { passive: true });
})();