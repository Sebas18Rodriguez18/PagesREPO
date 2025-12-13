document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 Restaurante Campestre El Faro cargado. Version 100% Mejorada.")

  const navbar = document.querySelector(".navbar-campestre")
  const heroSection = document.getElementById("hero")
  const btnVolverArriba = document.getElementById("btnVolverArriba")
  const btnMenuMobile = document.getElementById("btnMenu")
  const navLinks = document.querySelector(".nav-links")

  if (btnMenuMobile && navLinks) {
    btnMenuMobile.addEventListener("click", () => {
      const isExpanded = navLinks.classList.toggle("activo")
      btnMenuMobile.setAttribute("aria-expanded", isExpanded)

      const icon = btnMenuMobile.querySelector("i")
      if (isExpanded) {
        icon.className = "bi bi-x-lg"
      } else {
        icon.className = "bi bi-list"
      }
    })

    const enlaces = navLinks.querySelectorAll(".nav-link")
    enlaces.forEach((enlace) => {
      enlace.addEventListener("click", () => {
        navLinks.classList.remove("activo")
        btnMenuMobile.setAttribute("aria-expanded", "false")
        const icon = btnMenuMobile.querySelector("i")
        icon.className = "bi bi-list"
      })
    })
  }

  const enlacesNav = document.querySelectorAll('a[href^="#"]')

  enlacesNav.forEach((enlace) => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }
    })
  })

  if (heroSection && navbar) {
    const heroObserverOptions = {
      rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px`,
      threshold: 0,
    }

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          navbar.classList.add("scrolled")
        } else {
          navbar.classList.remove("scrolled")
        }
      })
    }, heroObserverOptions)

    heroObserver.observe(heroSection)
  }

  if (heroSection && btnVolverArriba) {
    const scrollObserverOptions = {
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    }

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          btnVolverArriba.classList.add("show")
        } else {
          btnVolverArriba.classList.remove("show")
        }
      })
    }, scrollObserverOptions)

    scrollObserver.observe(heroSection)

    btnVolverArriba.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    })
  }
  
  const modal = document.getElementById("imagenModal")
  const modalImagen = document.getElementById("modalImagenPrincipal")
  const modalDescripcion = document.getElementById("modalDescripcion")
  const cerrarModalBtn = document.querySelector(".cerrar-modal")
  
  // Función para abrir modal con imágenes
  function abrirModal(imgSrc, captionText) {
    if (!modal || !modalImagen || !modalDescripcion || !imgSrc) return;
    
    modalImagen.src = imgSrc;
    modalDescripcion.textContent = captionText || '';
    modal.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
  }
  
  function cerrarModal() {
    if (!modal) return;
    modal.classList.remove('abierto');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
  }
  
  // Manejar todas las imágenes (platos y menú nocturno)
  const todasLasImagenes = document.querySelectorAll('.plato-imagen, .comida-imagen');
  
  todasLasImagenes.forEach(imagen => {
    const container = imagen.closest('.plato-card, .tarjeta-comida-rapida');
    if (!container) return;
    
    container.style.cursor = 'pointer';
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    
    container.addEventListener('click', () => {
      const imgSrc = imagen.src;
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
  
  // Cerrar modal
  if (cerrarModalBtn) {
    cerrarModalBtn.addEventListener('click', cerrarModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal();
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('abierto')) {
      cerrarModal();
    }
  });

  // Manejar platos con data-modal-target (si existen)
  const platosConModal = document.querySelectorAll('[data-modal-target="true"]')

  if (modal && modalImagen && modalDescripcion) {
    platosConModal.forEach(plato => {
      plato.addEventListener("click", () => {
        let imgSrc = plato.dataset.fullImg
        
        if (!imgSrc) {
          const imgElement = plato.querySelector('img')
          if (imgElement) {
            imgSrc = imgElement.src
          }
        }
        
        const captionText = plato.dataset.caption || plato.querySelector(".plato-nombre")?.textContent || plato.getAttribute('aria-label') || ''
        
        if (imgSrc) {
          abrirModal(imgSrc, captionText)
        } else {
          console.warn("No se encontró imagen para mostrar en el modal", plato)
        }
      })

      plato.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          plato.click()
        }
      })
    })
  }

})

function compartir(red) {
  const url = encodeURIComponent(window.location.href)
  const titulo = encodeURIComponent("Restaurante Campestre El Faro - Criadero Los 3")
  const texto = encodeURIComponent("¡Descubre los mejores sabores campestres en El Faro!")

  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${texto}`,
    whatsapp: `https://wa.me/?text=${texto + "%20" + url}`,
    email: `mailto:?subject=${titulo}&body=${texto + "%20" + url}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${titulo}&summary=${texto}`
  }

  if (urls[red]) {
    window.open(urls[red], '_blank')
  } else {
    console.error("Red social no soportada para compartir.")
  }
}

document.addEventListener("gesturestart", (e) => {
  e.preventDefault()
})

// Funcionalidad del Menú Nocturno
function verificarHorarioNocturno() {
  const ahora = new Date()
  const hora = ahora.getHours()
  const seccionNocturna = document.querySelector('.seccion-nocturna')
  
  if (seccionNocturna) {
    const esHorarioNocturno = hora >= 17 && hora < 23
    
    if (esHorarioNocturno) {
      seccionNocturna.classList.add('horario-activo')
      mostrarNotificacionHorario('🌙 ¡Menú nocturno disponible ahora!')
    } else {
      seccionNocturna.classList.add('horario-inactivo')
      agregarMensajeHorario()
    }
  }
}

function mostrarNotificacionHorario(mensaje) {
  const notificacion = document.createElement('div')
  notificacion.className = 'notificacion-horario'
  notificacion.innerHTML = `
    <i class="bi bi-moon-stars-fill"></i>
    <span>${mensaje}</span>
  `
  notificacion.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: linear-gradient(135deg, #004c99, #3377bb);
    color: white;
    padding: 15px 25px;
    border-radius: 50px;
    box-shadow: 0 8px 25px rgba(0, 76, 153, 0.4);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    animation: slideInRight 0.5s ease-out;
  `
  
  document.body.appendChild(notificacion)
  
  setTimeout(() => {
    notificacion.style.animation = 'slideOutRight 0.5s ease-out'
    setTimeout(() => notificacion.remove(), 500)
  }, 5000)
}

function agregarMensajeHorario() {
  const seccionNocturna = document.querySelector('.seccion-nocturna')
  if (!seccionNocturna) return
  
  const mensajeExistente = seccionNocturna.querySelector('.mensaje-horario-cerrado')
  if (mensajeExistente) return
  
  const mensaje = document.createElement('div')
  mensaje.className = 'mensaje-horario-cerrado'
  mensaje.innerHTML = `
    <i class="bi bi-clock-history"></i>
    <h3>Menú Nocturno No Disponible</h3>
    <p>Este menú está disponible de 5:00 PM a 11:00 PM</p>
    <p class="horario-restante">Vuelve en el horario nocturno para disfrutar de nuestras comidas rápidas</p>
  `
  mensaje.style.cssText = `
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 76, 153, 0.8));
    color: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    margin: 30px 0;
    backdrop-filter: blur(10px);
    border: 3px solid var(--naranja-principal);
  `
  
  const grid = seccionNocturna.querySelector('.grid-comidas-rapidas')
  if (grid) {
    grid.style.opacity = '0.4'
    grid.style.pointerEvents = 'none'
    grid.style.filter = 'grayscale(100%)'
    seccionNocturna.insertBefore(mensaje, grid)
  }
}

const styleHorario = document.createElement('style')
styleHorario.textContent = `
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
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  .mensaje-horario-cerrado h3 {
    font-size: 2rem;
    margin: 15px 0;
    color: var(--naranja-principal);
  }
  
  .mensaje-horario-cerrado p {
    font-size: 1.1rem;
    margin: 10px 0;
    line-height: 1.6;
  }
  
  .mensaje-horario-cerrado i {
    font-size: 3rem;
    color: var(--naranja-principal);
  }
  
  .horario-restante {
    font-style: italic;
    opacity: 0.9;
    font-size: 1rem !important;
  }
`
document.head.appendChild(styleHorario)

verificarHorarioNocturno()
setInterval(verificarHorarioNocturno, 300000)

const enlacesNocturno = document.querySelectorAll('a[href="#comidas-rapidas"]')
enlacesNocturno.forEach(enlace => {
  enlace.addEventListener('click', (e) => {
    e.preventDefault()
    const seccion = document.querySelector('#comidas-rapidas')
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})