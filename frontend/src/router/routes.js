const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: (to) => {
      const userProfile = localStorage.getItem('profile');
      const isSuperAdmin = userProfile === 'superadmin';
      return isSuperAdmin ? { name: 'tenants' } : { name: 'contatos' };
    },
    children: [
      {
        path: '',
        component: () => import('pages/contatos/Index.vue'),
        beforeEnter: (to, from, next) => {
          const userProfile = localStorage.getItem('profile');
          const isSuperAdmin = userProfile === 'superadmin';
          if (isSuperAdmin) {
            next({ name: 'tenants' });
          } else {
            next();
          }
        }
      },
      {
        path: '/tenants',
        name: 'tenants',
        component: () => import('pages/tenants/Index.vue')
      },
      {
        path: '/home',
        name: 'home-dashboard',
        component: () => import('pages/dashboard/Index.vue'),
        beforeEnter: (to, from, next) => {
          const userProfile = localStorage.getItem('profile');
          const isSuperAdmin = userProfile === 'superadmin';
          if (isSuperAdmin) {
            next({ name: 'tenants' });
          } else {
            next();
          }
        }
      },
      {
        path: '/painel-atendimentos',
        name: 'painel-atendimentos',
        component: () => import('pages/dashboard/DashTicketsFilas.vue')
      },
      // { path: '/ConsultarTicketsQueuesService', name: 'dashboard', component: () => import('pages/dashboard/Index.vue') },
      {
        path: '/sessoes',
        name: 'sessoes',
        component: () => import('pages/sessaoWhatsapp/Index.vue')
      },
      {
        path: '/sessoestenants',
        name: 'sessoestenants',
        component: () => import('pages/sessaoTenants/Index.vue')
      },
      {
        path: '/pagamentostenants',
        name: 'pagamentostenants',
        component: () => import('pages/pagamentoTenants/Index.vue')
      },
      {
        path: '/contatos',
        name: 'contatos',
        component: () => import('pages/contatos/Index.vue')
      },
      {
        path: '/usuarios',
        name: 'usuarios',
        component: () => import('pages/usuarios/Index.vue')
      },
      {
        path: '/usuariotenants',
        name: 'usuariotenants',
        component: () => import('pages/usuarioTenants/Index.vue')
      },
      {
        path: '/auto-resposta',
        name: 'auto-resposta',
        component: () => import('pages/fluxoAutoResposta/Index.vue')
      },
      {
        path: '/mensagens-rapidas',
        name: 'mensagens-rapidas',
        component: () => import('pages/mensagensRapidas/Index.vue')
      },
      {
        path: '/filas',
        name: 'filas',
        component: () => import('pages/filas/Index.vue')
      },
      {
        path: '/equipes',
        name: 'equipes',
        component: () => import('pages/equipes/Index.vue')
      },
      {
        path: '/kanban',
        name: 'kanban',
        component: () => import('pages/kanban/Index.vue')
      },
      {
        path: '/tarefas',
        name: 'tarefas',
        component: () => import('pages/tarefas/Index.vue')
      },
      {
        path: '/notas',
        name: 'notas',
        component: () => import('pages/notas/Index.vue')
      },
      {
        path: '/lanes',
        name: 'lanes',
        component: () => import('pages/lanes/Index.vue')
      },
      {
        path: '/configuracoes',
        name: 'configuracoes',
        redirect: '/configuracoes/geral',
        component: () => import('pages/configuracoes/Index.vue'),
        children: [
          {
            path: 'geral',
            name: 'configuracoes-geral',
            component: () =>
              import('pages/configuracoes/ConfiguracoesGerais.vue')
          },
          {
            path: 'webhooks',
            name: 'configuracoes-webhooks',
            component: () =>
              import('pages/configuracoes/ConfiguracoesWebhooks.vue')
          },
          {
            path: 'typebot',
            name: 'configuracoes-typebot',
            component: () =>
              import('pages/configuracoes/ConfiguracoesTypebot.vue')
          },
          {
            path: 'dialogflow',
            name: 'configuracoes-dialogflow',
            component: () =>
              import('pages/configuracoes/ConfiguracoesDialogflow.vue')
          },
          {
            path: 'chat-gpt',
            name: 'configs-chat-gpt',
            component: () =>
              import('pages/configuracoes/ConfiguracoesChatGPT.vue')
          },
          {
            path: 'lanes',
            name: 'configs-lanes',
            component: () =>
              import('pages/configuracoes/ConfiguracoesLanes.vue')
          },
          {
            path: 'meta',
            name: 'configs-meta',
            component: () =>
              import('pages/configuracoes/ConfiguracoesMeta.vue')
          },
          {
            path: 'smtp',
            name: 'configs-smtp',
            component: () =>
              import('pages/configuracoes/ConfiguracoesSMTP.vue')
          },
          {
            path: 'pagamentos',
            name: 'configs-pagamento',
            component: () =>
              import('pages/configuracoes/ConfiguracoesPagamento.vue')
          }
        ]
      },
      {
        path: '/massa',
        name: 'massa',
        component: () => import('pages/massa/MassaTexto.vue'),
        children: [
          {
            path: 'texto',
            name: 'massa-texto',
            component: () =>
              import('pages/massa/MassaTexto.vue')
          },
        ]
      },
      {
        path: '/grupo',
        name: 'grupo',
        component: () => import('pages/grupo/Index.vue'),
        children: [
          {
            path: 'banlist',
            name: 'banlist',
            component: () =>
              import('pages/grupo/geral/Banlist.vue')
          },
          {
            path: 'wordlist',
            name: 'wordlist',
            component: () =>
              import('pages/grupo/geral/Wordlist.vue')
          },
          {
            path: 'saudacao',
            name: 'saudacao',
            component: () =>
              import('pages/grupo/geral/Saudacao.vue')
          },
          {
            path: 'despedida',
            name: 'despedida',
            component: () =>
              import('pages/grupo/geral/Despedida.vue')
          },
          {
            path: 'massagrupos',
            name: 'massagrupos',
            component: () =>
              import('pages/grupo/massa/MassaGrupos.vue')
          },
          {
            path: 'massagrupos2',
            name: 'massagrupos2',
            component: () =>
              import('pages/grupo/massa/MassaGrupos2.vue')
          },
          {
            path: 'massausuarios',
            name: 'massausuarios',
            component: () =>
              import('pages/grupo/massa/MassaUsuarios.vue')
          },
        ]
      },
      {
        path: '/etiquetas',
        name: 'etiquetas',
        component: () => import('pages/etiquetas/Index.vue')
      },
      {
        path: '/protocolos',
        name: 'protocolos',
        component: () => import('pages/protocolos/Index.vue')
      },
      {
        path: '/avaliacoes',
        name: 'avaliacoes',
        component: () => import('pages/avaliacoes/Index.vue')
      },
      {
        path: '/campanhas',
        name: 'campanhas',
        component: () => import('pages/campanhas/Index.vue')
      },
      {
        path: '/campanhas/:campanhaId',
        name: 'contatos-campanha',
        component: () => import('pages/campanhas/ContatosCampanha.vue')
      },
      {
        path: '/horario-atendimento',
        name: 'horarioAtendimento',
        component: () => import('pages/horarioAtendimento/Index.vue')
      },
      {
        path: '/api-service',
        name: 'api-service',
        component: () => import('pages/api/Index.vue')
      },
      {
        path: '/chat-flow',
        component: () => import('pages/chatFlow/Index.vue'),
        redirect: 'chat-flow',
        children: [
          {
            path: '',
            name: 'chat-flow',
            component: () => import('pages/chatFlow/ListaChatFlow.vue')
          },
          {
            path: 'builder',
            name: 'chat-flow-builder',
            component: () => import('components/ccFlowBuilder/panel.vue')
          }
        ]
      },
      {
        path: '/configuracoesbloqueio',
        name: 'configuracoesbloqueio',
        component: () => import('pages/configuracoesPagamentoAtrasado/Index.vue'),
      },
    ]
  },
  {
    path: '/chat-interno',
    name: 'chat-interno',
    component: () => import('pages/chatInterno/index.vue')
  },
  {
    path: '/relatorios',
    redirect: 'relatorios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'relatorios',
        component: () => import('pages/relatorios/ccListaRelatorios')
      },
      {
        path: 'estatisticas-atendimentos-usuarios',
        name: 'estatisticas-atendimentos-usuarios',
        component: () =>
          import('pages/relatorios/RelatorioResumoAtendimentosUsuarios')
      },
      {
        path: 'lista-contatos',
        name: 'lista-contatos',
        component: () => import('pages/relatorios/RelatorioContatosGeral')
      },
      {
        path: 'contatos-por-etiquetas',
        name: 'contatos-por-etiquetas',
        component: () => import('pages/relatorios/RelatorioContatosEtiquetas')
      },
      {
        path: 'contatos-por-estado',
        name: 'contatos-por-estado',
        component: () => import('pages/relatorios/RelatorioContatosEstado')
      }
    ]
  },
  {
    path: '/atendimento',
    name: 'atendimento',
    // redirect: { name: 'chat-empty' },
    component: () => import('pages/atendimento/Index.vue'),
    children: [
      {
        path: '/chats/',
        name: 'chat-empty',
        component: () => import('pages/atendimento/Chat/Chat.vue'),
        beforeEnter (to, from, next) {
          if (from.name === 'chat-empty') {
            next(false); // Evita a navegação redundante
          } else {
            next(); // Permite a navegação normal
          }
        }
      },      
      {
        path: ':ticketId',
        name: 'chat',
        component: () => import('pages/atendimento/Chat/Chat.vue'),
        beforeEnter(to, from, next) {
          if (from.name === 'chat-empty' && to.name === 'chat-empty') {
            next(false);
          } else {
            next();
          }
        }
        // beforeEnter (to, from, next) {
        //   if (!from.params.ticketId) {
        //     next({ name: 'chat-empty' })
        //   }
        //   next()
        // }
      },
      {
        path: 'contatos',
        name: 'chat-contatos',
        component: () => import('pages/contatos/Index.vue'),
        props: { isChatContact: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue')
  }
]

export default routes
