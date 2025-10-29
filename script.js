document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navUl = document.querySelector('nav ul');
  if (mobileMenu && navUl) {
    mobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navUl.classList.toggle('active');
    });
  }

  // Smooth scrolling for links with class smooth-scroll
  const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href.includes('#')) {
        const targetId = href.split('#')[1];
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = href;
      }
    });
  });

  // Gallery lightbox with navigation
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <span class="lightbox-prev">&#10094;</span>
    <span class="lightbox-next">&#10095;</span>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentImageIndex = 0;

  if (galleryImages.length > 0) {
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentImageIndex = parseInt(img.dataset.index);
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightboxPrev.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIndex].src;
      lightboxImg.alt = galleryImages[currentImageIndex].alt;
    });

    lightboxNext.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIndex].src;
      lightboxImg.alt = galleryImages[currentImageIndex].alt;
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // Service booking buttons
  const bookButtons = document.querySelectorAll('.book-btn');
  bookButtons.forEach(button => {
    button.addEventListener('click', () => {
      const service = button.dataset.service;
      window.location.href = `contact.html?service=${service}`;
    });
  });

  // Contact form handling with real-time validation
  const form = document.getElementById('contactForm');
  if (form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const errorMessage = input.nextElementSibling;
        if (input.value.trim()) {
          input.parentElement.classList.remove('error');
          errorMessage.textContent = '';
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      inputs.forEach(input => {
        const errorMessage = input.nextElementSibling;
        if (!input.value.trim()) {
          input.parentElement.classList.add('error');
          errorMessage.textContent = `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required.`;
          isValid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.parentElement.classList.add('error');
          errorMessage.textContent = 'Please enter a valid email address.';
          isValid = false;
        }
      });

      if (isValid) {
        const name = document.getElementById('name').value.trim();
        alert(`Thank you, ${name}! Your message has been sent successfully.`);
        form.reset();
      }
    });

    // Pre-fill service dropdown
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    if (service) {
      const serviceSelect = document.getElementById('service');
      if (serviceSelect) {
        serviceSelect.value = service;
      }
    }

    // Booking availability checker (mock)
    const dateInput = document.getElementById('date');
    const availabilityMessage = document.getElementById('availability-message');
    if (dateInput && availabilityMessage) {
      dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = selectedDate.getDay();
        const isSunday = dayOfWeek === 0;
        const isPast = selectedDate < today;

        if (isPast) {
          availabilityMessage.textContent = 'Please select a future date.';
          availabilityMessage.classList.remove('available');
          availabilityMessage.classList.add('unavailable');
        } else if (isSunday) {
          availabilityMessage.textContent = 'Sorry, we are closed on Sundays.';
          availabilityMessage.classList.remove('available');
          availabilityMessage.classList.add('unavailable');
        } else {
          availabilityMessage.textContent = 'This date is available!';
          availabilityMessage.classList.add('available');
          availabilityMessage.classList.remove('unavailable');
        }
      });
    }
  }
});