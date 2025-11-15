// Espera a que todo el contenido HTML se cargue
document.addEventListener('DOMContentLoaded', () => {

    // === 1. Menú Móvil ===
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainers = document.querySelectorAll('.nav-links');
    const body = document.body;

    // Toggle menú móvil
    const toggleMobileMenu = () => {
        navLinksContainers.forEach(nav => nav.classList.toggle('active'));
        hamburger.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        if (Array.from(navLinksContainers).some(nav => nav.classList.contains('active'))) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer clic en un enlace
    navLinksContainers.forEach(navLinks => {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinksContainers.forEach(nav => nav.classList.remove('active'));
                    hamburger.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });
    });

    // === 2. Header con Scroll ===
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Añadir sombra al header cuando se hace scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }

        lastScroll = currentScroll;
    });

    // === 3. Animaciones de Scroll para Secciones ===
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

    // Observar elementos que queremos animar
    const animatedElements = document.querySelectorAll('.service-card, .team-member, .gallery img, .about-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // === 4. Smooth Scroll Mejorado ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces vacíos
            if (href === '#' || !href) return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === 5. Contador Animado para Estadísticas ===
    const animateCounter = (element) => {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = element.textContent.replace(/\d+/, target);
            }
        };

        updateCounter();
    };

    // Observar los números de las estadísticas
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.feature-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // === 6. Modal de Agendamiento ===
    const modal = document.getElementById('modalAgendamiento');
    const botonesAgendar = document.querySelectorAll('a[href="#contacto"]');
    const closeBtn = document.querySelector('.modal-close');
    const btnCancelar = document.querySelector('.btn-cancelar');
    const formAgendamiento = document.getElementById('formAgendamiento');

    // Abrir modal
    botonesAgendar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            body.style.overflow = 'hidden';
            
            // Establecer fecha mínima (hoy)
            const fechaInput = document.getElementById('fecha');
            const hoy = new Date().toISOString().split('T')[0];
            fechaInput.setAttribute('min', hoy);
        });
    });

    // Cerrar modal
    const cerrarModal = () => {
        modal.classList.remove('show');
        body.style.overflow = '';
    };

    closeBtn.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            cerrarModal();
        }
    });

    // === 7. Notificación Toast ===
    const toast = document.getElementById('toast');
    
    const mostrarNotificacion = () => {
        // Asegurarse de que el toast esté visible
        toast.style.display = 'flex';
        
        // Forzar reflow para que la animación funcione
        void toast.offsetWidth;
        
        // Agregar clase show
        toast.classList.add('show');
        
        // Ocultar después de 4 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            // Ocultar completamente después de la animación
            setTimeout(() => {
                toast.style.display = '';
            }, 500);
        }, 4000);
    };

    // Manejar envío del formulario
    formAgendamiento.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(formAgendamiento);
        const datos = Object.fromEntries(formData.entries());
        
        // Aquí puedes enviar los datos a un servidor o servicio
        console.log('Datos del agendamiento:', datos);
        
        // Limpiar formulario y cerrar modal primero
        formAgendamiento.reset();
        cerrarModal();
        
        // Mostrar notificación elegante después de cerrar el modal
        setTimeout(() => {
            mostrarNotificacion();
        }, 400);
    });

});