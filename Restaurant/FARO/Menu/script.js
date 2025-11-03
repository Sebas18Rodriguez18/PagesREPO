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
    
    const imagenesPlatos = document.querySelectorAll('.plato-imagen');
    
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
        const container = imagen.closest('.plato-card');
        if (!container) return;
        
        container.style.cursor = 'pointer';
        container.setAttribute('role', 'button');
        container.setAttribute('tabindex', '0');
        
        container.addEventListener('click', () => {
            const imgSrc = imagen.src;
            const nombrePlato = container.querySelector('.plato-nombre')?.textContent || '';
            const descripcionPlato = container.querySelector('.plato-descripcion')?.textContent || '';
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