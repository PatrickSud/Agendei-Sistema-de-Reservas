// Configuração e inicialização do Firebase
// Aguarda o carregamento completo da página e inicialização do Firebase
function initializeApp() {
  // Verifica se o Firebase foi inicializado
  if (typeof window.firebaseAuth === 'undefined') {
    console.error('Firebase não foi inicializado corretamente')
    return
  }

  // Referências do Firebase
  const auth = window.firebaseAuth
  const db = window.firebaseDb
  const googleProvider = window.googleProvider
  const signInWithEmailAndPassword = window.signInWithEmailAndPassword
  const signInWithPopup = window.signInWithPopup
  const onAuthStateChanged = window.onAuthStateChanged
  const signOut = window.signOut
  const doc = window.doc
  const getDoc = window.getDoc

  console.log('Firebase inicializado com sucesso!')
  console.log('Auth:', auth)
  console.log('Firestore:', db)

  // Referências aos elementos do formulário
  const loginForm = document.getElementById('loginForm')
  const emailInput = document.getElementById('email')
  const senhaInput = document.getElementById('senha')
  const btnEntrar = document.querySelector('.btn-entrar')
  const btnGoogle = document.getElementById('btnGoogle')

  // Referências aos elementos da aplicação
  const loginContainer = document.querySelector('.login-container')
  const appDiv = document.getElementById('app')
  const sidebar = document.getElementById('sidebar')
  const userEmailSpan = document.getElementById('userEmail')
  const userPhotoImg = document.getElementById('userPhoto')
  const btnLogout = document.getElementById('btnLogout')

  // Função para mostrar mensagem de erro/sucesso
  function mostrarMensagem(texto, tipo = 'erro') {
    // Remove mensagens anteriores
    const mensagemExistente = document.querySelector('.mensagem-login')
    if (mensagemExistente) {
      mensagemExistente.remove()
    }

    // Cria nova mensagem
    const mensagem = document.createElement('div')
    mensagem.className = `mensagem-login ${tipo}`
    mensagem.textContent = texto
    mensagem.style.cssText = `
      padding: 12px 16px;
      margin: 15px 0;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      ${
        tipo === 'erro'
          ? 'background-color: #fed7d7; color: #c53030; border: 1px solid #feb2b2;'
          : 'background-color: #c6f6d5; color: #2f855a; border: 1px solid #9ae6b4;'
      }
    `

    // Insere a mensagem após o formulário
    loginForm.parentNode.insertBefore(mensagem, loginForm.nextSibling)

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
      if (mensagem.parentNode) {
        mensagem.remove()
      }
    }, 5000)
  }

  // Função para alternar estado de loading dos botões
  function toggleLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true
      button.style.opacity = '0.6'
      button.style.cursor = 'not-allowed'

      // Adiciona spinner se for o botão de entrar
      if (button.classList.contains('btn-entrar')) {
        button.innerHTML =
          '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></span>Entrando...'
      }
    } else {
      button.disabled = false
      button.style.opacity = '1'
      button.style.cursor = 'pointer'

      // Restaura texto original
      if (button.classList.contains('btn-entrar')) {
        button.innerHTML = 'Entrar'
      }
    }
  }

  // Adiciona animação de spinner
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)

  // Função para fazer login com email e senha
  async function fazerLoginEmailSenha(email, senha) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      )
      const user = userCredential.user

      console.log('Login realizado com sucesso:', user)
      mostrarMensagem(`Bem-vindo, ${user.email}!`, 'sucesso')

      // Limpar formulário
      emailInput.value = ''
      senhaInput.value = ''

      // Redirecionar para dashboard (implementar depois)
      // window.location.href = '/dashboard.html'

      return user
    } catch (error) {
      console.error('Erro no login:', error)

      // Tratar diferentes tipos de erro
      let mensagemErro = 'Erro ao fazer login. Verifique suas credenciais.'

      switch (error.code) {
        case 'auth/user-not-found':
          mensagemErro = 'Usuário não encontrado. Verifique o email.'
          break
        case 'auth/wrong-password':
          mensagemErro = 'Senha incorreta.'
          break
        case 'auth/invalid-email':
          mensagemErro = 'Email inválido.'
          break
        case 'auth/user-disabled':
          mensagemErro = 'Esta conta foi desabilitada.'
          break
        case 'auth/too-many-requests':
          mensagemErro = 'Muitas tentativas. Tente novamente mais tarde.'
          break
        case 'auth/network-request-failed':
          mensagemErro = 'Erro de conexão. Verifique sua internet.'
          break
      }

      mostrarMensagem(mensagemErro, 'erro')
      throw error
    }
  }

  // Event listener para o formulário de login
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const email = emailInput.value.trim()
    const senha = senhaInput.value

    // Validação básica
    if (!email || !senha) {
      mostrarMensagem('Por favor, preencha todos os campos.', 'erro')
      return
    }

    if (!email.includes('@')) {
      mostrarMensagem('Por favor, insira um email válido.', 'erro')
      return
    }

    // Ativa estado de loading
    toggleLoading(btnEntrar, true)

    try {
      await fazerLoginEmailSenha(email, senha)
    } catch (error) {
      // Erro já tratado na função fazerLoginEmailSenha
    } finally {
      toggleLoading(btnEntrar, false)
    }
  })

  // Função para fazer login com Google
  async function fazerLoginGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      console.log('Login com Google realizado com sucesso:', user)
      mostrarMensagem(
        `Bem-vindo, ${user.displayName || user.email}!`,
        'sucesso'
      )

      // Redirecionar para dashboard (implementar depois)
      // window.location.href = '/dashboard.html'

      return user
    } catch (error) {
      console.error('Erro no login com Google:', error)

      // Tratar diferentes tipos de erro
      let mensagemErro = 'Erro ao fazer login com Google.'

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          mensagemErro = 'Login cancelado pelo usuário.'
          break
        case 'auth/popup-blocked':
          mensagemErro =
            'Popup bloqueado pelo navegador. Permita popups para este site.'
          break
        case 'auth/cancelled-popup-request':
          mensagemErro = 'Login cancelado.'
          break
        case 'auth/account-exists-with-different-credential':
          mensagemErro =
            'Já existe uma conta com este email usando outro método de login.'
          break
        case 'auth/operation-not-allowed':
          mensagemErro = 'Login com Google não está habilitado.'
          break
        case 'auth/network-request-failed':
          mensagemErro = 'Erro de conexão. Verifique sua internet.'
          break
      }

      mostrarMensagem(mensagemErro, 'erro')
      throw error
    }
  }

  // Event listener para o formulário de login
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const email = emailInput.value.trim()
    const senha = senhaInput.value.trim()

    if (!email || !senha) {
      mostrarMensagem('Por favor, preencha todos os campos.', 'erro')
      return
    }

    toggleLoading(btnEntrar, true)

    try {
      await fazerLoginEmailSenha(email, senha)
    } catch (error) {
      // Erro já tratado na função fazerLoginEmailSenha
    } finally {
      toggleLoading(btnEntrar, false)
    }
  })

  // Event listener para o botão do Google
  btnGoogle.addEventListener('click', async function () {
    toggleLoading(btnGoogle, true)

    try {
      await fazerLoginGoogle()
    } catch (error) {
      // Erro já tratado na função fazerLoginGoogle
    } finally {
      toggleLoading(btnGoogle, false)
    }
  })

  // Função para animação de entrada dos elementos
  function animarEntrada() {
    const elementos = document.querySelectorAll('.login-box > *')

    elementos.forEach((elemento, index) => {
      elemento.style.opacity = '0'
      elemento.style.transform = 'translateY(20px)'

      setTimeout(() => {
        elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        elemento.style.opacity = '1'
        elemento.style.transform = 'translateY(0)'
      }, index * 100)
    })
  }

  // Função para renderizar dashboard do usuário
  function renderizarDashboardUsuario() {
    const contentBody = document.querySelector('.content-body')
    contentBody.innerHTML = `
      <div class="welcome-message">
        <h2>Bem-vindo ao seu Dashboard!</h2>
        <p>Gerencie suas reservas e explore os espaços disponíveis</p>
      </div>
      
      <div class="dashboard-sections">
        <div class="section-card">
          <div class="section-icon">📅</div>
          <h3>Nova Reserva</h3>
          <p>Agende um novo horário em nossos espaços</p>
          <button class="section-btn">Fazer Reserva</button>
        </div>
        
        <div class="section-card">
          <div class="section-icon">📋</div>
          <h3>Minhas Reservas</h3>
          <p>Visualize e gerencie suas reservas ativas</p>
          <button class="section-btn">Ver Reservas</button>
        </div>
        
        <div class="section-card">
          <div class="section-icon">📍</div>
          <h3>Localidade</h3>
          <p>Explore os espaços disponíveis na sua região</p>
          <button class="section-btn">Explorar</button>
        </div>
        
        <div class="section-card">
          <div class="section-icon">⏰</div>
          <h3>Reservas Recentes</h3>
          <p>Veja suas últimas atividades e reservas</p>
          <button class="section-btn">Ver Histórico</button>
        </div>
      </div>
      
      <div class="quick-stats">
        <h3>Resumo Rápido</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">3</span>
            <span class="stat-label">Reservas Ativas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">Total Reservas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">2</span>
            <span class="stat-label">Espaços Favoritos</span>
          </div>
        </div>
      </div>
    `
  }

  // Função para renderizar dashboard do administrador
  function renderizarDashboardAdmin() {
    const contentBody = document.querySelector('.content-body')
    contentBody.innerHTML = `
      <div class="welcome-message">
        <h2>Painel Administrativo</h2>
        <p>Gerencie espaços, usuários e monitore o desempenho do sistema</p>
      </div>
      
      <div class="admin-cards">
        <div class="admin-card">
          <div class="card-header">
            <h3>Espaços Ativos</h3>
            <div class="card-icon">🏢</div>
          </div>
          <div class="card-content">
            <span class="card-number">15</span>
            <p class="card-description">Espaços disponíveis para reserva</p>
            <div class="card-trend positive">+2 este mês</div>
          </div>
        </div>
        
        <div class="admin-card">
          <div class="card-header">
            <h3>Reservas Hoje</h3>
            <div class="card-icon">📅</div>
          </div>
          <div class="card-content">
            <span class="card-number">28</span>
            <p class="card-description">Reservas confirmadas para hoje</p>
            <div class="card-trend positive">+15% vs ontem</div>
          </div>
        </div>
        
        <div class="admin-card">
          <div class="card-header">
            <h3>Taxa de Ocupação</h3>
            <div class="card-icon">📊</div>
          </div>
          <div class="card-content">
            <span class="card-number">78%</span>
            <p class="card-description">Ocupação média dos espaços</p>
            <div class="card-trend positive">+5% este mês</div>
          </div>
        </div>
        
        <div class="admin-card">
          <div class="card-header">
            <h3>Usuários Ativos</h3>
            <div class="card-icon">👥</div>
          </div>
          <div class="card-content">
            <span class="card-number">342</span>
            <p class="card-description">Usuários cadastrados no sistema</p>
            <div class="card-trend positive">+23 novos usuários</div>
          </div>
        </div>
        
        <div class="admin-card">
          <div class="card-header">
            <h3>Receita Mensal</h3>
            <div class="card-icon">💰</div>
          </div>
          <div class="card-content">
            <span class="card-number">R$ 45.200</span>
            <p class="card-description">Faturamento do mês atual</p>
            <div class="card-trend positive">+12% vs mês anterior</div>
          </div>
        </div>
        
        <div class="admin-card">
          <div class="card-header">
            <h3>Reservas Canceladas</h3>
            <div class="card-icon">❌</div>
          </div>
          <div class="card-content">
            <span class="card-number">8</span>
            <p class="card-description">Cancelamentos esta semana</p>
            <div class="card-trend negative">-3 vs semana anterior</div>
          </div>
        </div>
      </div>
      
      <div class="admin-sections">
        <div class="section-panel">
          <h3>Reservas Pendentes</h3>
          <div class="pending-list">
            <div class="pending-item">
              <span class="user-name">João Silva</span>
              <span class="space-name">Sala de Reunião A</span>
              <span class="time">14:00 - 16:00</span>
              <button class="btn-approve">Aprovar</button>
            </div>
            <div class="pending-item">
              <span class="user-name">Maria Santos</span>
              <span class="space-name">Auditório Principal</span>
              <span class="time">09:00 - 11:00</span>
              <button class="btn-approve">Aprovar</button>
            </div>
          </div>
        </div>
        
        <div class="section-panel">
          <h3>Espaços Mais Populares</h3>
          <div class="popular-spaces">
            <div class="space-item">
              <span class="space-name">Sala de Reunião A</span>
              <span class="reservation-count">45 reservas</span>
            </div>
            <div class="space-item">
              <span class="space-name">Auditório Principal</span>
              <span class="reservation-count">38 reservas</span>
            </div>
            <div class="space-item">
              <span class="space-name">Espaço Coworking</span>
              <span class="reservation-count">32 reservas</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  // Função para gerar menu lateral baseado no role
  function gerarMenuLateral(role) {
    let menuItems = []

    if (role === 'administrador') {
      menuItems = [
        { nome: 'Dashboard', ativo: true },
        { nome: 'Localidades', ativo: false },
        { nome: 'Configurações', ativo: false },
        { nome: 'Usuários', ativo: false },
        { nome: 'Relatórios', ativo: false },
        { nome: 'Testes', ativo: false }
      ]
    } else {
      // role === 'usuario' ou qualquer outro valor
      menuItems = [
        { nome: 'Dashboard', ativo: true },
        { nome: 'Nova Reserva', ativo: false },
        { nome: 'Minhas Reservas', ativo: false },
        { nome: 'Localidade', ativo: false },
        { nome: 'Reservas Recentes', ativo: false }
      ]
    }

    const menuHTML = menuItems
      .map(
        item =>
          `<li><a href="#" class="menu-item ${
            item.ativo ? 'active' : ''
          }" data-page="${item.nome.toLowerCase().replace(/\s+/g, '-')}">${
            item.nome
          }</a></li>`
      )
      .join('')

    return `
      <div class="sidebar-header">
        <h2>Agendei</h2>
      </div>
      <ul class="sidebar-menu">
        ${menuHTML}
      </ul>
      <div class="sidebar-footer">
        <button id="btnLogout" class="btn-logout">Sair</button>
      </div>
    `
  }

  // Função para configurar navegação do menu
  function configurarNavegacaoMenu(role) {
    const menuItems = document.querySelectorAll('.menu-item')

    menuItems.forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault()

        // Remover classe active de todos os itens
        menuItems.forEach(menuItem => menuItem.classList.remove('active'))

        // Adicionar classe active ao item clicado
        this.classList.add('active')

        // Atualizar título do header
        const contentHeader = document.querySelector('.content-header h1')
        contentHeader.textContent = this.textContent

        // Renderizar conteúdo baseado na página
        const page = this.getAttribute('data-page')

        if (page === 'dashboard') {
          if (role === 'administrador') {
            renderizarDashboardAdmin()
          } else {
            renderizarDashboardUsuario()
          }
        } else {
          // Para outras páginas, mostrar mensagem temporária
          const contentBody = document.querySelector('.content-body')
          contentBody.innerHTML = `
            <div class="welcome-message">
              <h2>${this.textContent}</h2>
              <p>Esta funcionalidade será implementada em breve!</p>
            </div>
            <div class="coming-soon">
              <div class="coming-soon-icon">🚧</div>
              <h3>Em Desenvolvimento</h3>
              <p>Estamos trabalhando para trazer esta funcionalidade o mais rápido possível.</p>
            </div>
          `
        }
      })
    })
  }

  // Função assíncrona para lidar com o login do usuário
  async function handleLogin(user) {
    try {
      console.log('🔄 Buscando dados do usuário no Firestore...')

      // Buscar documento do usuário na coleção 'users'
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)

      let role = 'usuario' // Valor padrão

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        role = userData.role || 'usuario'
        console.log('📄 Dados do usuário encontrados:', userData)
      } else {
        console.log(
          '⚠️ Documento do usuário não encontrado, usando role padrão'
        )
      }

      console.log(`👤 Role do usuário: ${role}`)

      // Gerar menu lateral baseado no role
      const menuHTML = gerarMenuLateral(role)
      sidebar.innerHTML = menuHTML

      // Atualizar informações do usuário
      userEmailSpan.textContent = user.email || 'Usuário'
      if (user.photoURL) {
        userPhotoImg.src = user.photoURL
        userPhotoImg.style.display = 'block'
      } else {
        userPhotoImg.style.display = 'none'
      }

      // Esconder tela de login e mostrar aplicação
      loginContainer.classList.add('hidden')
      appDiv.classList.remove('hidden')

      // Adicionar classe ao body para ajustar estilos
      document.body.classList.add('app-loaded')

      console.log('✅ Login processado com sucesso!')

      // Reconfigurar event listeners
      const novoBtnLogout = document.getElementById('btnLogout')
      if (novoBtnLogout) {
        novoBtnLogout.addEventListener('click', handleLogout)
      }

      // Adicionar event listeners para navegação do menu
      configurarNavegacaoMenu(role)
    } catch (error) {
      console.error('❌ Erro ao processar login:', error)
      mostrarMensagem('Erro ao carregar dados do usuário.', 'erro')
    }
  }

  // Função para lidar com logout
  async function handleLogout() {
    try {
      await signOut(auth)
      console.log('👋 Logout realizado com sucesso')
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      mostrarMensagem('Erro ao fazer logout.', 'erro')
    }
  }

  // Observador de estado de autenticação
  onAuthStateChanged(auth, async user => {
    if (user) {
      // Usuário está logado
      console.log('✅ Usuário logado:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      })

      // Processar login do usuário
      await handleLogin(user)
    } else {
      // Usuário não está logado
      console.log('❌ Usuário não está logado')

      // Esconder aplicação e mostrar tela de login
      appDiv.classList.add('hidden')
      loginContainer.classList.remove('hidden')

      // Remover classe do body para voltar aos estilos de login
      document.body.classList.remove('app-loaded')

      // Limpar formulário
      emailInput.value = ''
      senhaInput.value = ''
    }
  })

  // Inicia a animação de entrada
  animarEntrada()
}

// Aguardar o Firebase estar pronto
function waitForFirebase() {
  if (window.firebaseInitialized) {
    initializeApp()
  } else {
    setTimeout(waitForFirebase, 100)
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
  waitForFirebase()
})

// Configuração adicional do Firebase (disponível globalmente)
window.firebaseConfig = {
  apiKey: 'AIzaSyANAle4qNIzqGjfLe7smp_AIfHaZlRditg',
  authDomain: 'agendei-sistema-de-reservas.firebaseapp.com',
  projectId: 'agendei-sistema-de-reservas',
  storageBucket: 'agendei-sistema-de-reservas.firebasestorage.app',
  messagingSenderId: '1086088433735',
  appId: '1:1086088433735:web:da8fedbde47173dcbc2162',
  measurementId: 'G-TLYFG33G4W'
}

// Função de diagnóstico para verificar conexão com Firebase
async function checkFirebaseConnection() {
  console.log('🔍 Iniciando verificação de conexão com Firebase...')

  try {
    // Verificação 1: Serviço de Autenticação
    console.log('📋 Verificando serviço de autenticação...')

    if (typeof window.firebaseAuth === 'undefined') {
      throw new Error('❌ Serviço de autenticação não foi inicializado')
    }

    const auth = window.firebaseAuth
    const currentUser = auth.currentUser

    console.log('✅ Serviço de autenticação OK')
    console.log(
      '👤 Usuário atual:',
      currentUser ? currentUser.email : 'Nenhum usuário logado'
    )

    // Verificação 2: Firestore Database
    console.log('📋 Verificando conexão com Firestore...')

    if (typeof window.firebaseDb === 'undefined') {
      throw new Error('❌ Firestore não foi inicializado')
    }

    const db = window.firebaseDb
    const doc = window.doc
    const getDoc = window.getDoc

    if (typeof doc === 'undefined' || typeof getDoc === 'undefined') {
      throw new Error('❌ Funções do Firestore não foram importadas')
    }

    // Tentar ler um documento de teste (não precisa existir)
    const testDocRef = doc(db, 'test-connection', 'test-doc')
    const testDocSnap = await getDoc(testDocRef)

    console.log('✅ Conexão com Firestore OK')
    console.log('📄 Documento de teste existe:', testDocSnap.exists())

    // Verificação 3: Configuração do Firebase
    console.log('📋 Verificando configuração do Firebase...')

    if (typeof window.firebaseConfig === 'undefined') {
      throw new Error('❌ Configuração do Firebase não encontrada')
    }

    const config = window.firebaseConfig
    console.log('✅ Configuração do Firebase OK')
    console.log('🔧 Project ID:', config.projectId)
    console.log('🔧 Auth Domain:', config.authDomain)

    // Verificação 4: Funções de autenticação
    console.log('📋 Verificando funções de autenticação...')

    const authFunctions = [
      'signInWithEmailAndPassword',
      'signInWithPopup',
      'onAuthStateChanged',
      'signOut'
    ]

    const missingFunctions = authFunctions.filter(
      func => typeof window[func] === 'undefined'
    )

    if (missingFunctions.length > 0) {
      throw new Error(
        '❌ Funções de autenticação não encontradas: ' +
          missingFunctions.join(', ')
      )
    }

    console.log('✅ Todas as funções de autenticação OK')

    // Resumo final
    console.log(
      '🎉 VERIFICAÇÃO COMPLETA - Firebase está configurado corretamente!'
    )
    console.log('📊 Resumo:')
    console.log('  ✅ Autenticação: OK')
    console.log('  ✅ Firestore: OK')
    console.log('  ✅ Configuração: OK')
    console.log('  ✅ Funções: OK')

    return {
      success: true,
      auth: true,
      firestore: true,
      config: true,
      functions: true
    }
  } catch (error) {
    console.error('❌ ERRO na verificação do Firebase:', error.message)
    console.log('🔧 Possíveis soluções:')
    console.log('  1. Verifique se o Firebase está inicializado corretamente')
    console.log('  2. Confirme se todas as dependências foram importadas')
    console.log('  3. Verifique se as credenciais estão corretas')
    console.log('  4. Certifique-se de que o projeto Firebase existe')

    return {
      success: false,
      error: error.message
    }
  }
}

// Disponibilizar função globalmente para uso no console
window.checkFirebaseConnection = checkFirebaseConnection

// Função para verificar se o Firebase está configurado
window.verificarFirebase = function () {
  if (window.firebaseAuth && window.firebaseDb) {
    console.log('✅ Firebase configurado corretamente')
    return true
  } else {
    console.log('❌ Firebase não configurado')
    return false
  }
}
