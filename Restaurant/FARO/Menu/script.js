document.addEventListener('DOMContentLoaded', () => {
    console.log('🍽️ Menú del Restaurante El Faro cargado correctamente');
    
    initSmoothScroll();
    initAnimationsOnScroll();
    initPrintMenu();
    initImageModal();
});

function initImageModal() {
    const modal = document.getElementById('imagenModal');
    const modalImagen = document.getElementById('modalImagenPrincipal');
    const modalDescripcion = document.getElementById('modalDescripcion');
    const cerrarModalBtn = document.querySelector('.cerrar-modal');
    
    // Seleccionar tanto imágenes de platos como del menú nocturno
    const imagenesPlatos = document.querySelectorAll('.plato-imagen, .comida-imagen');
    
    if (!modal || !modalImagen || !modalDescripcion) {
        console.warn('Elementos del modal no encontrados en el DOM');
        return;
    }
    
    function abrirModal(imgSrc, captionText) {
        if (!imgSrc) {
            console.warn('No se proporcionó fuente de imagen para el modal');
            return;
        }
        
        modalImagen.src = imgSrc;
        modalDescripcion.textContent = captionText || '';
        modal.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
    }
    
    function cerrarModal() {
        modal.classList.remove('abierto');
        document.body.style.overflow = '';
        modal.setAttribute('aria-hidden', 'true');
    }
    
    imagenesPlatos.forEach(imagen => {
        // Buscar el contenedor correcto: .plato-card o .tarjeta-comida-rapida
        const container = imagen.closest('.plato-card, .tarjeta-comida-rapida');
        if (!container) return;
        
        container.style.cursor = 'pointer';
        container.setAttribute('role', 'button');
        container.setAttribute('tabindex', '0');
        
        container.addEventListener('click', () => {
            const imgSrc = imagen.src;
            // Buscar el nombre en ambos selectores posibles
            const nombrePlato = container.querySelector('.plato-nombre, .comida-nombre')?.textContent || '';
            const descripcionPlato = container.querySelector('.plato-descripcion, .comida-descripcion')?.textContent || '';
            const captionText = `${nombrePlato}${descripcionPlato ? ' - ' + descripcionPlato : ''}`;
            
            abrirModal(imgSrc, captionText);
        });
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                container.click();
            }
        });
    });
    
    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener('click', cerrarModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('abierto')) {
            cerrarModal();
        }
    });
    
    console.log(`📸 Modal de imágenes iniciado - ${imagenesPlatos.length} imágenes interactivas`);
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll(
        '.plato-card, .menu-subseccion, .porcion-item, .titulo-seccion-container'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function initPrintMenu() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
    
    const printButton = document.querySelector('.btn-print');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }
}

function initMenuSearch() {
    const searchInput = document.querySelector('.menu-search-input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const platos = document.querySelectorAll('.plato-card');
        platos.forEach(plato => {
            const nombre = plato.querySelector('.plato-nombre').textContent.toLowerCase();
            const descripcion = plato.querySelector('.plato-descripcion').textContent.toLowerCase();
            
            if (nombre.includes(searchTerm) || descripcion.includes(searchTerm)) {
                plato.style.display = 'block';
            } else {
                plato.style.display = 'none';
            }
        });
        
        const bebidas = document.querySelectorAll('.menu-item');
        bebidas.forEach(bebida => {
            const nombre = bebida.querySelector('.item-nombre').textContent.toLowerCase();
            
            if (nombre.includes(searchTerm)) {
                bebida.style.display = 'flex';
            } else {
                bebida.style.display = 'none';
            }
        });
        
        const porciones = document.querySelectorAll('.porcion-item');
        porciones.forEach(porcion => {
            const nombre = porcion.querySelector('.porcion-nombre').textContent.toLowerCase();
            
            if (nombre.includes(searchTerm)) {
                porcion.style.display = 'flex';
            } else {
                porcion.style.display = 'none';
            }
        });
    });
}

function highlightSpecialPrices() {
    const precios = document.querySelectorAll('.plato-precio, .item-precio, .porcion-precio');
    
    precios.forEach(precio => {
        const precioNum = parseInt(precio.textContent.replace(/[^0-9]/g, ''));
        
        if (precioNum < 20000) {
            precio.style.color = '#27ae60';
        }
        
        if (precioNum > 35000) {
            precio.style.fontWeight = '900';
        }
    });
}

function showMenuStats() {
    const totalPlatos = document.querySelectorAll('.plato-card').length;
    const totalBebidas = document.querySelectorAll('.menu-item').length;
    const totalPorciones = document.querySelectorAll('.porcion-item').length;
    
    console.log(`📊 Estadísticas del Menú:`);
    console.log(`   🍽️ Platos: ${totalPlatos}`);
    console.log(`   🥤 Bebidas: ${totalBebidas}`);
    console.log(`   🍴 Porciones: ${totalPorciones}`);
    console.log(`   📋 Total de items: ${totalPlatos + totalBebidas + totalPorciones}`);
}

showMenuStats();

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
        const bebidasSection = document.querySelector('.bebidas');
        if (bebidasSection) {
            bebidasSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey) {
        const platosSection = document.querySelector('.platos');
        if (platosSection) {
            platosSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key.toLowerCase() === 'o' && !e.ctrlKey && !e.metaKey) {
        const porcionesSection = document.querySelector('.porciones');
        if (porcionesSection) {
            porcionesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

function enhanceHoverEffects() {
    const cards = document.querySelectorAll('.plato-card, .menu-subseccion, .porcion-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

enhanceHoverEffects();

/* ========================================
   FUNCIONALIDAD MENÚ NOCTURNO
   ======================================== */

function verificarHorarioNocturno() {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const seccionNocturna = document.querySelector('.seccion-nocturna');
    
    if (!seccionNocturna) return;
    
    // Horario nocturno: 17:00 (5 PM) a 23:00 (11 PM)
    const esHorarioNocturno = horaActual >= 17 && horaActual < 23;
    
    if (esHorarioNocturno) {
        seccionNocturna.style.display = 'block';
        mostrarNotificacionHorario();
    } else {
        seccionNocturna.style.filter = 'grayscale(100%)';
        seccionNocturna.style.opacity = '0.6';
        agregarMensajeHorario();
    }
}

function mostrarNotificacionHorario() {
    const notificacionExistente = document.querySelector('.notificacion-horario');
    if (notificacionExistente) return;
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-horario';
    notificacion.innerHTML = `
        <i class="bi bi-moon-stars-fill"></i>
        <div>
            <strong>¡Menú Nocturno Disponible!</strong>
            <p>Nuestras comidas rápidas están listas para ti</p>
        </div>
        <button class="cerrar-notificacion" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Agregar estilos dinámicamente
    if (!document.querySelector('#estilos-notificacion')) {
        const style = document.createElement('style');
        style.id = 'estilos-notificacion';
        style.textContent = `
            .notificacion-horario {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                display: flex;
                align-items: center;
                gap: 15px;
                max-width: 400px;
                z-index: 9999;
                animation: slideInRight 0.5s ease;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notificacion-horario i.bi-moon-stars-fill {
                font-size: 2em;
                flex-shrink: 0;
            }
            
            .notificacion-horario strong {
                display: block;
                font-size: 1.1em;
                margin-bottom: 5px;
            }
            
            .notificacion-horario p {
                margin: 0;
                font-size: 0.9em;
                opacity: 0.9;
            }
            
            .cerrar-notificacion {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                transition: background 0.3s ease;
            }
            
            .cerrar-notificacion:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            @media (max-width: 768px) {
                .notificacion-horario {
                    bottom: 20px;
                    right: 20px;
                    left: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notificacion.remove(), 500);
        }
    }, 10000);
}

function agregarMensajeHorario() {
    const seccionNocturna = document.querySelector('.seccion-nocturna');
    if (!seccionNocturna) return;
    
    const mensajeExistente = seccionNocturna.querySelector('.mensaje-fuera-horario');
    if (mensajeExistente) return;
    
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-fuera-horario';
    mensaje.innerHTML = `
        <i class="bi bi-moon"></i>
        <h3>Menú no disponible en este momento</h3>
        <p>Nuestro menú nocturno está disponible de 5:00 PM a 11:00 PM</p>
        <p><strong>Vuelve pronto para disfrutar nuestras deliciosas comidas rápidas</strong></p>
    `;
    
    seccionNocturna.insertBefore(mensaje, seccionNocturna.querySelector('.grid-comidas-rapidas'));
    
    // Agregar estilos para el mensaje
    if (!document.querySelector('#estilos-mensaje-horario')) {
        const style = document.createElement('style');
        style.id = 'estilos-mensaje-horario';
        style.textContent = `
            .mensaje-fuera-horario {
                background: rgba(255, 255, 255, 0.9);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                margin: 30px 0;
                border: 3px dashed #667eea;
            }
            
            .mensaje-fuera-horario i {
                font-size: 4em;
                color: #667eea;
                display: block;
                margin-bottom: 20px;
            }
            
            .mensaje-fuera-horario h3 {
                color: #1a1a2e;
                font-size: 2em;
                margin-bottom: 15px;
            }
            
            .mensaje-fuera-horario p {
                color: #555;
                font-size: 1.1em;
                margin: 10px 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Verificar horario al cargar la página
verificarHorarioNocturno();

// Verificar horario cada 5 minutos
setInterval(verificarHorarioNocturno, 300000);

// Smooth scroll para el link del menú nocturno
document.addEventListener('DOMContentLoaded', () => {
    const linkNocturno = document.querySelector('a[href="#comidas-rapidas"]');
    if (linkNocturno) {
        linkNocturno.addEventListener('click', (e) => {
            e.preventDefault();
            const seccion = document.querySelector('#comidas-rapidas');
            if (seccion) {
                seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});