// Módulo de Interface do Usuário
import { handleLogout } from './auth.js'

// Função para mostrar mensagem de erro/sucesso
export function mostrarMensagem(texto, tipo = 'erro') {
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
  const loginForm = document.getElementById('loginForm')
  if (loginForm) {
    loginForm.parentNode.insertBefore(mensagem, loginForm.nextSibling)
  }

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    if (mensagem.parentNode) {
      mensagem.remove()
    }
  }, 5000)
}

// Função para alternar estado de loading dos botões
export function toggleLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true
    button.style.opacity = '0.6'
    button.style.cursor = 'not-allowed'

    // Adiciona spinner se for o botão de entrar
    if (button.classList.contains('btn-entrar') || button.type === 'submit') {
      button.innerHTML =
        '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></span>Entrando...'
    }
  } else {
    button.disabled = false
    button.style.opacity = '1'
    button.style.cursor = 'pointer'

    // Restaura texto original
    if (button.classList.contains('btn-entrar') || button.type === 'submit') {
      button.innerHTML = 'Entrar'
    }
  }
}

// Função para mostrar tela de login
export function showLoginPage() {
  const loginContainer = document.getElementById('login-container')
  const appDiv = document.getElementById('app')

  if (loginContainer && appDiv) {
    appDiv.classList.add('hidden')
    loginContainer.classList.remove('hidden')
    document.body.classList.remove('app-loaded')
  }
}

// Função para mostrar aplicação
export function showApp() {
  const loginContainer = document.getElementById('login-container')
  const appDiv = document.getElementById('app')

  if (loginContainer && appDiv) {
    loginContainer.classList.add('hidden')
    appDiv.classList.remove('hidden')
    document.body.classList.add('app-loaded')
  }
}

// Função para atualizar informações do usuário na UI
export function updateUserInfo(user) {
  const userEmailSpan = document.getElementById('userEmail')
  const userPhotoImg = document.getElementById('userPhoto')

  if (userEmailSpan) {
    userEmailSpan.textContent = user.email || 'Usuário'
  }

  if (userPhotoImg) {
    if (user.photoURL) {
      userPhotoImg.src = user.photoURL
      userPhotoImg.style.display = 'block'
    } else {
      userPhotoImg.style.display = 'none'
    }
  }
}

// Função para gerar menu lateral baseado no role
export function gerarMenuLateral(role) {
  let menuItems = []

  if (role === 'administrador') {
    menuItems = [
      { nome: 'Dashboard', ativo: true, pageId: 'dashboard-administrador' },
      { nome: 'Reservas', ativo: false, pageId: 'reservas' },
      { nome: 'Clientes', ativo: false, pageId: 'clientes' },
      { nome: 'Serviços', ativo: false, pageId: 'servicos' },
      { nome: 'Relatórios', ativo: false, pageId: 'relatorios' },
      { nome: 'Configurações', ativo: false, pageId: 'configuracoes' }
    ]
  } else {
    // role === 'usuario' ou qualquer outro valor
    menuItems = [
      { nome: 'Dashboard', ativo: true, pageId: 'dashboard-usuario' },
      { nome: 'Nova Reserva', ativo: false, pageId: 'nova-reserva' },
      { nome: 'Minhas Reservas', ativo: false, pageId: 'minhas-reservas' },
      { nome: 'Localidades', ativo: false, pageId: 'localidades' },
      { nome: 'Reservas Recentes', ativo: false, pageId: 'reservas-recentes' }
    ]
  }

  const menuHTML = menuItems
    .map(
      item =>
        `<li class="mb-2">
          <a href="#" class="block px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 ${
            item.ativo ? 'bg-gray-700 text-white' : ''
          }" data-page="${item.pageId}">${item.nome}</a>
        </li>`
    )
    .join('')

  return `
    <div class="p-6 border-b border-gray-700">
      <h2 class="text-xl font-bold">Agendei</h2>
    </div>
    <ul class="flex-1 py-4">
      ${menuHTML}
    </ul>
    <div class="p-6 border-t border-gray-700">
      <button id="btnLogout" class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
        Sair
      </button>
    </div>
  `
}

// Funções auxiliares para gerenciamento de localidades
let currentEditingLocationId = null

window.openLocationModal = function (locationId = null) {
  const modal = document.getElementById('locationModal')
  const modalTitle = document.getElementById('modalTitle')
  const form = document.getElementById('locationForm')

  if (!modal) return

  currentEditingLocationId = locationId

  if (locationId) {
    modalTitle.textContent = 'Editar Localidade'
    // TODO: Preencher formulário com dados da localidade
  } else {
    modalTitle.textContent = 'Adicionar Localidade'
    form.reset()
    document.getElementById('locationActive').checked = true
  }

  modal.classList.remove('hidden')
}

window.closeLocationModal = function () {
  const modal = document.getElementById('locationModal')
  if (modal) {
    modal.classList.add('hidden')
    currentEditingLocationId = null
  }
}

window.editLocation = function (locationId) {
  openLocationModal(locationId)
}

window.deleteLocation = async function (locationId, locationName) {
  if (
    confirm(`Tem certeza que deseja excluir a localidade "${locationName}"?`)
  ) {
    try {
      const { deleteLocation } = await import('./firestore.js')
      await deleteLocation(locationId)

      mostrarMensagem('Localidade excluída com sucesso!', 'sucesso')

      // Recarregar a página de configurações
      setTimeout(() => {
        MapsTo('configuracoes')
      }, 1500)
    } catch (error) {
      console.error('❌ Erro ao excluir localidade:', error)
      mostrarMensagem('Erro ao excluir localidade. Tente novamente.', 'erro')
    }
  }
}

// Função para carregar e renderizar página de configurações do admin
export async function loadAdminConfigPage() {
  console.log('⚙️ Carregando página de configurações do admin')

  try {
    // Importar função do firestore dinamicamente
    const { getAllLocations } = await import('./firestore.js')

    // Buscar todas as localidades
    const locations = await getAllLocations()

    // Encontrar a área de conteúdo principal
    const contentArea = document.querySelector('#content .flex-1')

    if (!contentArea) {
      console.error('❌ Área de conteúdo não encontrada')
      return
    }

    // Renderizar página de configurações
    contentArea.innerHTML = renderAdminLocationsPage(locations)

    // Configurar event listeners do formulário
    setupLocationForm()

    console.log('✅ Página de configurações do admin carregada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao carregar página de configurações:', error)

    const contentArea = document.querySelector('#content .flex-1')
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Erro ao carregar configurações</h2>
          <p class="text-gray-500">Não foi possível carregar as configurações no momento.</p>
        </div>
      `
    }
  }
}

// Função para configurar event listeners do formulário de localidade
function setupLocationForm() {
  const form = document.getElementById('locationForm')

  if (!form) return

  form.addEventListener('submit', async function (e) {
    e.preventDefault()

    try {
      const formData = new FormData(form)

      // Preparar dados da localidade
      const locationData = {
        name: formData.get('name'),
        floor: formData.get('floor'),
        description: formData.get('description'),
        capacity: parseInt(formData.get('capacity')),
        image: formData.get('image'),
        features: formData.get('features')
          ? formData
              .get('features')
              .split(',')
              .map(f => f.trim())
              .filter(f => f)
          : [],
        isActive: formData.get('isActive') === 'on'
      }

      // Mostrar loading
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.disabled = true
      submitBtn.textContent = 'Salvando...'

      // Importar funções do firestore
      const { createLocation, updateLocation } = await import('./firestore.js')

      if (currentEditingLocationId) {
        // Atualizar localidade existente
        await updateLocation(currentEditingLocationId, locationData)
        mostrarMensagem('Localidade atualizada com sucesso!', 'sucesso')
      } else {
        // Criar nova localidade
        await createLocation(locationData)
        mostrarMensagem('Localidade criada com sucesso!', 'sucesso')
      }

      // Fechar modal e recarregar página
      closeLocationModal()

      setTimeout(() => {
        MapsTo('configuracoes')
      }, 1500)
    } catch (error) {
      console.error('❌ Erro ao salvar localidade:', error)
      mostrarMensagem('Erro ao salvar localidade. Tente novamente.', 'erro')
    } finally {
      // Restaurar botão
      const submitBtn = form.querySelector('button[type="submit"]')
      submitBtn.disabled = false
      submitBtn.textContent = 'Salvar'
    }
  })
}

// Função para renderizar página de gerenciamento de localidades (admin)
export function renderAdminLocationsPage(locations) {
  console.log(
    '🏢 Renderizando página de gerenciamento de localidades:',
    locations.length
  )

  const locationsHTML = locations
    .map(location => {
      const statusClass = location.isActive
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
      const statusText = location.isActive ? 'Ativa' : 'Inativa'

      return `
      <tr class="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12">
              ${
                location.image
                  ? `<img class="h-12 w-12 rounded-lg object-cover" src="${location.image}" alt="${location.name}">`
                  : `<div class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xl">🏢</div>`
              }
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${
                location.name
              }</div>
              <div class="text-sm text-gray-500">${
                location.floor || 'N/A'
              }</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${
            location.capacity || 'N/A'
          } pessoas</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${location.features?.length || 0} características
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div class="flex space-x-2">
            <button 
              onclick="editLocation('${location.id}')"
              class="text-blue-600 hover:text-blue-900 transition duration-200"
            >
              Editar
            </button>
            <button 
              onclick="deleteLocation('${location.id}', '${location.name}')"
              class="text-red-600 hover:text-red-900 transition duration-200"
            >
              Excluir
            </button>
          </div>
        </td>
      </tr>
    `
    })
    .join('')

  return `
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Gerenciar Localidades</h1>
          <p class="text-gray-600">Gerencie todas as localidades do sistema</p>
        </div>
        <button 
          onclick="openLocationModal()"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          Adicionar Nova Localidade
        </button>
      </div>
    </div>
    
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localidade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Características
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${locationsHTML}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="mt-6 text-center">
      <p class="text-gray-500 text-sm">
        Total de ${locations.length} localidade${
    locations.length === 1 ? '' : 's'
  }
      </p>
    </div>
    
    <!-- Modal de Localidade -->
    <div id="locationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 id="modalTitle" class="text-lg font-medium text-gray-900">Adicionar Localidade</h3>
            <button onclick="closeLocationModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form id="locationForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="locationName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input 
                  type="text" 
                  id="locationName" 
                  name="name" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da localidade"
                />
              </div>
              
              <div>
                <label for="locationFloor" class="block text-sm font-medium text-gray-700 mb-1">
                  Andar
                </label>
                <input 
                  type="text" 
                  id="locationFloor" 
                  name="floor" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2º Andar"
                />
              </div>
            </div>
            
            <div>
              <label for="locationDescription" class="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea 
                id="locationDescription" 
                name="description" 
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Descrição da localidade"
              ></textarea>
            </div>
            
            <div>
              <label for="locationCapacity" class="block text-sm font-medium text-gray-700 mb-1">
                Capacidade *
              </label>
              <input 
                type="number" 
                id="locationCapacity" 
                name="capacity" 
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número de pessoas"
              />
            </div>
            
            <div>
              <label for="locationImage" class="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input 
                type="url" 
                id="locationImage" 
                name="image" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div>
              <label for="locationFeatures" class="block text-sm font-medium text-gray-700 mb-1">
                Características (separadas por vírgula)
              </label>
              <input 
                type="text" 
                id="locationFeatures" 
                name="features" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Projetor, Ar condicionado, WiFi"
              />
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="locationActive" 
                name="isActive" 
                checked
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="locationActive" class="ml-2 block text-sm text-gray-900">
                Localidade ativa
              </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onclick="closeLocationModal()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
}

// Função para renderizar página de minhas reservas
export function renderMyReservationsPage(reservations) {
  console.log('📋 Renderizando página de minhas reservas:', reservations.length)

  if (!reservations || reservations.length === 0) {
    return `
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">📅</div>
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Nenhuma reserva encontrada</h2>
        <p class="text-gray-500 mb-6">Você ainda não possui reservas cadastradas.</p>
        <button 
          onclick="MapsTo('nova-reserva')"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Fazer Nova Reserva
        </button>
      </div>
    `
  }

  const reservationsHTML = reservations
    .map(reservation => {
      // Formatar data
      const date = reservation.date?.toDate
        ? reservation.date.toDate()
        : new Date(reservation.date)
      const formattedDate = date.toLocaleDateString('pt-BR')

      // Formatar horário
      const startTime = reservation.startTime || '--:--'
      const endTime = reservation.endTime || '--:--'

      // Status com cores
      const getStatusInfo = status => {
        switch (status) {
          case 'pending':
            return { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800' }
          case 'confirmed':
            return { text: 'Confirmada', class: 'bg-green-100 text-green-800' }
          case 'cancelled':
            return { text: 'Cancelada', class: 'bg-red-100 text-red-800' }
          case 'completed':
            return { text: 'Concluída', class: 'bg-blue-100 text-blue-800' }
          default:
            return { text: 'Desconhecido', class: 'bg-gray-100 text-gray-800' }
        }
      }

      const statusInfo = getStatusInfo(reservation.status)

      // Verificar se a reserva já passou
      const now = new Date()
      const reservationDateTime = new Date(
        `${formattedDate.split('/').reverse().join('-')} ${startTime}`
      )
      const isPast = reservationDateTime < now

      return `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200 ${
        isPast ? 'opacity-75' : ''
      }">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">${
              reservation.locationName || 'Localização não especificada'
            }</h3>
            <div class="flex items-center text-gray-600 text-sm mb-2">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>${formattedDate}</span>
            </div>
            <div class="flex items-center text-gray-600 text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${startTime} - ${endTime}</span>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusInfo.class
            }">
              ${statusInfo.text}
            </span>
            ${
              isPast ? '<span class="text-xs text-gray-500">Passada</span>' : ''
            }
          </div>
        </div>
        
        ${
          reservation.observations
            ? `
          <div class="mb-4">
            <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Observações:</strong> ${reservation.observations}
            </p>
          </div>
        `
            : ''
        }
        
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <div class="text-xs text-gray-500">
            Criada em: ${
              reservation.createdAt?.toDate
                ? reservation.createdAt.toDate().toLocaleDateString('pt-BR')
                : 'N/A'
            }
          </div>
          <div class="flex space-x-2">
            ${
              reservation.status === 'pending' && !isPast
                ? `
              <button 
                onclick="cancelReservation('${reservation.id}')"
                class="text-red-600 hover:text-red-800 text-sm font-medium transition duration-200"
              >
                Cancelar
              </button>
            `
                : ''
            }
            <button 
              onclick="viewReservationDetails('${reservation.id}')"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    `
    })
    .join('')

  return `
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Minhas Reservas</h1>
          <p class="text-gray-600">Gerencie suas reservas e acompanhe o status</p>
        </div>
        <button 
          onclick="MapsTo('nova-reserva')"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          Nova Reserva
        </button>
      </div>
    </div>
    
    <div class="space-y-4">
      ${reservationsHTML}
    </div>
    
    <div class="mt-8 text-center">
      <p class="text-gray-500 text-sm">
        Total de ${reservations.length} reserva${
    reservations.length === 1 ? '' : 's'
  }
      </p>
    </div>
  `
}

// Funções auxiliares para ações das reservas
window.cancelReservation = async function (reservationId) {
  if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
    try {
      const { updateReservation } = await import('./firestore.js')
      await updateReservation(reservationId, {
        status: 'cancelled',
        updatedAt: new Date()
      })

      mostrarMensagem('Reserva cancelada com sucesso!', 'sucesso')

      // Recarregar a página de reservas
      setTimeout(() => {
        MapsTo('minhas-reservas')
      }, 1500)
    } catch (error) {
      console.error('❌ Erro ao cancelar reserva:', error)
      mostrarMensagem('Erro ao cancelar reserva. Tente novamente.', 'erro')
    }
  }
}

window.viewReservationDetails = function (reservationId) {
  // TODO: Implementar modal ou página de detalhes
  alert(`Detalhes da reserva ${reservationId} - Em desenvolvimento`)
}

// Função para carregar e renderizar página de minhas reservas
export async function loadMyReservationsPage() {
  console.log('📋 Carregando página de minhas reservas')

  try {
    // Importar função do firestore dinamicamente
    const { getUserReservations } = await import('./firestore.js')

    // Obter usuário atual (simulado - em produção viria do auth)
    const currentUser = { uid: 'user-current' } // TODO: Obter do auth

    // Buscar reservas do usuário
    const reservations = await getUserReservations(currentUser.uid)

    // Encontrar a área de conteúdo principal
    const contentArea = document.querySelector('#content .flex-1')

    if (!contentArea) {
      console.error('❌ Área de conteúdo não encontrada')
      return
    }

    // Renderizar página de reservas
    contentArea.innerHTML = renderMyReservationsPage(reservations)

    console.log('✅ Página de minhas reservas carregada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao carregar página de minhas reservas:', error)

    const contentArea = document.querySelector('#content .flex-1')
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Erro ao carregar reservas</h2>
          <p class="text-gray-500">Não foi possível carregar suas reservas no momento.</p>
        </div>
      `
    }
  }
}

// Função para renderizar página de nova reserva
export async function renderNewReservationPage() {
  console.log('📅 Renderizando página de nova reserva')

  try {
    // Importar função do firestore dinamicamente
    const { getAvailableLocations } = await import('./firestore.js')

    // Buscar localidades disponíveis
    const locations = await getAvailableLocations()

    // Encontrar a área de conteúdo principal
    const contentArea = document.querySelector('#content .flex-1')

    if (!contentArea) {
      console.error('❌ Área de conteúdo não encontrada')
      return
    }

    // Carregar template
    const template = document.getElementById('nova-reserva-template')
    if (!template) {
      console.error('❌ Template de nova reserva não encontrado')
      return
    }

    // Inserir template
    contentArea.innerHTML = template.innerHTML

    // Preencher seletor de localidades
    const localidadeSelect = document.getElementById('localidade')
    if (localidadeSelect && locations.length > 0) {
      localidadeSelect.innerHTML =
        '<option value="">Selecione uma localidade...</option>' +
        locations
          .map(
            location =>
              `<option value="${location.id}" data-name="${location.name}">${
                location.name
              } - ${location.floor || 'N/A'}</option>`
          )
          .join('')
    }

    // Inicializar flatpickr
    initializeFlatpickr()

    // Configurar event listeners do formulário
    setupNewReservationForm()

    console.log('✅ Página de nova reserva carregada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao carregar página de nova reserva:', error)
  }
}

// Função para inicializar flatpickr
function initializeFlatpickr() {
  const dateInput = document.getElementById('data')

  if (dateInput && typeof flatpickr !== 'undefined') {
    flatpickr(dateInput, {
      dateFormat: 'd/m/Y',
      minDate: 'today',
      locale: 'pt',
      disable: [
        function (date) {
          // Desabilitar domingos
          return date.getDay() === 0
        }
      ],
      onChange: function (selectedDates, dateStr, instance) {
        console.log('📅 Data selecionada:', dateStr)
      }
    })
  } else {
    console.warn('⚠️ Flatpickr não encontrado ou campo de data não existe')
  }
}

// Função para configurar event listeners do formulário
function setupNewReservationForm() {
  const form = document.getElementById('formNovaReserva')
  const btnCancelar = document.getElementById('btnCancelarReserva')

  if (!form) {
    console.error('❌ Formulário de nova reserva não encontrado')
    return
  }

  // Event listener para submissão do formulário
  form.addEventListener('submit', async function (e) {
    e.preventDefault()

    try {
      // Obter dados do formulário
      const formData = new FormData(form)
      const localidadeId = formData.get('localidade')
      const localidadeSelect = document.getElementById('localidade')
      const localidadeName =
        localidadeSelect.selectedOptions[0]?.getAttribute('data-name') || ''
      const data = formData.get('data')
      const horaInicio = formData.get('horaInicio')
      const horaFim = formData.get('horaFim')
      const observacoes = formData.get('observacoes')

      // Validações
      if (!localidadeId) {
        mostrarMensagem('Por favor, selecione uma localidade.', 'erro')
        return
      }

      if (!data) {
        mostrarMensagem('Por favor, selecione uma data.', 'erro')
        return
      }

      if (!horaInicio || !horaFim) {
        mostrarMensagem(
          'Por favor, preencha os horários de início e fim.',
          'erro'
        )
        return
      }

      // Validar se hora de fim é maior que hora de início
      if (horaFim <= horaInicio) {
        mostrarMensagem(
          'A hora de fim deve ser maior que a hora de início.',
          'erro'
        )
        return
      }

      // Obter usuário atual (simulado - em produção viria do auth)
      const currentUser = { uid: 'user-current' } // TODO: Obter do auth

      // Preparar dados da reserva
      const reservationData = {
        userId: currentUser.uid,
        locationId: localidadeId,
        locationName: localidadeName,
        startTime: horaInicio,
        endTime: horaFim,
        date: new Date(data.split('/').reverse().join('-')), // Converter dd/mm/yyyy para Date
        observations: observacoes
      }

      // Mostrar loading
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.disabled = true
      submitBtn.textContent = 'Criando reserva...'

      // Importar função do firestore
      const { createReservation } = await import('./firestore.js')

      // Criar reserva
      const reservationId = await createReservation(reservationData)

      // Sucesso
      mostrarMensagem('Reserva efetuada com sucesso!', 'sucesso')

      // Limpar formulário
      form.reset()

      // Redirecionar para "Minhas Reservas" após 2 segundos
      setTimeout(() => {
        MapsTo('minhas-reservas')
      }, 2000)
    } catch (error) {
      console.error('❌ Erro ao criar reserva:', error)
      mostrarMensagem('Erro ao criar reserva. Tente novamente.', 'erro')
    } finally {
      // Restaurar botão
      const submitBtn = form.querySelector('button[type="submit"]')
      submitBtn.disabled = false
      submitBtn.textContent = 'Criar Reserva'
    }
  })

  // Event listener para botão cancelar
  if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
      MapsTo('dashboard-usuario')
    })
  }
}

// Função para renderizar página de localidades
export function renderLocationsPage(locations) {
  console.log('🏢 Renderizando página de localidades:', locations.length)

  if (!locations || locations.length === 0) {
    return `
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🏢</div>
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Nenhuma localização encontrada</h2>
        <p class="text-gray-500">Não há espaços disponíveis no momento.</p>
      </div>
    `
  }

  const locationsHTML = locations
    .map(location => {
      const features = location.features || location.amenities || []
      const featuresHTML = features
        .map(
          feature =>
            `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">${feature}</span>`
        )
        .join('')

      return `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200">
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          ${
            location.image
              ? `<img src="${location.image}" alt="${location.name}" class="w-full h-full object-cover">`
              : `<div class="text-gray-400 text-4xl">🏢</div>`
          }
        </div>
        
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${
            location.name
          }</h3>
          
          <div class="space-y-3 mb-4">
            ${
              location.floor
                ? `
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="text-sm">${location.floor}</span>
              </div>
            `
                : ''
            }
            
            ${
              location.capacity
                ? `
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="text-sm">Capacidade: ${location.capacity} pessoas</span>
              </div>
            `
                : ''
            }
            
          </div>
          
          ${
            location.description
              ? `
            <p class="text-gray-600 text-sm mb-4">${location.description}</p>
          `
              : ''
          }
          
          ${
            features.length > 0
              ? `
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Características:</h4>
              <div class="flex flex-wrap">
                ${featuresHTML}
              </div>
            </div>
          `
              : ''
          }
          
          <div class="flex space-x-3">
            <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium">
              Ver Detalhes
            </button>
            <button class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium">
              Reservar
            </button>
          </div>
        </div>
      </div>
    `
    })
    .join('')

  return `
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Localidades Disponíveis</h1>
      <p class="text-gray-600">Explore nossos espaços e encontre o local perfeito para sua necessidade</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${locationsHTML}
    </div>
    
    <div class="mt-8 text-center">
      <p class="text-gray-500 text-sm">
        Encontrou ${locations.length} ${
    locations.length === 1 ? 'localização' : 'localizações'
  } disponível${locations.length === 1 ? '' : 'is'}
      </p>
    </div>
  `
}

// Função para carregar template de página
export async function MapsTo(pageId) {
  console.log(`🔄 Carregando página: ${pageId}`)

  // Encontrar a área de conteúdo principal
  const contentArea = document.querySelector('#content .flex-1')

  if (!contentArea) {
    console.error('❌ Área de conteúdo não encontrada')
    return
  }

  // Verificar se é um template de dashboard
  if (pageId === 'dashboard-usuario' || pageId === 'dashboard-administrador') {
    const templateId = pageId + '-template'
    const template = document.getElementById(templateId)
    
    if (template) {
      contentArea.innerHTML = template.innerHTML
      console.log(`✅ Template ${pageId} carregado com sucesso`)
      
      // Adicionar event listeners para os cards clicáveis
      setupDashboardCardListeners()
      return
    } else {
      console.error(`❌ Template ${templateId} não encontrado`)
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Template não encontrado</h2>
          <p class="text-gray-500">O template ${pageId} não foi encontrado.</p>
        </div>
      `
      return
    }
  }

  // Verificar se é uma página especial que precisa carregar dados dinamicamente
  if (pageId === 'localidades') {
    try {
      // Importar função do firestore dinamicamente para evitar dependência circular
      const { getAvailableLocations } = await import('./firestore.js')

      // Mostrar loading
      contentArea.innerHTML = `
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Carregando localidades...</span>
        </div>
      `

      // Buscar localidades
      const locations = await getAvailableLocations()

      // Renderizar página de localidades
      contentArea.innerHTML = renderLocationsPage(locations)

      console.log(`✅ Página ${pageId} carregada com sucesso`)
      return
    } catch (error) {
      console.error(`❌ Erro ao carregar ${pageId}:`, error)
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Erro ao carregar localidades</h2>
          <p class="text-gray-500">Não foi possível carregar as localidades no momento.</p>
        </div>
      `
      return
    }
  }

  // Verificar se é a página de nova reserva
  if (pageId === 'nova-reserva') {
    try {
      // Mostrar loading
      contentArea.innerHTML = `
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Carregando formulário...</span>
        </div>
      `

      // Renderizar página de nova reserva
      await renderNewReservationPage()

      console.log(`✅ Página ${pageId} carregada com sucesso`)
      return
    } catch (error) {
      console.error(`❌ Erro ao carregar ${pageId}:`, error)
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Erro ao carregar formulário</h2>
          <p class="text-gray-500">Não foi possível carregar o formulário de nova reserva.</p>
        </div>
      `
      return
    }
  }

  // Verificar se é a página de minhas reservas
  if (pageId === 'minhas-reservas') {
    try {
      // Mostrar loading
      contentArea.innerHTML = `
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Carregando suas reservas...</span>
        </div>
      `

      // Carregar página de minhas reservas
      await loadMyReservationsPage()

      console.log(`✅ Página ${pageId} carregada com sucesso`)
      return
    } catch (error) {
      console.error(`❌ Erro ao carregar ${pageId}:`, error)
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Erro ao carregar reservas</h2>
          <p class="text-gray-500">Não foi possível carregar suas reservas no momento.</p>
        </div>
      `
      return
    }
  }

  // Verificar se é a página de configurações do admin
  if (pageId === 'configuracoes') {
    try {
      // Mostrar loading
      contentArea.innerHTML = `
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Carregando configurações...</span>
        </div>
      `

      // Carregar página de configurações do admin
      await loadAdminConfigPage()

      console.log(`✅ Página ${pageId} carregada com sucesso`)
      return
    } catch (error) {
      console.error(`❌ Erro ao carregar ${pageId}:`, error)
      contentArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-400 text-6xl mb-4">❌</div>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Erro ao carregar configurações</h2>
          <p class="text-gray-500">Não foi possível carregar as configurações no momento.</p>
        </div>
      `
      return
    }
  }

  // Para outras páginas, usar o sistema de templates
  const template = document.getElementById(pageId + '-template')

  if (!template) {
    console.error(`❌ Template não encontrado: ${pageId}-template`)
    contentArea.innerHTML = `
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🚧</div>
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Página em desenvolvimento</h2>
        <p class="text-gray-500">Esta funcionalidade será implementada em breve!</p>
      </div>
    `
    return
  }

  // Copiar o innerHTML do template e inserir na área de conteúdo
  contentArea.innerHTML = template.innerHTML

  console.log(`✅ Página ${pageId} carregada com sucesso`)
}

// Função para configurar navegação do menu
export function configurarNavegacaoMenu(role) {
  console.log('🔧 Configurando navegação do menu para role:', role)
  const sidebar = document.getElementById('sidebar')

  if (!sidebar) {
    console.error('❌ Sidebar não encontrada')
    return
  }

  console.log('✅ Sidebar encontrada, configurando event listeners...')

  // Adicionar um único event listener na sidebar
  sidebar.addEventListener('click', function (e) {
    console.log('🖱️ Clique detectado na sidebar:', e.target)

    // Verificar se o clique foi em um link do menu
    const menuLink = e.target.closest('a[data-page]')

    if (!menuLink) {
      console.log('❌ Clique não foi em um link do menu')
      return
    }

    console.log('✅ Clique em link do menu:', menuLink)

    // Prevenir ação padrão do link
    e.preventDefault()

    // Obter o valor do atributo data-page
    const pageId = menuLink.getAttribute('data-page')
    console.log('📄 PageId:', pageId)

    if (!pageId) {
      console.error('❌ Atributo data-page não encontrado')
      return
    }

    // Remover classe active de todos os itens do menu
    const allMenuItems = sidebar.querySelectorAll('a[data-page]')
    allMenuItems.forEach(item => {
      item.classList.remove('bg-gray-700', 'text-white')
      item.classList.add('text-gray-300')
    })

    // Adicionar classe active ao item clicado
    menuLink.classList.remove('text-gray-300')
    menuLink.classList.add('bg-gray-700', 'text-white')

    // Atualizar título do header
    const contentHeader = document.querySelector('#content header h1')
    if (contentHeader) {
      contentHeader.textContent = menuLink.textContent
    }

    // Carregar a página usando MapsTo (assíncrono)
    console.log('🚀 Chamando MapsTo para página:', pageId)
    MapsTo(pageId).catch(error => {
      console.error('❌ Erro ao carregar página:', error)
    })
  })
}

// Função para animação de entrada dos elementos
export function animarEntrada() {
  const elementos = document.querySelectorAll('#login-container > div > *')

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

// Função para adicionar estilos CSS necessários
export function addRequiredStyles() {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}

// Função para configurar event listeners dos cards do dashboard
function setupDashboardCardListeners() {
  const cards = document.querySelectorAll('[data-page]')
  
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault()
      const pageId = this.getAttribute('data-page')
      if (pageId) {
        console.log(`🔄 Navegando para: ${pageId}`)
        MapsTo(pageId)
      }
    })
  })
  
  console.log(`✅ ${cards.length} cards do dashboard configurados`)
}

// Função para inicializar a UI
export function initializeUI() {
  // Adicionar estilos necessários
  addRequiredStyles()

  // Iniciar animação de entrada
  animarEntrada()

  console.log('✅ UI inicializada com sucesso!')
}
