const usuario = JSON.parse(localStorage.getItem('usuario'))
import Router from 'src/router/index'
import { socketIO } from '../utils/socket'
import { ConsultarTickets } from 'src/service/tickets'
import { orderBy } from 'lodash'
import { parseISO } from 'date-fns'

const socket = socketIO()

const userId = +localStorage.getItem('userId')

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
  methods: {
    socketInitial () {
      socket.emit(`${usuario.tenantId}:joinNotification`)

      socket.io.on(`${usuario.tenantId}:whatsapp`, data => {
        if (data.action === 'update') {
          this.$store.commit('UPDATE_WHATSAPPS', data.whatsapp)
        }
      })

      socket.on(`${usuario.tenantId}:whatsapp`, data => {
        if (data.action === 'delete') {
          this.$store.commit('DELETE_WHATSAPPS', data.whatsappId)
        }
      })

      socket.on(`${usuario.tenantId}:whatsappSession`, data => {
        if (data.action === 'update') {
          this.$store.commit('UPDATE_SESSION', data.session)
          this.$root.$emit('UPDATE_SESSION', data.session)
        }

        if (data.action === 'readySession') {
          this.$q.notify({
            position: 'top',
            icon: 'mdi-wifi-arrow-up-down',
            message: `A conexão com o WhatsApp está pronta e o mesmo está habilitado para enviar e receber mensagens. Conexão: ${data.session.name}. Número: ${data.session.number}.`,
            type: 'positive',
            color: 'primary',
            html: true,
            progress: true,
            timeout: 7000,
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }],
            classes: 'text-body2 text-weight-medium'
          })
        }
      })

      socket.on(`${usuario.tenantId}:change_battery`, data => {
        this.$q.notify({
          message: `Bateria do celular do whatsapp ${data.batteryInfo.sessionName} está com bateria em ${data.batteryInfo.battery}%. Necessário iniciar carregamento.`,
          type: 'negative',
          progress: true,
          position: 'top',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
      })

      socket.on(`${usuario.tenantId}:ticketList`, async (data) => {
        console.log('socket ON')
        if (data.type === 'chat:create') {
          // console.log('chat:create')
          if (data.payload.ticket.userId !== userId) return
          if (data.payload.fromMe) return
          new self.Notification('Contato: ' + data.payload.ticket.contact.name, {
            body: 'Mensagem: ' + data.payload.body,
            tag: 'simple-push-demo-notification',
            image: data.payload.ticket.contact.profilePicUrl,
            icon: data.payload.ticket.contact.profilePicUrl,
          })
          this.$store.commit('UPDATE_MESSAGES', data.payload)
          const params = {
            searchParam: '',
            pageNumber: 1,
            status: ['open'],
            showAll: false,
            count: null,
            queuesIds: [],
            withUnreadMessages: false,
            isNotAssignedUser: false,
            includeNotQueueDefined: true
            // date: new Date(),
          }
          try {
            const { data } = await ConsultarTickets(params)
            // console.log(data)
            this.countTickets = data.count // count total de tickets no status            
            this.$store.commit('UPDATE_NOTIFICATIONS', data)
            const orderTickets = (tickets) => {
              const newTickes = orderBy(tickets, (obj) => parseISO(obj.lastMessageAt || obj.updatedAt), ['asc'])
              return [...newTickes]
            }
            const newTickets = orderTickets(data.tickets)    
            // console.log('try ORDER_TICKETS', newTickets.map(ticket => ({ id: ticket.id, lastMessageAt: ticket.lastMessageAt })))      
            setTimeout(() => {
              // console.log('try LOAD_TICKETS')
              this.$store.commit('LOAD_TICKETS', newTickets);
            }, 500);
            setTimeout(() => {
              // console.log('try UPDATE_TICKET')
              this.$store.commit('UPDATE_TICKET', newTickets);
            }, 1000);
            setTimeout(() => {
              // console.log('try UPDATE_CONTACT')
              this.$store.commit('UPDATE_CONTACT', newTickets);
              this.$store.commit('UPDATE_NOTIFICATIONS', data)
            }, 1500);
          } catch (err) {
            console.log('error try', err)
          }
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
            const orderTickets = (tickets) => {
              const newTickes = orderBy(tickets, (obj) => parseISO(obj.lastMessageAt || obj.updatedAt), ['asc'])
              return [...newTickes]
            }
            const newTickets = orderTickets(data_noti.tickets)    
            // console.log('try ORDER_TICKETS', newTickets.map(ticket => ({ id: ticket.id, lastMessageAt: ticket.lastMessageAt })))      
            setTimeout(() => {
              // console.log('try LOAD_TICKETS')
              this.$store.commit('LOAD_TICKETS', newTickets);
            }, 500);
            setTimeout(() => {
              // console.log('try UPDATE_TICKET')
              this.$store.commit('UPDATE_TICKET', newTickets);
            }, 1000);
            setTimeout(() => {
              // console.log('try UPDATE_CONTACT')
              this.$store.commit('UPDATE_CONTACT', newTickets);
              this.$store.commit('UPDATE_NOTIFICATIONS_P', data_noti)
            }, 1500);
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
    }
  },
  mounted () {
    this.socketInitial()
  },
  destroyed () {
    socket.disconnect()
  }
}
