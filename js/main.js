/* Derrete Tudo — Main JS */
(function () {
  'use strict';

  /* ---- Navbar scroll shadow + scroll progress ---- */
  var navbar = document.querySelector('.navbar');
  var scrollProgress = document.getElementById('scrollProgress');
  if (navbar || scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);
      if (scrollProgress) {
        var total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = total > 0 ? (scrollY / total * 100) + '%' : '0%';
      }
    }, { passive: true });
  }

  /* ---- Mobile menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function closeMobileMenu() {
    hamburger && hamburger.classList.remove('open');
    mobileMenu && mobileMenu.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      mobileOverlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  /* ---- Highlight active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Hero slider ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let sliderTimer;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide] && dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide] && dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    if (slides.length < 2) return;
    sliderTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 5000);
  }

  if (slides.length > 0) {
    slides[0].classList.add('active');
    dots[0] && dots[0].classList.add('active');
    startSlider();

    document.querySelector('.slider-btn-next') &&
      document.querySelector('.slider-btn-next').addEventListener('click', function () {
        clearInterval(sliderTimer);
        goToSlide(currentSlide + 1);
        startSlider();
      });

    document.querySelector('.slider-btn-prev') &&
      document.querySelector('.slider-btn-prev').addEventListener('click', function () {
        clearInterval(sliderTimer);
        goToSlide(currentSlide - 1);
        startSlider();
      });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(sliderTimer);
        goToSlide(i);
        startSlider();
      });
    });
  }

  /* ---- Scroll animations ---- */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .stagger-children').forEach(function (el) {
    observer.observe(el);
  });

  /* ---- Animated counters ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ---- Cardápio filter tabs ---- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const menuCategories = document.querySelectorAll('.menu-category');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      menuCategories.forEach(function (cat) {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.style.display = '';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      btn.textContent = 'Enviando...';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Mensagem Enviada!';
        contactForm.reset();
        setTimeout(function () {
          btn.textContent = 'Enviar Mensagem';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  /* ---- Product modal ---- */
  var modalOverlay = document.getElementById('productModal');
  if (modalOverlay) {
    var modalImg    = modalOverlay.querySelector('.modal-img img');
    var modalName   = modalOverlay.querySelector('.modal-name');
    var modalPrice  = modalOverlay.querySelector('.modal-price');
    var modalDesc   = modalOverlay.querySelector('.modal-desc');
    var modalWaBtn  = modalOverlay.querySelector('.modal-btn-wa');
    var modalClose  = modalOverlay.querySelectorAll('.modal-close, .modal-btn-dismiss');

    function openModal(card) {
      var name  = card.dataset.name  || '';
      var price = card.dataset.price || '';
      var desc  = card.dataset.desc  || '';
      var img   = card.dataset.img   || '';
      var waMsg = encodeURIComponent('Olá! Quero pedir um ' + name + '. Podem me ajudar?');

      modalImg.src = img;
      modalImg.alt = name;
      modalName.textContent  = name;
      modalPrice.textContent = price;
      modalDesc.textContent  = desc;
      modalWaBtn.href = 'https://wa.me/5511999990001?text=' + waMsg;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.product-card[data-name]').forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });
    });

    modalClose.forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

})();
