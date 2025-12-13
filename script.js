// Основной скрипт сайта
document.addEventListener('DOMContentLoaded', function() {
    // 1. Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    
    // Устанавливаем сохраненную тему
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Обработчик переключения
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // 2. Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Учитываем высоту фиксированной шапки
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 3. Форма обратной связи (имитация отправки)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Показываем состояние загрузки
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Имитация отправки
            setTimeout(() => {
                // Показываем успех
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
                submitBtn.style.background = '#27ca3f';
                
                // Сбрасываем форму
                this.reset();
                
                // Возвращаем исходное состояние через 3 секунды
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    
    // 4. Обновление года в футере
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    // 5. Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми карточками проектов
    document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 6. Подсветка активного раздела при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('accent');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('accent');
            }
        });
    });
    
    // 7. Простой параллакс для героя
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });
    
    // 8. Копирование email по клику
    document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
        emailLink.addEventListener('click', function(e) {
            if (this.textContent.includes('example.com')) {
                e.preventDefault();
                
                const originalText = this.textContent;
                this.textContent = 'Скопировано!';
                this.style.color = 'var(--accent)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            }
        });
    });
});