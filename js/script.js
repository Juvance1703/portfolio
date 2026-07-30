document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Animation du nom lettre par lettre (au chargement) ---------- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle){
    const fullText = heroTitle.textContent.trim();
    heroTitle.textContent = '';
    heroTitle.setAttribute('aria-label', fullText);

    const words = fullText.split(' ');
    let letterIndex = 0;

    words.forEach((word, wIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      [...word].forEach((char) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = char;
        letterSpan.style.animationDelay = (letterIndex * 0.045) + 's';
        letterSpan.setAttribute('aria-hidden', 'true');
        wordSpan.appendChild(letterSpan);
        letterIndex++;
      });

      heroTitle.appendChild(wordSpan);
      letterIndex++; // laisse un décalage pour l'espace entre les mots

      if (wIndex < words.length - 1){
        heroTitle.appendChild(document.createTextNode(' '));
      }
    });
  }

  /* ---------- Année automatique dans le footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Barre de progression de scroll ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';

    if (header) header.classList.toggle('scrolled', scrollTop > 10);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop){
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav){
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Lien de navigation actif selon la section visible ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- Animation "reveal" au scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .timeline-item, .timeline-path');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Tracé animé de la timeline (élément signature) ---------- */
  document.getElementById('timelinePath')?.classList.add('animate');
  document.getElementById('timelineBranch')?.classList.add('animate');

  /* ---------- Compteurs animés dans le hero ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
          current += step;
          if (current >= target){
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Validation du formulaire de contact ---------- */
  const form = document.getElementById('contactForm');
  if (form){
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMsg = document.getElementById('formSuccess');

    function setError(input, errorEl, message){
      input.closest('.form-row').classList.toggle('invalid', !!message);
      errorEl.textContent = message || '';
    }

    function validEmail(value){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (nameInput.value.trim().length < 2){
        setError(nameInput, document.getElementById('nameError'), 'Veuillez entrer votre nom.');
        isValid = false;
      } else {
        setError(nameInput, document.getElementById('nameError'), '');
      }

      if (!validEmail(emailInput.value.trim())){
        setError(emailInput, document.getElementById('emailError'), 'Adresse e-mail invalide.');
        isValid = false;
      } else {
        setError(emailInput, document.getElementById('emailError'), '');
      }

      if (messageInput.value.trim().length < 10){
        setError(messageInput, document.getElementById('messageError'), 'Votre message est un peu court.');
        isValid = false;
      } else {
        setError(messageInput, document.getElementById('messageError'), '');
      }

      if (isValid){
        // Adresse fixe qui reçoit tous les messages du formulaire.
        const destinataire = 'juvancerenot1703@gmail.com';

        const nom = nameInput.value.trim();
        const emailVisiteur = emailInput.value.trim();
        const message = messageInput.value.trim();

        const sujet = 'Nouveau message de ' + nom + ' (portfolio)';
        const corps =
          'Nom : ' + nom + '\n' +
          'Email : ' + emailVisiteur + '\n\n' +
          'Message :\n' + message;

        const lienMailto =
          'mailto:' + destinataire +
          '?subject=' + encodeURIComponent(sujet) +
          '&body=' + encodeURIComponent(corps);

        // Ouvre le client mail par défaut du visiteur, déjà rempli et adressé
        // au destinataire fixe ci-dessus ; l'email saisi par le visiteur est
        // repris dans le corps du message pour que l'on sache qui répondre.
        window.location.href = lienMailto;

        successMsg.textContent = 'Votre messagerie va s\'ouvrir pour envoyer le message, merci ' + nom.split(' ')[0] + ' !';
        form.reset();
        setTimeout(() => { successMsg.textContent = ''; }, 5000);
      }
    });
  }

});
