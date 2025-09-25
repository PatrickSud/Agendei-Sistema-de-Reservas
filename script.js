// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos
    const botao = document.getElementById('btnClique');
    const mensagem = document.getElementById('mensagem');
    
    // Contador de cliques
    let contadorCliques = 0;
    
    // Função para mostrar mensagem
    function mostrarMensagem(texto) {
        mensagem.textContent = texto;
        mensagem.classList.add('mostrar');
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            mensagem.classList.remove('mostrar');
        }, 3000);
    }
    
    // Event listener para o botão
    botao.addEventListener('click', function() {
        contadorCliques++;
        
        if (contadorCliques === 1) {
            mostrarMensagem('Primeiro clique! Bem-vindo!');
        } else if (contadorCliques <= 5) {
            mostrarMensagem(Você clicou  vezes!);
        } else {
            mostrarMensagem(Uau!  cliques! Você é persistente!);
        }
        
        // Efeito visual no botão
        botao.style.transform = 'scale(0.95)';
        setTimeout(() => {
            botao.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Função para animação de entrada dos elementos
    function animarEntrada() {
        const elementos = document.querySelectorAll('section, header, footer');
        
        elementos.forEach((elemento, index) => {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Inicia a animação de entrada
    animarEntrada();
    
    // Função para mudar o tema (bonus)
    function alternarTema() {
        document.body.classList.toggle('tema-escuro');
    }
    
    // Adiciona um botão de tema escuro (bonus)
    const botaoTema = document.createElement('button');
    botaoTema.textContent = '🌙 Tema Escuro';
    botaoTema.style.position = 'fixed';
    botaoTema.style.top = '20px';
    botaoTema.style.right = '20px';
    botaoTema.style.zIndex = '1000';
    botaoTema.addEventListener('click', alternarTema);
    document.body.appendChild(botaoTema);
});

// Adiciona estilos para tema escuro via JavaScript
const estiloTemaEscuro = document.createElement('style');
estiloTemaEscuro.textContent = 
    .tema-escuro {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
    }
    
    .tema-escuro section {
        background-color: #2d2d2d !important;
        color: #e0e0e0 !important;
    }
    
    .tema-escuro header {
        background-color: #0d1117 !important;
    }
    
    .tema-escuro footer {
        background-color: #0d1117 !important;
    }
;
document.head.appendChild(estiloTemaEscuro);
