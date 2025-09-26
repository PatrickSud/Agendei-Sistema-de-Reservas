// Arquivo Principal - Sistema de Reservas Agendei
// Ponto de entrada da aplicação - responsável apenas pela inicialização

import {
  initializeAuth,
  setupAuthStateListener,
  setupLoginListeners
} from './auth.js'
import {
  checkFirestoreConnection,
  checkFirebaseConnection,
  monitorFirebaseStatus
} from './firestore.js'
import {
  initializeUI,
  MapsTo
} from './ui.js'

/**
 * Função principal de inicialização da aplicação
 * Orquestra a inicialização de todos os módulos
 */
async function initializeAgendeiApp() {
  try {
    console.log('🚀 Inicializando aplicação Agendei...')

    // 1. Inicializar módulo de autenticação
    if (!initializeAuth()) {
      console.error('❌ Falha na inicialização do Firebase Auth')
      return
    }

    // 2. Verificar conexão com Firestore
    const firestoreStatus = await checkFirestoreConnection()
    if (!firestoreStatus.success) {
      console.error('❌ Falha na conexão com Firestore:', firestoreStatus.error)
      return
    }

    // 3. Inicializar interface do usuário
    initializeUI()

    // 4. Configurar sistema de autenticação
    setupAuthStateListener()  // Observa mudanças no estado de login
    setupLoginListeners()     // Configura eventos de login/logout

    // 5. Iniciar monitoramento em tempo real do Firebase
    monitorFirebaseStatus()

    console.log('✅ Aplicação inicializada com sucesso!')
  } catch (error) {
    console.error('❌ Erro na inicialização da aplicação:', error)
  }
}

/**
 * Aguarda o Firebase estar completamente inicializado
 * Verifica a flag global window.firebaseInitialized
 */
function waitForFirebase() {
  if (window.firebaseInitialized) {
    initializeAgendeiApp()
  } else {
    setTimeout(waitForFirebase, 100)
  }
}

/**
 * Inicialização da aplicação quando o DOM estiver pronto
 * O Firebase é inicializado via script inline no index.html
 */
document.addEventListener('DOMContentLoaded', function () {
  console.log('📄 DOM carregado, aguardando Firebase...')
  waitForFirebase()
})



// ========================================
// FUNÇÕES GLOBAIS PARA DEBUGGING
// ========================================

// Disponibilizar funções úteis no console do navegador
window.checkFirebaseConnection = checkFirebaseConnection
window.MapsTo = MapsTo

// ========================================
// EXPORTS
// ========================================

// Exportar função principal para uso externo
export { initializeAgendeiApp }
