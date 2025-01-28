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
            <div class="col-xs-12 text-primary text-weight-bold text-20">Resumir conversa com ContrateIA</div>
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
              { role: 'user', content: 'Você é meu assistente virtual e seu único trabalho é fazer resumos das conversas que eu te enviar.' },
              { role: 'user', content: 'Faça um bom resumo, indo sempre direto ao ponto, mas não deixe nenhuma informação útil de fora.' },
              { role: 'user', content: 'No seu resumo se refira aos usuários pelos seus nomes, e a cada tópico faça uma quebra de linha' },
              { role: 'user', content: 'Tente usar no máximo 500 caracteres.' },
              { role: 'user', content: 'Crie apenas o resumo simples, ignore o resumo completo' },
              {
                role: 'user',
                content:
                  'Formate a sua resposta como um html válido e o nome dos remetentes deve sempre estar em negrito (dentro da tag <b>) e crie novos parágrafos sempre que necessário para uma facil leitura',
              },
              { role: 'user', content: 'Adicione quebras de linhas de forma que facilite a leitura' },
              { role: 'user', content: 'TODAS AS MENSAGENS COMEÇAM ABAIXO:' },
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
