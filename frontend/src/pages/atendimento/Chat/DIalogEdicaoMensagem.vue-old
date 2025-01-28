<template>
  <q-dialog @hide="$emit('hide')" ref="dialog">
    <q-card
      :style="{
        fontFamily: 'Inter, sans-serif',
        width: '900px',
        minWidth: '400px',
        maxWidth: '85vw',
        borderRadius: '8px',
      }"
      class="q-pa-lg"
    >
      <div class="column q-gutter-sm no-wrap">
        <div>
          <div class="row">
            <div class="col-xs-12 text-primary text-weight-bold text-20">Editar agendamento de Mensagem</div>
            <q-btn style="top: 10px; right: 15px" class="absolute" color="primary" round icon="close" flat v-close-popup />
          </div>
        </div>

        <div>
          <InputMensagem
            :editMessage="mensagem"
            ref="refInputMensagem"
            isScheduleDate
            :mensagensRapidas="mensagensRapidas"
            :replyingMessage.sync="replyingMessage"
            @onEditMessage="$emit('ok', $event)"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import InputMensagem from '../InputMensagem.vue'

export default defineComponent({
  props: ['mensagensRapidas', 'replyingMessage', 'mensagem'],
  emits: ['hide', 'ok', 'close'],
  components: {
    InputMensagem,
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
  },
  mounted() {
    this.$nextTick(() => {
      const [_sender, message] = this.mensagem.body.split(':\n ')
      if (message) this.$refs.refInputMensagem.setMensagem(message)
      this.$refs.refInputMensagem.setScheduleDate(this.mensagem.scheduleDate)
    })
  },
})
</script>
