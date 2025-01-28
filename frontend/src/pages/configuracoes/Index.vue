<template>
  <div v-if="userProfile === 'admin'">
    <q-tabs class="text-teal" align="left">
      <q-route-tab
        to="/configuracoes/geral"
        name="settings"
        no-caps
        icon="settings"
        label="Config. Gerais"
      />
      <q-route-tab
        v-if="asaas"
        to="/configuracoes/pagamentos"
        name="pagamentos"
        no-caps
        icon="payments"
        label="Config. Pagamento"
      />
      <q-route-tab
        to="/configuracoes/webhooks"
        name="webhooks"
        icon="webhook"
        no-caps
        label="Config. Webhooks"
      />
      <q-route-tab
        to="/configuracoes/smtp"
        name="smtp"
        icon="mdi-email"
        no-caps
        label="Config. SMTP"
      />
      <q-route-tab
        to="/configuracoes/typebot"
        name="typebot"
        icon="smart_toy"
        no-caps
        label="Config. Typebot"
      />
      <q-route-tab
        to="/configuracoes/dialogflow"
        name="dialogflow"
        icon="smart_toy"
        no-caps
        label="Config. Dialogflow"
      />
      <q-route-tab
        to="/configuracoes/chat-gpt"
        name="chat gpt"
        icon="smart_toy"
        no-caps
        label="Config. Chat GPT"
      />
      <q-route-tab
        to="/configuracoes/meta"
        name="meta"
        icon="mdi-whatsapp"
        no-caps
        label="Config. Meta"
      />
      <q-route-tab
        to="/configuracoes/lanes"
        name="lanes"
        icon="mdi-tray-full"
        no-caps
        label="Config. Kanban"
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script>
const usuario = JSON.parse(localStorage.getItem('usuario'))
import { ListarTenantPorId } from 'src/service/tenants'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexConfiguracoes',
  data() {
    return {
      userProfile: 'user',
      usuario,
      asaas: false,
    }
  },
  methods: {
    async listarTenantPorId(){
      const { data } = await ListarTenantPorId(this.usuario.tenantId)
      if (data[0].asaas === 'enabled'){
        this.asaas = true
      } else {
        this.asaas = false
      }
    },
  },
  async mounted() {
    await this.listarTenantPorId()
    this.userProfile = localStorage.getItem('profile')
  },
})
</script>
