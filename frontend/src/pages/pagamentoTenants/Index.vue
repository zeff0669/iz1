<template>
  <div>
    <q-list class="text-weight-medium">
      <div class="row col full-width q-pa-lg">
        <div v-if="loading">Aguarde, carregando as informações de pagamento dos Tenants...</div>
        <div v-if="loading" class="loading-bar">
            <div class="bar"></div>
        </div>
      </div>
      <div v-for="(pagamentos, tenantId) in pagamentosAgrupados" :key="tenantId">
        <div class="row col full-width q-pa-lg">
          <q-card
            flat
            bordered
            class="full-width"
          >

            <q-card-section class="text-h6 text-bold">
              Tenant ID # {{ tenantId }}
              <div class="absolute-top-right q-pa-sm">
                <q-btn flat class="btn-outline"
                  color="primary"
                  icon="mdi-information-outline"
                  label="Mostrar Dados"
                  @click="toggleTable(tenantId)"
                />
              </div>
            </q-card-section>
          
            <q-table
            v-if="tableVisibility[tenantId]"
            flat
            bordered
            square
            hide-bottom
            class="my-sticky-dynamic q-ma-lg"
            title="Avaliacoes"
            :data="pagamentos"
            :columns="columns"
            :loading="loading"
            row-key="id"
            :rows-per-page-options="[0]"
            >
              <template v-slot:top="props">
                <q-toolbar>
                  <q-toolbar-title>
                    Informações sobre pagamento
                  </q-toolbar-title>
                  <q-space></q-space>
                </q-toolbar>
              </template>
              <template v-slot:body-cell-dueDate="props">
                <q-td :props="props">
                  {{ formatarData(props.row.dueDate) }}
                </q-td>
              </template>
              <template v-slot:body-cell-bankSlipUrl="props">
                <q-td :props="props">
                  <a :href="props.row.bankSlipUrl" target="_blank">Link do Pagamento</a>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  {{ props.row.status === 'PENDING' ? 'Pendente' : props.row.status === 'OVERDUE' ? 'Vencido' : props.row.status }}
                </q-td>
              </template>
            </q-table>

          </q-card>
        </div>
      </div>
    </q-list>
  </div>
</template>

<script>
const usuario = JSON.parse(localStorage.getItem('usuario'))
import { ListarTenantsPorAsaas } from 'src/service/tenants'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexConfiguracoes',
  data() {
    return {
      usuario,
      pagamentos: [],
      columns: [
        { name: 'id', label: 'ID do Pagamento', field: 'id', align: 'left' },
        { name: 'status', label: 'Status', field: 'status', align: 'left' },
        { name: 'dueDate', label: 'Vencimento', field: 'dueDate', align: 'left' },
        { name: 'bankSlipUrl', label: 'Link para Pagamento', field: 'bankSlipUrl', align: 'left' }
      ],
      loading: false,
      tableVisibility: {},
    }
  },
  computed: {
    pagamentosAgrupados() {
      const agrupados = {};
      this.pagamentos.forEach(pagamento => {
        const tenantId = pagamento.tenantId;
        if (!agrupados[tenantId]) {
          agrupados[tenantId] = [];
        }
        agrupados[tenantId].push(...pagamento.paymentInfo.data);
      });
      return agrupados;
    }
  },
  methods: {
    toggleTable(tenantId) {
      if (this.tableVisibility[tenantId] === undefined) {
        this.$set(this.tableVisibility, tenantId, true);
      } else {
        this.tableVisibility[tenantId] = !this.tableVisibility[tenantId];
      }
    },
    formatarData(data) {
      const dataFormatada = new Date(data);
      return dataFormatada.toLocaleDateString('pt-BR');
    },
    async listarPagamentos(){
      this.loading = true; 
      try {
        const { data } = await ListarTenantsPorAsaas();
        this.pagamentos = data; // certifique-se de que esta linha está correta
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        this.loading = false;
  }
    },
  },
  created() {
    this.pagamentosAgrupados.forEach((_, tenantId) => {
      this.tableVisibility[tenantId] = false;
    });
  },
  async mounted() {
    await this.listarPagamentos()
  },
})
</script>

<style lang="sass">
.loading-bar
  width: 100%
  height: 4px
  background-color: #ccc
  position: relative
  
  .bar
    width: 0
    height: 100%
    background-color: #007bff
    position: absolute
    top: 0
    left: 0
    animation: loadingAnimation 1s infinite
  
@keyframes loadingAnimation
  0%
    width: 0
  100%
    width: 100%
  
</style>
