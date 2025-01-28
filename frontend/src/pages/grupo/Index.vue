<template>
  <div>
    <q-tabs class="text-teal" align="left">
      <q-route-tab
        to="/grupo/massagrupos"
        name="bulkgroups"
        no-caps
        icon="mdi-account-details-outline"
        label="Grupos e Participantes"
      />
      <q-route-tab
        to="/grupo/massagrupos2"
        name="bulkgroups2"
        no-caps
        icon="mdi-account-cog-outline"
        label="Manipular Grupos"
      />
      <q-route-tab
        to="/grupo/massausuarios"
        name="bulkuser"
        no-caps
        icon="mdi-account-convert-outline"
        label="Manipular Usuários"
      />
      <q-route-tab
        to="/grupo/banlist"
        name="banlist"
        no-caps
        icon="mdi-account-cancel-outline"
        label="Números Banidos"
      />
      <q-route-tab
        to="/grupo/wordlist"
        name="wordlist"
        no-caps
        icon="mdi-chat-alert-outline"
        label="Palavras Proibidas"
      />
      <q-route-tab
        to="/grupo/saudacao"
        name="greetings"
        no-caps
        icon="mdi-account-arrow-right-outline"
        label="Mensagem de Saudação"
      />
      <q-route-tab
        to="/grupo/despedida"
        name="farewell"
        no-caps
        icon="mdi-account-arrow-right-outline"
        label="Mensagem de Despedida"
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script>
const usuario = JSON.parse(localStorage.getItem('usuario'))
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexConfiguracoes',
  data() {
    return {
      userProfile: 'user',
      usuario
    }
  },
  methods: {

  },
  async mounted() {
    this.userProfile = localStorage.getItem('profile')
  },
})
</script>
