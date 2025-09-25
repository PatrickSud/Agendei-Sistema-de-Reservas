// Módulo do Firestore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyANAle4qNIzqGjfLe7smp_AIfHaZlRditg',
  authDomain: 'agendei-sistema-de-reservas.firebaseapp.com',
  projectId: 'agendei-sistema-de-reservas',
  storageBucket: 'agendei-sistema-de-reservas.firebasestorage.app',
  messagingSenderId: '1086088433735',
  appId: '1:1086088433735:web:da8fedbde47173dcbc2162',
  measurementId: 'G-TLYFG33G4W'
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

console.log('Firestore inicializado com sucesso!')

// Função para obter dados do usuário
export async function getUserData(userId) {
  try {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      console.log('📄 Dados do usuário encontrados:', userData)
      return userData
    } else {
      console.log('⚠️ Documento do usuário não encontrado')
      return null
    }
  } catch (error) {
    console.error('❌ Erro ao buscar dados do usuário:', error)
    throw error
  }
}

// Função para criar/atualizar dados do usuário
export async function setUserData(userId, userData) {
  try {
    const userDocRef = doc(db, 'users', userId)
    await setDoc(userDocRef, userData, { merge: true })
    console.log('✅ Dados do usuário salvos com sucesso')
  } catch (error) {
    console.error('❌ Erro ao salvar dados do usuário:', error)
    throw error
  }
}

// Função para obter reservas do usuário
export async function getUserReservations(userId) {
  try {
    const reservationsRef = collection(db, 'reservations')
    const q = query(
      reservationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const reservations = []

    querySnapshot.forEach(doc => {
      reservations.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`📋 ${reservations.length} reservas encontradas para o usuário`)
    return reservations
  } catch (error) {
    console.error('❌ Erro ao buscar reservas do usuário:', error)
    throw error
  }
}

// Função para criar uma nova reserva
export async function createReservation(reservationData) {
  try {
    const reservationsRef = collection(db, 'reservations')
    const docRef = await addDoc(reservationsRef, {
      userId: reservationData.userId,
      locationId: reservationData.locationId,
      locationName: reservationData.locationName,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      date: reservationData.date,
      observations: reservationData.observations || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('✅ Reserva criada com sucesso:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('❌ Erro ao criar reserva:', error)
    throw error
  }
}

// Função para atualizar uma reserva
export async function updateReservation(reservationId, updateData) {
  try {
    const reservationRef = doc(db, 'reservations', reservationId)
    await updateDoc(reservationRef, updateData)

    console.log('✅ Reserva atualizada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao atualizar reserva:', error)
    throw error
  }
}

// Função para obter todas as reservas (admin)
export async function getAllReservations() {
  try {
    const reservationsRef = collection(db, 'reservations')
    const q = query(reservationsRef, orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)
    const reservations = []

    querySnapshot.forEach(doc => {
      reservations.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`📋 ${reservations.length} reservas encontradas`)
    return reservations
  } catch (error) {
    console.error('❌ Erro ao buscar todas as reservas:', error)
    throw error
  }
}

// Função para atualizar uma localização
export async function updateLocation(locationId, updateData) {
  try {
    const locationRef = doc(db, 'locations', locationId)
    await updateDoc(locationRef, {
      ...updateData,
      updatedAt: new Date()
    })

    console.log('✅ Localização atualizada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao atualizar localização:', error)
    throw error
  }
}

// Função para excluir uma localização
export async function deleteLocation(locationId) {
  try {
    const locationRef = doc(db, 'locations', locationId)
    await deleteDoc(locationRef)

    console.log('✅ Localização excluída com sucesso')
  } catch (error) {
    console.error('❌ Erro ao excluir localização:', error)
    throw error
  }
}

// Função para obter todas as localizações (admin)
export async function getAllLocations() {
  try {
    const locationsRef = collection(db, 'locations')
    const q = query(locationsRef, orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)
    const locations = []

    querySnapshot.forEach(doc => {
      locations.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`📍 ${locations.length} localizações encontradas`)
    return locations
  } catch (error) {
    console.error('❌ Erro ao buscar todas as localizações:', error)
    throw error
  }
}

// Função para obter espaços/locações disponíveis
export async function getAvailableLocations() {
  try {
    const locationsRef = collection(db, 'locations')
    const q = query(locationsRef, where('isActive', '==', true))

    const querySnapshot = await getDocs(q)
    const locations = []

    querySnapshot.forEach(doc => {
      locations.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`📍 ${locations.length} localizações disponíveis encontradas`)
    return locations
  } catch (error) {
    console.error('❌ Erro ao buscar localizações disponíveis:', error)
    throw error
  }
}

// Função para obter espaços/locações
export async function getLocations() {
  try {
    const locationsRef = collection(db, 'locations')
    const q = query(locationsRef, where('active', '==', true))

    const querySnapshot = await getDocs(q)
    const locations = []

    querySnapshot.forEach(doc => {
      locations.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`📍 ${locations.length} localizações encontradas`)
    return locations
  } catch (error) {
    console.error('❌ Erro ao buscar localizações:', error)
    throw error
  }
}

// Função para criar uma nova localização
export async function createLocation(locationData) {
  try {
    const locationsRef = collection(db, 'locations')
    const docRef = await addDoc(locationsRef, {
      ...locationData,
      createdAt: new Date(),
      active: true
    })

    console.log('✅ Localização criada com sucesso:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('❌ Erro ao criar localização:', error)
    throw error
  }
}

// Função para obter estatísticas do sistema (admin)
export async function getSystemStats() {
  try {
    const [reservations, locations] = await Promise.all([
      getAllReservations(),
      getLocations()
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const reservationsToday = reservations.filter(reservation => {
      const reservationDate = reservation.date?.toDate()
      return reservationDate && reservationDate >= today
    })

    const activeReservations = reservations.filter(
      reservation => reservation.status === 'confirmed'
    )

    const stats = {
      totalLocations: locations.length,
      totalReservations: reservations.length,
      reservationsToday: reservationsToday.length,
      activeReservations: activeReservations.length,
      occupancyRate:
        locations.length > 0
          ? Math.round((activeReservations.length / locations.length) * 100)
          : 0
    }

    console.log('📊 Estatísticas do sistema:', stats)
    return stats
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error)
    throw error
  }
}

// Função para popular o banco com dados de exemplo (desenvolvimento)
export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...')

    // Criar usuários de exemplo
    const users = [
      {
        id: 'user1',
        email: 'admin@agendei.com',
        name: 'Administrador',
        role: 'administrador',
        createdAt: new Date()
      },
      {
        id: 'user2',
        email: 'usuario@agendei.com',
        name: 'Usuário Teste',
        role: 'usuario',
        createdAt: new Date()
      }
    ]

    // Criar localizações de exemplo
    const locations = [
      {
        name: 'Sala de Reunião A',
        description: 'Sala equipada para reuniões de até 8 pessoas',
        floor: '2º Andar',
        capacity: 8,
        features: ['Projetor', 'Ar condicionado', 'WiFi'],
        hourlyRate: 50.0,
        image: 'https://via.placeholder.com/300x200?text=Sala+A',
        isActive: true
      },
      {
        name: 'Auditório Principal',
        description: 'Auditório para eventos e apresentações',
        floor: '1º Andar',
        capacity: 100,
        features: ['Palco', 'Som', 'Iluminação', 'Projetor'],
        hourlyRate: 200.0,
        image: 'https://via.placeholder.com/300x200?text=Auditorio',
        isActive: true
      },
      {
        name: 'Espaço Coworking',
        description: 'Espaço colaborativo para trabalho',
        floor: '3º Andar',
        capacity: 20,
        features: ['Mesas', 'Cadeiras', 'WiFi', 'Café'],
        hourlyRate: 25.0,
        image: 'https://via.placeholder.com/300x200?text=Coworking',
        isActive: true
      },
      {
        name: 'Sala de Treinamento B',
        description: 'Sala ideal para cursos e workshops',
        floor: '2º Andar',
        capacity: 15,
        features: ['Quadro branco', 'Projetor', 'Ar condicionado'],
        hourlyRate: 75.0,
        image: 'https://via.placeholder.com/300x200?text=Sala+B',
        isActive: true
      },
      {
        name: 'Sala VIP',
        description: 'Sala exclusiva para reuniões executivas',
        floor: '4º Andar',
        capacity: 6,
        features: [
          'Mesa de madeira',
          'Ar condicionado',
          'WiFi',
          'Café premium'
        ],
        hourlyRate: 150.0,
        image: 'https://via.placeholder.com/300x200?text=Sala+VIP',
        isActive: true
      },
      {
        name: 'Espaço de Eventos',
        description: 'Amplo espaço para festas e celebrações',
        floor: 'Térreo',
        capacity: 200,
        features: ['Palco', 'Som', 'Iluminação', 'Cozinha'],
        hourlyRate: 300.0,
        image: 'https://via.placeholder.com/300x200?text=Eventos',
        isActive: true
      }
    ]

    // Salvar usuários
    for (const user of users) {
      await setUserData(user.id, user)
    }

    // Salvar localizações
    for (const location of locations) {
      await createLocation(location)
    }

    console.log('✅ Seed do banco de dados concluído!')
    return true
  } catch (error) {
    console.error('❌ Erro no seed do banco:', error)
    throw error
  }
}

// Função para verificar conexão com Firestore
export async function checkFirestoreConnection() {
  try {
    console.log('🔍 Verificando conexão com Firestore...')

    // Tentar ler um documento de teste
    const testDocRef = doc(db, 'test-connection', 'test-doc')
    const testDocSnap = await getDoc(testDocRef)

    console.log('✅ Conexão com Firestore OK')
    console.log('📄 Documento de teste existe:', testDocSnap.exists())

    return {
      success: true,
      connected: true
    }
  } catch (error) {
    console.error('❌ Erro na conexão com Firestore:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
