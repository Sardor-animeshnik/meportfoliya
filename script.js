document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavbar();
    initScrollAnimations();
    initTypingEffect();
    initProgressBars();
    initProjectFilter();
    initContactForm();
    initModal();
    initCounterAnimation();
    initFloatingElements();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
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

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .stat-card, .education-item, .interest-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Progress bars animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar, .skill-progress');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 500);
                }
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Project filter functionality
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory.includes(filterValue)) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact form functionality with Telegram bot integration
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        submitBtn.disabled = true;

        try {
            // Telegram bot configuration
            const TELEGRAM_BOT_TOKEN = '8365624369:AAGckoth8FiY-eZhWvOB3W5QUW3RRYtHYRs'; // Bu yerga o'z bot tokeningizni qo'ying
            const TELEGRAM_CHAT_ID = '7223847752'; // Bu yerga o'z chat ID'ingizni qo'ying
            
            const telegramMessage = `
🔔 Yangi Portfolio Xabari!

👤 Ism: ${name}
📧 Email: ${email}
📋 Mavzu: ${subject}

💬 Xabar:
${message}

⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}
            `;

            // Send to Telegram
            const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'HTML'
                })
            });

            if (telegramResponse.ok) {
                showNotification('Xabaringiz muvaffaqiyatli yuborildi! Tez orada javob beraman.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Telegram API error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Fallback: mailto link
            const mailtoLink = `mailto:sardor.dev@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Ism: ${name}\nEmail: ${email}\n\nXabar:\n${message}`)}`;
            window.location.href = mailtoLink;
            
            showNotification('Email ilovangiz ochildi. Xabaringizni u yerdan yuborishingiz mumkin.', 'info');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    const projectLinks = document.querySelectorAll('.project-link[title="Batafsil"]');

    if (!modal) return;

    // Sample project data
    const projectData = {
        'E-commerce Platform': {
            image: 'https://via.placeholder.com/600x400/6366f1/ffffff?text=E-commerce+Platform',
            description: 'To\'liq funksional e-commerce platformasi. Foydalanuvchilar mahsulotlarni ko\'rish, savatga qo\'shish, buyurtma berish va to\'lov qilish imkoniyatiga ega. Admin paneli orqali mahsulotlar, buyurtmalar va foydalanuvchilarni boshqarish mumkin.',
            features: [
                'Responsive dizayn',
                'Foydalanuvchi autentifikatsiyasi',
                'Mahsulot katalogi',
                'Savatcha funksiyasi',
                'To\'lov tizimi integratsiyasi',
                'Admin paneli',
                'Buyurtmalar boshqaruvi',
                'Email bildirishnomalar'
            ],
            tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT', 'Express'],
            liveLink: '#',
            githubLink: '#'
        }
        // Boshqa loyihalar uchun ham shunga o'xshash ma'lumotlar qo'shish mumkin
    };

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = link.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            
            openModal(projectTitle, projectData[projectTitle] || {
                image: 'https://via.placeholder.com/600x400/6366f1/ffffff?text=Project',
                description: 'Bu loyiha haqida batafsil ma\'lumot.',
                features: ['Responsive dizayn', 'Modern UI/UX', 'Cross-browser compatibility'],
                tech: ['HTML', 'CSS', 'JavaScript'],
                liveLink: '#',
                githubLink: '#'
            });
        });
    });

    function openModal(title, data) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalImage').src = data.image;
        document.getElementById('modalDescription').textContent = data.description;
        
        // Tech tags
        const modalTech = document.getElementById('modalTech');
        modalTech.innerHTML = '';
        data.tech.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            modalTech.appendChild(tag);
        });

        // Features
        const modalFeatures = document.getElementById('modalFeatures');
        modalFeatures.innerHTML = '';
        data.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });

        // Links
        document.getElementById('modalLiveLink').href = data.liveLink;
        document.getElementById('modalGithubLink').href = data.githubLink;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Counter animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');

    floatingElements.forEach(function (element, index) {
        const speed = element.getAttribute('data-speed') || 1;
        let position = 0;

        setInterval(() => { });
    }
   ) }