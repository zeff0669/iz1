const usuario = JSON.parse(localStorage.getItem('usuario'))
import Router from 'src/router/index'
import checkTicketFilter from 'src/utils/checkTicketFilter'
import { socketIO } from 'src/utils/socket'
import { ConsultarTickets } from 'src/service/tickets'
import { orderBy } from 'lodash'
import { parseISO } from 'date-fns'

const socket = socketIO()

const userId = +localStorage.getItem('userId')

// localStorage.debug = '*'

socket.on(`tokenInvalid:${socket.id}`, () => {
  socket.disconnect()
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('profile')
  localStorage.removeItem('userId')
  localStorage.removeItem('usuario')
  setTimeout(() => {
    Router.push({
      name: 'login'
    })
  }, 1000)
})

export default {
  created() {
    socket.on(`${usuario.tenantId}:mensagem-chat-interno`, data => {
      //console.log('mensagem-chat-interno')
      if (data.action === 'update' && (data.data.receiverId == usuario.userId || data.data.groupId != null)) {
        this.$store.commit('MENSAGEM_INTERNA_UPDATE', data)
      }
    })
    
    socket.on(`${usuario.tenantId}:unread-mensagem-chat-interno`, data => {
      //console.log('unread-mensagem-chat-interno')
      if (data.action === 'update' && data.data.senderId == usuario.userId) {
        this.$store.commit('UNREAD_MENSAGEM_INTERNA_UPDATE', data)
      }
    })
    
    socket.on(`${usuario.tenantId}:mensagem-chat-interno-notificacao`, data => {
      //console.log('mensagem-chat-interno-notificacao')
      if (data.action === 'update' && (data.data.receiverId == usuario.userId || data.data.groupId != null)) {
        this.$store.commit('NOTIFICACAO_CHAT_INTERNO_UPDATE', data)
      }
    })
    
    socket.on('verifyOnlineUsers', data => {
      this.$store.commit('LISTA_USUARIOS_CHAT_INTERNO', { action: 'updateAllUsers', data: {} })
      this.socket.emit(`${usuario.tenantId}:userVerified`, usuario)
    })

    socket.on(`${usuario.tenantId}:user-online`, data => {
      if (data.action === 'update' && data.data.userId !== usuario.userId) {
        this.$store.commit('USER_CHAT_UPDATE', data)
      }
    })
    
    socket.on(`${usuario.tenantId}:updateStatusUser`, async () => {
      const { data } = await ListarUsuariosChatInterno()
      this.$store.commit('LISTA_USUARIOS_CHAT_INTERNO', { action: 'create', data: data.users })
    })
  },
  methods: {
    scrollToBottom () {
      setTimeout(() => {
        this.$root.$emit('scrollToBottomMessageChat')
      }, 200)
    },
    socketMessagesList () {

    },
    socketTicket () {
      socket.on('connect', () => {
        socket.on(`${usuario.tenantId}:ticket`, data => {
          if (data.action === 'update' && data.ticket.userId === userId) {
            if (data.ticket.status === 'open' && !data.ticket.isTransference) {
              this.$store.commit('TICKET_FOCADO', data.ticket)
            }
          }
        })
      })
    },
    socketTicketList () {
      this.socketTicketListNew()
    },
    socketTicketListNew () {
      socket.on('connect', () => {

        socket.on(`${usuario.tenantId}:ticketList`, async data => {
          if (data.type === 'chat:create') {
            if (
              !data.payload.read &&
              (data.payload.ticket.userId === userId || !data.payload.ticket.userId) &&
              data.payload.ticket.id !== this.$store.getters.ticketFocado.id
            ) {
              if (checkTicketFilter(data.payload.ticket)) {
                this.handlerNotifications(data.payload)
              }
            }
            this.$store.commit('UPDATE_MESSAGES', data.payload)
            this.scrollToBottom()

            // const params = {
            //   searchParam: '',
            //   pageNumber: 1,
            //   status: ['open'],
            //   showAll: false,
            //   count: null,
            //   queuesIds: [],
            //   withUnreadMessages: false,
            //   isNotAssignedUser: false,
            //   includeNotQueueDefined: true
            //   // date: new Date(),
            // }
            // try {
            //   const { data } = await ConsultarTickets(params)
            //   console.log(data)
            //   this.countTickets = data.count // count total de tickets no status            
            //   this.$store.commit('UPDATE_NOTIFICATIONS', data)
            //   const orderTickets = (tickets) => {
            //     const newTickes = orderBy(tickets, (obj) => parseISO(obj.lastMessageAt || obj.updatedAt), ['asc'])
            //     return [...newTickes]
            //   }
            //   const newTickets = orderTickets(data.tickets)            
            //   this.$store.commit('LOAD_TICKETS', newTickets)
            //   this.$store.commit('UPDATE_TICKET', newTickets)
            // } catch (err) {
            //   console.log('error try')
            // }

            // const params = {
            //   searchParam: '',
            //   pageNumber: 1,
            //   status: ['open'],
            //   showAll: false,
            //   count: null,
            //   queuesIds: [],
            //   withUnreadMessages: true,
            //   isNotAssignedUser: false,
            //   includeNotQueueDefined: true
            //   // date: new Date(),
            // }
            // try {
            //   //console.log('try')
            //   const { data } = await ConsultarTickets(params)
            //   console.log(data)
            //   //console.log('try 1')
            //   this.countTickets = data.count // count total de tickets no status
            //   //console.log('try 2')
            //   // this.ticketsList = data.tickets
            //   this.$store.commit('UPDATE_NOTIFICATIONS', data)
            //   //console.log('try 3')
            //   // this.$store.commit('SET_HAS_MORE', data.hasMore)
            //   // console.log(this.notifications)
            // } catch (err) {
            //   console.log('error try')
            // }
          }

          if (data.type === 'chat:ack' || data.type === 'chat:delete') {
            this.$store.commit('UPDATE_MESSAGE_STATUS', data.payload)
          }

          if (data.type === 'chat:update') {
            this.$store.commit('UPDATE_MESSAGE', data.payload)
          }

          if (data.type === 'ticket:update') {
            this.$store.commit('UPDATE_TICKET', data.payload)
            this.$store.commit('UPDATE_NOTIFICATIONS', data.payload)
          }
        })

        socket.on(`${usuario.tenantId}:ticketList`, async data => {
          var verify = []
          if (data.type === 'notification:new') {
            // console.log(data)
            // Atualiza notificações de mensagem
            // var data_noti = []
            const params = {
              searchParam: '',
              pageNumber: 1,
              status: ['pending'],
              showAll: false,
              count: null,
              queuesIds: [],
              withUnreadMessages: false,
              isNotAssignedUser: false,
              includeNotQueueDefined: true
              // date: new Date(),
            }
            try {
              const data_noti = await ConsultarTickets(params)
              this.$store.commit('UPDATE_NOTIFICATIONS_P', data_noti.data)
              verify = data_noti
            } catch (err) {
              this.$notificarErro('Algum problema ao consultar tickets', err)
              console.error(err)
            }
            // Faz verificação para se certificar que notificação pertence a fila do usuário
            var pass_noti = false
            verify.data.tickets.forEach((element) => { pass_noti = (element.id == data.payload.id ? true : pass_noti) })
            // Exibe Notificação
            if (pass_noti) {
              const message = new self.Notification('Novo cliente pendente', {
                body: 'Cliente: ' + data.payload.contact.name,
                tag: 'simple-push-demo-notification'
              })
              console.log(message)
            }
          }
        })

        socket.on(`${usuario.tenantId}:contactList`, data => {
          this.$store.commit('UPDATE_CONTACT', data.payload)
        })
      })
    },
    socketDisconnect () {
      socket.disconnect()
    }
  }
}
