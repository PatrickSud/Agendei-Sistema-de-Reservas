// Módulo de Autenticação
import { db, getUserData } from './firestore.js'
import {
  showLoginPage,
  showApp,
  updateUserInfo,
  mostrarMensagem,
  toggleLoading
} from './ui.js'

// Referências do Firebase (serão inicializadas quando o Firebase estiver pronto)
let auth = null
let googleProvider = null
let signInWithEmailAndPassword = null
let signInWithPopup = null
let onAuthStateChanged = null
let signOut = null

// Função para inicializar as referências do Firebase
export function initializeAuth() {
  if (typeof window.firebaseAuth === 'undefined') {
    console.error('Firebase não foi inicializado corretamente')
    return false
  }

  // Referências do Firebase
  auth = window.firebaseAuth
  googleProvider = window.googleProvider
  signInWithEmailAndPassword = window.signInWithEmailAndPassword
  signInWithPopup = window.signInWithPopup
  onAuthStateChanged = window.onAuthStateChanged
  signOut = window.signOut

  console.log('Auth inicializado com sucesso!')
  return true
}

// Função para fazer login com email e senha
export async function fazerLoginEmailSenha(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha)
    const user = userCredential.user

    console.log('Login realizado com sucesso:', user)
    mostrarMensagem(`Bem-vindo, ${user.email}!`, 'sucesso')

    // Limpar formulário
    const emailInput = document.getElementById('email')
    const senhaInput = document.getElementById('senha')
    emailInput.value = ''
    senhaInput.value = ''

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

// Função para fazer login com Google
export async function fazerLoginGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    console.log('Login com Google realizado com sucesso:', user)
    mostrarMensagem(`Bem-vindo, ${user.displayName || user.email}!`, 'sucesso')

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

// Função para lidar com logout
export async function handleLogout() {
  try {
    await signOut(auth)
    console.log('👋 Logout realizado com sucesso')
  } catch (error) {
    console.error('❌ Erro no logout:', error)
    mostrarMensagem('Erro ao fazer logout.', 'erro')
  }
}

// Função assíncrona para lidar com o login do usuário
export async function handleLogin(user) {
  try {
    console.log('🔄 Buscando dados do usuário no Firestore...')

    // Buscar dados do usuário no Firestore
    const userData = await getUserData(user.uid)
    const role = userData?.role || 'usuario'

    console.log(`👤 Role do usuário: ${role}`)

    // Atualizar informações do usuário na UI
    updateUserInfo(user)

    // Mostrar aplicação
    showApp()

    // Gerar menu lateral baseado no role
    const { gerarMenuLateral, configurarNavegacaoMenu, MapsTo } = await import(
      './ui.js'
    )
    const sidebar = document.getElementById('sidebar')
    if (sidebar) {
      sidebar.innerHTML = gerarMenuLateral(role)
    }

    // Configurar navegação
    configurarNavegacaoMenu(role)

    // Carregar dashboard padrão após login
    const defaultPageId =
      role === 'administrador' ? 'dashboard-administrador' : 'dashboard-usuario'
    await MapsTo(defaultPageId)

    console.log('✅ Login processado com sucesso!')

    // Reconfigurar event listeners
    const novoBtnLogout = document.getElementById('btnLogout')
    if (novoBtnLogout) {
      novoBtnLogout.addEventListener('click', handleLogout)
    }
  } catch (error) {
    console.error('❌ Erro ao processar login:', error)
    mostrarMensagem('Erro ao carregar dados do usuário.', 'erro')
  }
}

// Função para configurar observador de estado de autenticação
export function setupAuthStateListener() {
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

      // Mostrar tela de login
      showLoginPage()

      // Limpar formulário
      const emailInput = document.getElementById('email')
      const senhaInput = document.getElementById('senha')
      if (emailInput) emailInput.value = ''
      if (senhaInput) senhaInput.value = ''
    }
  })
}

// Função para configurar event listeners de login
export function setupLoginListeners() {
  const loginForm = document.getElementById('loginForm')
  const btnGoogle = document.getElementById('btnGoogle')

  if (!loginForm || !btnGoogle) {
    console.error('Elementos de login não encontrados')
    return
  }

  // Event listener para o formulário de login
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const emailInput = document.getElementById('email')
    const senhaInput = document.getElementById('senha')
    const btnEntrar = document.querySelector('button[type="submit"]')

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
}
