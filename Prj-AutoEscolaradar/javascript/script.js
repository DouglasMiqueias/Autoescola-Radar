// ===== FUNÇÃO DE ANIMAÇÃO DE CONTAGEM (Counter-Up) =====
function animateCount(element, target, duration, suffix) {
  // Garante que o número inicial seja 0 para a animação
  let start = 0;
  // Converte a string do atributo 'data-target' para um número inteiro
  const end = parseInt(target, 10);
  
  // Se o número alvo for 0 (por segurança), exibe 0 e sai
  if (end === 0) {
    element.innerText = 0 + suffix;
    return;
  }

  // Define a velocidade e o passo do incremento
  const steps = duration / 10; // Roda a cada 20ms
  let increment = end / steps;
  
  if (increment < 1) { increment = 1; }
  let current = start;

  const timer = setInterval(function() {
    current += increment;
    
    if (current >= end) {
      clearInterval(timer);
      // Garante que o valor final exato seja mostrado, formatado com milhar
      element.innerText = end.toLocaleString('pt-BR') + suffix;
    } else {
      // Atualiza o contador, arredondando para cima para garantir que atinja o alvo
      element.innerText = Math.ceil(current).toLocaleString('pt-BR') + suffix;
    }
  }, 20);
}


// Auto-scroll contínuo para depoimentos
window.addEventListener('load', function() {
  const container = document.querySelector('.cards-depoimentos');
  const section = document.querySelector('.depoimentos');
  if (!container || !section) return;

  // Duplicar os cards (essencial para o loop visual)
  const cards = Array.from(container.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('clone');
    container.appendChild(clone);
  });

  let scrollAmount = 0;
  let speed = 1.5;
  let paused = false;
  let running = false;
  let intervalId = null;

  function scrollStep() {
    if (!paused && running) {
      scrollAmount += speed;
      // Reseta a rolagem quando chega na metade (onde começam os clones)
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = scrollAmount;
      }
    }
  }

  container.addEventListener('mouseenter', () => paused = true);
  container.addEventListener('mouseleave', () => paused = false);

  // Intersection Observer para iniciar/parar a rolagem
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        running = true;
        if (!intervalId) {
          intervalId = setInterval(scrollStep, 16);
        }
      } else {
        running = false;
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
});


// Espera o documento carregar para rodar o script
document.addEventListener('DOMContentLoaded', function() {

  // 1. Seleciona todos os elementos que queremos animar (reveal)
  const revealElements = document.querySelectorAll('.reveal');

  // 2. Opções para o "Intersection Observer"
  const observerOptions = {
    root: null, 
    rootMargin: '0px',
    threshold: 0.1 // 10% do elemento visível
  };

  // 3. A função UNIFICADA que será chamada (handleIntersection)
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      
      // Se o elemento está visível
      if (entry.isIntersecting) {
        // Lógica 1: Reveal (Adicionar classe)
        entry.target.classList.add('is-visible');

        // Lógica 2: Counter-Up
        const counterContainer = entry.target.querySelector('.stat-number');
        
        // Verifica se é um item de stat E se ele ainda não foi animado
        if (counterContainer && !entry.target.dataset.animated) {
            
            const target = counterContainer.getAttribute('data-target');
            const suffix = counterContainer.getAttribute('data-suffix') || ''; 
            
            animateCount(counterContainer, target, 2000, suffix);
            
            // Marca o container de stat como animado para não animar de novo
            entry.target.dataset.animated = 'true'; 
        }

      } else {
        // Se o elemento NÃO está visível
        // Lógica de Re-Animação: remove a classe para que ela possa ser adicionada de novo.
        entry.target.classList.remove('is-visible');
      }
      
      // REMOVIDO: observer.unobserve(entry.target); 
      // Isso garante a RE-ANIMAÇÃO que você pediu.
    });
  }

  // 4. Cria o "Observador"
  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  // 5. Pede ao Observador para "assistir" cada um dos nossos elementos
  revealElements.forEach(el => {
    observer.observe(el);
  });

}); // FIM do DOMContentLoaded

// ===============================================
    // SCRIPT: MENU HAMBÚRGUER (CORRIGIDO)
    // ===============================================
    
    // Seleciona os elementos do menu
    const hamburguerBtn = document.getElementById('menu-hamburguer');
    const navMenu = document.getElementById('nav-menu');
    
    // [CORREÇÃO AQUI]
    // Vamos selecionar TODOS os links 'a' dentro do 'navMenu'
    const navLinks = document.querySelectorAll('#nav-menu a'); 

    // Verifica se os elementos existem
    if (hamburguerBtn && navMenu) {
        
        // Abre/Fecha o menu ao clicar no ícone
        hamburguerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
            
            // Atualiza o aria-expanded para acessibilidade
            const isActive = navMenu.classList.contains('is-active');
            hamburguerBtn.setAttribute('aria-expanded', isActive);
            
            // Troca o ícone (Barras para 'X' e vice-versa)
            if (isActive) {
                hamburguerBtn.innerHTML = '<i class="fa-solid fa-times"></i>'; // Ícone 'X'
            } else {
                hamburguerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>'; // Ícone 'Barras'
            }
        });

        // [CORREÇÃO AQUI]
        // Este loop agora vai funcionar, pois 'navLinks' está pegando
        // todos os links (incluindo o botão "Matricule-se")
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Só fecha se o menu estiver ativo
                if (navMenu.classList.contains('is-active')) {
                    navMenu.classList.remove('is-active');
                    hamburguerBtn.setAttribute('aria-expanded', false);
                    hamburguerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        });
    }
    // ===== FIM DO MENU HAMBÚRGUER =====