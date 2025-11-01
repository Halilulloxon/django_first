document.addEventListener('DOMContentLoaded', function () {
    const productModal = document.getElementById('productModal');
    let currentModal = null;

    // --- MODAL FUNKSIYALARI ---
    function openModal() {
        if (!productModal) return;
        productModal.classList.add('active');
        productModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        currentModal = productModal;
    }

    function closeModal() {
        if (!currentModal) return;
        currentModal.classList.remove('active');
        currentModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        currentModal = null;
    }

    function populateModalFromCard(card) {
        if (!productModal || !card) return;

        const name = card.dataset.name || '';
        const company = card.dataset.company || '';
        const companyUrl = card.dataset.companyUrl || '';
        const volume = card.dataset.volume || '';
        const price = card.dataset.price || '';
        const discount = card.dataset.discount || '';
        const color = card.dataset.color || 'red';
        const image = card.dataset.image || '';

        const titleEl = productModal.querySelector('.modal-title');
        const companyLinkEl = productModal.querySelector('.modal-company-link');
        const imgEl = productModal.querySelector('.modal-image');
        const descEl = productModal.querySelector('.modal-description');
        const volEl = productModal.querySelector('.modal-volume');
        const gradEl = productModal.querySelector('.modal-image-gradient');

        if (titleEl) titleEl.textContent = name;

        if (companyLinkEl) {
            companyLinkEl.textContent = company || 'RefreshCo';
            if (companyUrl) {
                companyLinkEl.href = companyUrl;
                companyLinkEl.removeAttribute('aria-disabled');
                companyLinkEl.classList.remove('disabled');
            } else {
                companyLinkEl.href = 'javascript:void(0);';
                companyLinkEl.setAttribute('aria-disabled', 'true');
                companyLinkEl.classList.add('disabled');
            }
        }

        if (imgEl) {
            imgEl.src = image;
            imgEl.alt = name || imgEl.alt || 'Rasm mavjud emas';
        }

        if (volEl) volEl.textContent = volume ? volume + ' ml' : '—';

        if (gradEl) {
            gradEl.className = 'modal-image-gradient';
            gradEl.classList.add(`gradient-${color}`);
        }

        if (descEl) {
            const pieces = [];
            const numericPrice = Number(price);
            if (!Number.isNaN(numericPrice) && numericPrice > 0) {
                pieces.push(`Narx: ${numericPrice.toLocaleString('uz-UZ')} so'm`);
            }

            const discountValue = parseInt(discount, 10);
            if (!Number.isNaN(discountValue) && discountValue > 0 && discountValue <= 100) {
                pieces.push(`Chegirma: ${discountValue}%`);
                if (!Number.isNaN(numericPrice) && numericPrice > 0) {
                    const finalPrice = numericPrice - (numericPrice * discountValue / 100);
                    pieces.push(`Chegirmadan keyin: ${finalPrice.toLocaleString('uz-UZ')} so'm`);
                }
            }

            descEl.textContent = pieces.length ? pieces.join(' . ') : 'Qo‘shimcha ma’lumot mavjud emas.';
        }
    }

    // --- MODALNI OCHUVCHI TUGMALAR ---
    const productButtons = document.querySelectorAll('.product-learn-more');
    productButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // avval ichimliklar kartasini qidiramiz
            let card = this.closest('.product-card');

            // agar topilmasa, promo (chegirma) elementini tekshiramiz
            if (!card) {
                card = this.closest('.promo');
            }

            if (!card) return;
            populateModalFromCard(card);
            openModal();
        });
    });

    // --- MODALNI YOPISH ---
    if (productModal) {
        const toggles = productModal.querySelectorAll('[data-modal-close], .modal-overlay, .modal-close');
        toggles.forEach(function (t) {
            t.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal();
            });
        });
    }

    // ESC tugmasi bilan yopish
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    // --- SKROLL, ANIMATSIYA, RIPPLE EFFECT QISMLARI ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const productsSection = document.querySelector('.products');
            if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.products, .brand-story, .promo, .footer');
    sections.forEach(function (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    document.querySelectorAll('.btn').forEach(function (button) {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            this.appendChild(ripple);
            requestAnimationFrame(function () {
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '0';
            });
            setTimeout(function () { ripple.remove(); }, 650);
        });
    });
});
