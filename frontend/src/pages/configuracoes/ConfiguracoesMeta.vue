<template>
  <div v-if="userProfile === 'admin'">
    <q-list class="text-weight-medium">

      <div class="row q-px-md">
        <div class="col-12">
          <q-input
            v-model="metaToken"
            type="textarea"
            autogrow
            dense
            outlined
            label="Token Webhook Meta"
            input-style="min-height: 6vh; max-height: 9vh;"
            debounce="700"
            @input="alterarMetaToken()"
          />
        </div>
      </div>
      
      <div class="row q-px-md" style="margin-top: 20px;">
        <div class="col-12">
            <p class="text-weight-medium text-nowrap q-pr-md blur-effect">
              <span class="text-bold">Webhook Meta:
              </span>
              {{ montarUrlIntegração() }}
            </p>
            <p v-if="this.webhookChecked" class="text-weight-medium text-nowrap q-pr-md blur-effect">
              <span class="text-bold">Verificado em:
              </span>
              {{ formatarDataBrasil(this.webhookChecked) }}
            </p>
        </div>
      </div>

    </q-list>
  </div>
</template>

<script>
const usuario = JSON.parse(localStorage.getItem('usuario'))
import { ListarTenantPorId, AlterarTenantMeta } from 'src/service/tenants'
import { defineComponent } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default defineComponent({
  name: 'IndexConfiguracoes',
  data() {
    return {
      usuario,
      metaToken: '',
      webhookChecked: '',
      loading: false,
      userProfile: 'user'
    }
  },
  computed: {
    cBaseUrlIntegração () {
      return `${process.env.URL_API}/metaWebhook`
    }
  },
  methods: {
    formatarDataBrasil(data) {
      const dataObjeto = new Date(data);
      return format(dataObjeto, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
    },
    montarUrlIntegração() {
      return `${this.cBaseUrlIntegração}/${this.usuario.tenantId}`
    },
    formatarData(data) {
      const dataFormatada = new Date(data);
      return dataFormatada.toLocaleDateString('pt-BR');
    },
    async alterarMetaToken(){
      try {
        await AlterarTenantMeta({
          id: this.usuario.tenantId,
          metaToken: this.metaToken,
        })
        this.$q.notify({
          type: 'positive',
          message: 'Configuração alterada!',
          progress: true,
          actions: [{ icon: 'close', round: true, color: 'white' }],
        })
      } catch (error) {
        console.error('error - AlterarConfiguracao', error)
        this.$notificarErro('Ocorreu um erro!', error)
      } 
    },
    async listarTenantPorId(){
      this.loading = true; 
      const { data } = await ListarTenantPorId(this.usuario.tenantId)
      this.metaToken = data[0].metaToken
      this.webhookChecked = data[0].webhookChecked
    },
  },
  async mounted() {
    await this.listarTenantPorId()
    this.userProfile = localStorage.getItem('profile')
  },
})
</script>
