<template>
  <div>
    <q-table
      class="my-sticky-dynamic q-ma-lg"
      title="Usuarios"
      :data="usuarios"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-input
          style="width: 300px"
          filled
          dense
          class="col-grow"
          debounce="500"
          v-model="filter"
          clearable
          placeholder="Localize"
          @input="filtrarUsuario"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-md col"
          :class="{
            'q-ml-none q-mt-md q-mr-md': $q.screen.width < 500
          }"
          color="primary"
          label="Adicionar"
          @click="usuarioSelecionado = {}; modalUsuario = true"
        />

      </template>
      <template v-slot:body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn
            flat
            round
            icon="edit"
            @click="editarUsuario(props.row)"
          />
          <!-- <q-btn
            flat
            round
            icon="mdi-delete"
            @click="deletarUsuario(props.row)"
          /> -->
        </q-td>
      </template>
      <template v-slot:pagination="{ pagination }">
        {{ usuarios.length }}/{{ pagination.rowsNumber }}
      </template>
    </q-table>
    <ModalUsuario
      :modalUsuario.sync="modalUsuario"
      @modalUsuario:usuario-editado="UPDATE_USUARIO"
      @modalUsuario:usuario-criado="usuarioCriado"
      :usuarioEdicao.sync="usuarioSelecionado"
    />
  </div>
</template>

<script>
// const userId = +localStorage.getItem('userId')
import { ListarUsuariosTenant, DeleteUsuarioTenant } from 'src/service/user'
import { ListarFilas } from 'src/service/filas'
import ModalUsuario from './ModalUsuario'
export default {
  name: 'IndexUsuarios',
  components: { ModalUsuario },
  data () {
    return {
      userProfile: 'user',
      usuarios: [],
      usuarioSelecionado: {},
      modalFilaUsuario: false,
      filas: [],
      optionsProfile: [
        { value: 'user', label: 'Usuário' },
        // { value: 'super', label: 'Supervisor' },
        { value: 'admin', label: 'Administrador' },
        { value: 'superadmin', label: 'Super Administrador' }
      ],
      modalUsuario: false,
      filter: null,
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0,
        lastIndex: 0
      },
      params: {
        pageNumber: 1,
        searchParam: null,
        hasMore: true
      },
      loading: false,
      columns: [
        { name: 'tenantId', label: 'Tenant', field: 'tenantId', align: 'left' },
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
        { name: 'profile', label: 'Perfil', field: 'profile', align: 'left', format: (v) => this.optionsProfile.find(o => o.value == v).label },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
      ]
    }
  },
  methods: {
    LOAD_USUARIOS (users) {
      const newUsers = []
      users.forEach(user => {
        const userIndex = this.usuarios.findIndex(c => c.id === user.id)
        if (userIndex !== -1) {
          this.usuarios[userIndex] = user
        } else {
          newUsers.push(user)
        }
      })
      const usersObj = [...this.usuarios, ...newUsers]
      this.usuarios = usersObj
    },
    UPDATE_USUARIO (usuario) {
      let newUsuarios = [...this.usuarios]
      const usuarioIndex = newUsuarios.findIndex(c => c.id === usuario.id)
      if (usuarioIndex !== -1) {
        newUsuarios[usuarioIndex] = usuario
      } else {
        newUsuarios = [usuario, ...newUsuarios]
      }
      this.usuarios = [...newUsuarios]
    },
    DELETE_USUARIO (userId) {
      const newObj = [...this.usuarios.filter(u => u.id !== userId)]
      this.usuarios = [...newObj]
    },
    async listarUsuarios () {
      this.loading = true
      const { data } = await ListarUsuariosTenant(this.params)
      this.usuarios = data.users
      this.LOAD_USUARIOS(data.users)
      this.params.hasMore = data.hasMore
      this.pagination.lastIndex = this.usuarios.length - 1
      this.pagination.rowsNumber = data.count
      this.loading = false
    },
    filtrarUsuario (data) {
      this.usuarios = []
      this.params.pageNumber = 1
      this.params.searchParam = data
      this.listarUsuarios()
    },
    onScroll ({ to, ref, ...all }) {
      if (this.loading !== true && this.params.hasMore === true && to === this.pagination.lastIndex) {
        this.params.pageNumber++
        this.listarUsuarios()
      }
    },
    usuarioCriado (usuario) {
      const obj = [...this.usuarios]
      obj.push(usuario)
      this.usuarios = [...obj]
    },
    editarUsuario (usuario) {
      this.usuarioSelecionado = usuario
      this.modalUsuario = true
    },
    deletarUsuario (usuario) {
      this.$q.dialog({
        title: `Atenção!! Deseja realmente deletar o usuario "${usuario.name}"?`,
        // message: 'Mensagens antigas não serão apagadas no whatsapp.',
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
      }).onOk(async () => {
        this.loading = true
        console.log(usuario)
        await DeleteUsuarioTenant(usuario.id, usuario.tenantId)
          .then(res => {
            this.DELETE_USUARIO(usuario.id)
            this.$q.notify({
              type: 'positive',
              progress: true,
              position: 'top',
              message: `Usuario ${usuario.name} deletado!`,
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
          })
          .catch(error => {
            console.error(error)
            this.$notificarErro('Não é possível deletar o usuário', error)
          })
        this.loading = false
      })
    },
    async listarFilas () {
      const { data } = await ListarFilas()
      this.filas = data
    },
    gerirFilasUsuario (usuario) {
      this.usuarioSelecionado = usuario
      this.modalFilaUsuario = true
    }
  },
  async mounted () {
    await this.listarFilas()
    await this.listarUsuarios()
    this.userProfile = localStorage.getItem('profile')
  }
}
</script>

<style lang="scss" scoped>
</style>
