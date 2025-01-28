<template>
  <div v-if="userProfile === 'admin'">
    <q-table
      flat
      bordered
      square
      hide-bottom
      class="my-sticky-dynamic q-ma-lg"
      title="Mensagens Rápidas"
      :data="mensagensRapidas"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          label="Adicionar"
          @click="mensagemRapidaEmEdicao = {}; modalMensagemRapida = true"
        />
      </template>
      <template v-slot:body-cell-isActive="props">
        <q-td class="text-center">
          <q-icon
            size="24px"
            :name="props.value ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
            :color="props.value ? 'positive' : 'negative'"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-media="props">
        <q-td :props="props">
          <span v-if="props.row.media">
            <a :href="generateMediaUrl(props.row.media)" target="_blank" style="text-decoration: underline; cursor: pointer;">
              Abrir Arquivo
            </a>
          </span>
          <span v-else>
            Sem Arquivo
          </span>
          <!-- <q-btn
            v-if="props.row.media"
            flat
            type="a"
            :href="generateMediaUrl(props.row.media)"
            target="_blank"
          >
            Abrir Arquivo
          </q-btn>
          <q-btn
            v-else
            flat
          >
            Sem Arquivo
          </q-btn> -->
        </q-td>
      </template>
      <template v-slot:body-cell-voice="props">
        <q-td :props="props">
          <span>
            {{ props.row.voice === 'enabled' ? 'Ativo' : 'Inativo' }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn
            flat
            round
            icon="edit"
            @click="editarMensagem(props.row)"
          />
          <q-btn
            flat
            round
            icon="mdi-delete"
            @click="deletarMensagem(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <ModalMensagemRapida
      :modalMensagemRapida.sync="modalMensagemRapida"
      :mensagemRapidaEmEdicao.sync="mensagemRapidaEmEdicao"
      @mensagemRapida:criada="mensagemCriada"
      @mensagemRapida:editada="mensagemEditada"
    />
  </div>
</template>

<script>
import ModalMensagemRapida from './ModalMensagemRapida'
import { ListarMensagensRapidas, DeletarMensagemRapida } from 'src/service/mensagensRapidas'
export default {
  name: 'MensagensRapidas',
  components: { ModalMensagemRapida },
  data () {
    return {
      userProfile: 'user',
      loading: false,
      mensagensRapidas: [],
      modalMensagemRapida: false,
      mensagemRapidaEmEdicao: {},
      columns: [
        { name: 'id', label: '#', field: 'id', align: 'left' },
        { name: 'key', label: 'Chave', field: 'key', align: 'left' },
        { name: 'message', label: 'Mensagem', field: 'message', align: 'left' },
        { name: 'media', label: 'Arquivo', field: 'media', align: 'left' },
        { name: 'voice', label: 'Áudio Gravado', field: 'voice', align: 'left' },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
      ],
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0,
        lastIndex: 0
      }
    }
  },
  methods: {
    generateMediaUrl(mediaFileName) {
      return `${process.env.URL_API}/public/${mediaFileName}`;
    },
    async listarMensagensRapidas () {
      const { data } = await ListarMensagensRapidas()
      this.mensagensRapidas = data
    },
    mensagemCriada (mensagem) {
      this.mensagensRapidas.unshift(mensagem)
    },
    mensagemEditada (mensagem) {
      const newMensagens = [...this.mensagensRapidas]
      const idx = newMensagens.findIndex(m => m.id === mensagem.id)
      if (idx > -1) {
        newMensagens[idx] = mensagem
      }
      this.mensagensRapidas = [...newMensagens]
      console.log(this.mensagensRapidas)
      console.log('mensagemEditada')
    },
    editarMensagem (mensagem) {
      this.mensagemRapidaEmEdicao = { ...mensagem }
      this.modalMensagemRapida = true
    },
    deletarMensagem (mensagem) {
      this.$q.dialog({
        title: 'Atenção!!',
        message: `Deseja realmente deletar a mensagem de chave "${mensagem.key}"?`,
        cancel: {
          label: 'Não',
          color: 'primary',
          push: true
        },
        ok: {
          label: 'Sim',
          color: 'negative',
          push: true
        },
        persistent: true
      }).onOk(() => {
        this.loading = true
        DeletarMensagemRapida(mensagem)
          .then(res => {
            let newMensagens = [...this.mensagensRapidas]
            newMensagens = newMensagens.filter(m => m.id !== mensagem.id)

            this.mensagensRapidas = [...newMensagens]
            this.$q.notify({
              type: 'positive',
              progress: true,
              position: 'top',
              message: 'Mensagem deletada!',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
          })
        this.loading = false
      })
    }
  },
  mounted () {
    this.listarMensagensRapidas()
    this.userProfile = localStorage.getItem('profile')
  }
}
</script>

<style lang="scss" scoped>
</style>
