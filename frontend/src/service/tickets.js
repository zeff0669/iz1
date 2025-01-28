import request from 'src/service/request'

export function ConsultarTickets(params) {
  return request({
    url: '/tickets',
    method: 'get',
    params,
  })
}

export function ConsultarDadosTicket(params) {
  return request({
    url: `/tickets/${params.id}`,
    method: 'get',
    params,
  })
}

export function ConsultarLogsTicket(params) {
  return request({
    url: `/tickets/${params.ticketId}/logs`,
    method: 'get',
    params,
  })
}

export function AtualizarStatusTicket(ticketId, status, userId) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data: {
      status,
      userId,
    },
  })
}

export function AtualizarTypebotTicket(ticketId, typebotStatus) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data: {
      typebotStatus
    },
  })
}

export function AtualizarDialogflowTicket(ticketId, dialogflowStatus) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data: {
      dialogflowStatus
    },
  })
}

export function AtualizarChatgptTicket(ticketId, chatgptStatus) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data: {
      chatgptStatus
    },
  })
}

export function AtualizarTicket(ticketId, data) {
  return request({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data,
  })
}

export function LocalizarMensagens(params) {
  return request({
    url: `/messages/${params.ticketId}`,
    method: 'get',
    params,
  })
}

export function EnviarMensagemTexto(ticketId, data) {
  return request({
    url: `/messages/${ticketId}`,
    method: 'post',
    data,
  })
}

export function EditarMensagemText(messageId, message) {
  return request({
    url: `/messages/${messageId}`,
    method: 'PATCH',
    data: message,
  })
}

export function EncaminharMensagem(messages, contato) {
  const data = {
    messages,
    contact: contato,
  }
  return request({
    url: '/forward-messages/',
    method: 'post',
    data,
  })
}

export function DeletarMensagem(mensagem) {
  return request({
    url: `/messages`,
    method: 'delete',
    data: {
      id: mensagem.id,
      messageId: mensagem.messageId,
    },
  })
}

export function CriarTicket(data) {
  return request({
    url: '/tickets',
    method: 'post',
    data,
  })
}

export function SyncOldMessagesWbot(data) {
  return request({
    url: '/messages/syncOld',
    method: 'post',
    data,
  })
}

export function SyncOldMessagesByUserWbot(data) {
  return request({
    url: '/messages/syncOldByUser',
    method: 'post',
    data,
  })
}

export function SendGhostMessage(data) {
  return request({
    url: '/messages/ghostMessage',
    method: 'post',
    data,
  })
}

export function SendMentionMessage(data) {
  return request({
    url: '/messages/mentionMessage',
    method: 'post',
    data,
  })
}

export function SendMentionAllMessage(data) {
  return request({
    url: '/messages/mentionAllMessage',
    method: 'post',
    data,
  })
}

export function SendReactionMessage(data) {
  return request({
    url: '/messages/reactionMessage',
    method: 'post',
    data,
  })
}

export function SendEditMessage(data) {
  return request({
    url: '/messages/editMessage',
    method: 'post',
    data,
  })
}

export function ListParticipants(data) {
  return request({
    url: '/messages/listParticipants',
    method: 'post',
    data,
  })
}

export function CountMensage (params) {
  return request({
    url: '/count/messages',
    method: 'get',
    params
  })
}

export function LimpartHistoricoGpt(params) {
  return request({
    url: '/ticketsClear',
    method: 'get',
    params,
  })
}