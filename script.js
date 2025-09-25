// Arquivo Principal - Sistema de Reservas Agendei
import {
  initializeAuth,
  setupAuthStateListener,
  setupLoginListeners
} from './auth.js'
import {
  db,
  checkFirestoreConnection,
  monitorFirebaseStatus
} from './firestore.js'
import { initializeUI, gerarMenuLateral } from './ui.js'

// Função principal de inicialização
async function initializeApp() {
  try {
    console.log('🚀 Inicializando aplicação Agendei...')

    // 1. Verificar se o Firebase foi inicializado
    if (!initializeAuth()) {
      console.error('❌ Falha na inicialização do Firebase')
      return
    }

    // 2. Verificar conexão com Firestore
    const firestoreStatus = await checkFirestoreConnection()
    if (!firestoreStatus.success) {
      console.error('❌ Falha na conexão com Firestore:', firestoreStatus.error)
      return
    }

    // 3. Inicializar UI
    initializeUI()

    // 4. Configurar listeners de autenticação
    setupAuthStateListener()
    setupLoginListeners()

    // 5. Iniciar monitoramento do status do Firebase
    monitorFirebaseStatus()

    console.log('✅ Aplicação inicializada com sucesso!')
  } catch (error) {
    console.error('❌ Erro na inicialização da aplicação:', error)
  }
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
  console.log('📄 DOM carregado, aguardando Firebase...')
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
export async function checkFirebaseConnection() {
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

// Exportar funções principais para uso externo
export { initializeApp, checkFirebaseConnection }
