<template>
  <q-dialog @hide="$emit('hide')" ref="dialog">
    <q-card
      :style="{
        fontFamily: 'Inter, sans-serif',
        width: '900px',
        minWidth: '400px',
        maxWidth: '85vw',
        borderRadius: '8px',
        minHeight: '300px',
      }"
      class="q-pa-lg"
    >
      <div class="column q-gutter-sm no-wrap">
        <div>
          <div class="row">
            <div class="col-xs-12 text-primary text-weight-bold text-20">Sentimento da conversa com ContrateIA</div>
            <q-btn style="top: 10px; right: 15px" class="absolute" color="primary" round icon="close" flat v-close-popup />
          </div>
        </div>

        <div v-if="resumo">
          <div class="column q-gutter-sm">
            <div v-for="(paragrafo, idx) in resumo.split('- O usuário ')" :key="idx" v-html="paragrafo"></div>
          </div>
        </div>
      </div>
      <q-inner-loading :showing="loading" label="Resumindo conversa..." />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { BuscarConfiguracao } from 'src/service/configuracoes'
import axios from 'axios'

export default defineComponent({
  props: ['mensagens'],
  emits: ['hide', 'ok', 'close'],
  components: {},
  data() {
    return {
      resumo: null,
      loading: true,
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    async buscarToken() {
      const { data } = await BuscarConfiguracao('chatgptApiKey')
      return data.value
    },
    async resumirMensagens() {
      try {
        const token = await this.buscarToken()
        if (!token) throw new Error('Token da OpenAI não configurado!')

        const { data } = await axios({
          url: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            model: 'gpt-3.5-turbo',
            temperature: 0,
            messages: [
              { role: 'user', content: 'analise o sentimento do cliente nessa conversa de forma resumida, mas sem perder os pontos importantes no resumo.' },
              { role: 'user', content: 'ao finalizar a análise escreva como se fosse um robô chamado ContrateIA' },
              ...this.mensagens.map((msg) => {
                return { role: 'user', content: `O usuário "${msg.sender}" disse: ${msg.body}` }
              }),
              { role: 'user', content: 'FIM DA CONVERSA.' },
            ],
          },
        })

        const response = data?.choices?.[0]?.message?.content
        if (!response) throw new Error('Não foi possível resumir a conversa')

        this.resumo = response.replace('\n', '<br />')
        console.log(this.resumo)
      } catch (e) {
        this.$notificarErro('Ocorreu um erro!', e)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.resumirMensagens()
  },
})
</script>
