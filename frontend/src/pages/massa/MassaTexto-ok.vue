<template>
  <div v-if="userProfile === 'admin'">
    <div class="q-my-md">
      <q-card
        flat
        bordered
        class="my-sticky-dynamic q-ma-lg"
      >
        <q-card-section class="text-h6 text-bold">
          Envios em Massa
        </q-card-section>
        <q-list class="text-weight-medium">
          
          <div class="row q-px-md">
            <div class="col-6 q-py-md">
              <q-select
                style="margin: 1px;"
                v-model="whatsappId"
                :options="cSessionsOptions"
                label="WhatsApp ID"
                dense
                outlined
              />
            </div>
            <div class="col-3 q-py-md">
              <q-input v-model="min" label="Mínimo (segundos)" style="margin: 1px;" dense outlined />
            </div>
            <div class="col-3 q-py-md">
              <q-input v-model="max" label="Máximo (segundos)" style="margin: 1px;" dense outlined />
            </div>

            <div class="col-4 q-py-md" style="margin: 1px;">
              <q-toggle
                style="margin: 1px;"
                v-model="contatosImportar"
                label="Contatos"
                dense
              />
            </div>
            <div class="col-4 q-py-md" style="margin: 1px;">
              <q-toggle
                style="margin: 1px;"
                v-model="isGroup"
                label="Grupos"
                dense
              />
            </div>

            <div class="col-12 q-py-md" v-if="contatosImportar">
              <div v-if="loading">Aguarde, carregando todos os contatos do sistema...</div>
              <div v-if="loading" class="loading-bar">
                <div class="bar"></div>
              </div>
              <q-select
                v-model="selectedContacts"
                :options="contactOptions"
                label="Selecionar Contatos"
                use-chips
                multiple
                dense
                outlined
                style="margin: 1px;"
              />
            </div>
            
            <div class="col-9 q-py-md" v-if="!contatosImportar">
              <q-input
                v-model="numberInput"
                label="Números (separados por vírgula)"
                dense
                outlined
                style="margin: 1px;"
              />
            </div>
            <div class="col-3 q-py-md" v-if="!contatosImportar">
              <q-input
                type="file"
                accept=".csv"
                label="Importar Números do CSV"
                @change="handleCSVUpload"
                dense
                outlined
                style="margin: 1px;"
              />
            </div>

            <div class="row q-px-md">
              <div class="col-12 q-py-md">
                <q-toggle
                  v-model="text"
                  label="Incluir Texto"
                  dense
                  style="margin: 1px;"
                />
              </div>
            </div>
            <div v-if="text" class="col-12 q-py-md">
              <q-input v-model="message" type="textarea" label="Mensagem" style="margin: 1px;" autogrow dense outlined />
            </div>
            
            <div class="row q-px-md">
              <div class="col-12 q-py-md" style="margin: 1px;">
                <q-toggle
                  v-model="media"
                  label="Incluir Mídia (URL)"
                  dense
                />
              </div>
            </div>
            <div v-if="media" class="col-12 q-py-md" style="margin: 1px;">
              <q-input v-model="mediaUrl" label="URL da Mídia" dense outlined />
            </div>
            <div v-if="media" class="col-12 q-py-md" style="margin: 1px;">
              <q-input v-model="mediaDescription" type="textarea" label="Descrição da Mídia" dense outlined autogrow />
            </div>

            <div class="row q-px-md">
              <div class="col-12 q-py-md" style="margin: 1px;">
                <q-toggle
                  v-model="voice"
                  label="Incluir Áudio Gravado"
                  dense
                />
              </div>
            </div>
            <div v-if="voice" class="col-12 q-py-md">
              <q-input v-model="voiceUrl" label="URL da Áudio (.ogg)" dense outlined style="margin: 1px;"/>
            </div>

            <div class="row q-px-md">
              <div class="col-12 q-py-md" style="margin: 1px;">
                <q-toggle
                  v-model="mediaLocal"
                  label="Incluir Arquivo (Upload)"
                  dense
                />
              </div>
            </div>
            <div class="row q-px-md" v-if="mediaLocal">
              <div class="col-12 q-py-md" style="margin: 1px;">
                <label>
                  <input type="checkbox" v-model="voiceLocal">
                  Audio Gravado
                </label>
              </div>
            </div>
            <div v-if="mediaLocal" class="col-12 q-py-md">
              <input type="file" @change="handleFileUpload">
            </div>
            <div v-if="mediaLocal && !voiceLocal" class="col-12 q-py-md" style="margin: 1px;">
              <q-input v-model="fileDescription" type="textarea" label="Descrição da Mídia" dense outlined autogrow />
            </div>
            
            <div class="col-12">
              <q-btn label="Enviar" @click="enviar" color="primary" style="margin-bottom: 15px;margin-right: 5px;"/>
              <q-btn label="Limpar" @click="limparCampos" color="negative" style="margin-bottom: 15px;margin-left: 5px;"/>
            </div>

          </div>
        </q-list>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Texto } from 'src/service/massa'
import { mapGetters } from 'vuex';
import { ListarContatos } from 'src/service/contatos'

export default {
  name: 'MassaTexto',
  data() {
    return {
      userProfile: 'user',
      whatsappId: null,
      numberInput: '',
      message: '',
      min: '',
      max: '',
      isGroup: false,
      contatosImportar: false,
      media: false,
      mediaUrl: '',
      mediaDescription: '',
      text: false,
      voice: false,
      voiceUrl: '',
      mediaLocal: false,
      file: null,
      fileDescription: '',
      voiceLocal: false,
      loading: false,
      params: {
        hasMore: true
      },
      selectedContacts: [],
      contactOptions: [],
    }
  },
  watch: {
    isGroup(newVal, oldVal) {
      this.listarContatos();
    },
    contatosImportar(newVal, oldVal) {
      this.listarContatos();
    }
  },
  computed: {
    ...mapGetters(['whatsapps']),
    cSessions() {
      // return this.whatsapps.filter(w => w.type === 'whatsapp' && !w.isDeleted)
      return this.whatsapps.filter(w => w.type === 'whatsapp' && !w.isDeleted && w.status === 'CONNECTED');
    },
    cSessionsOptions() {
      return this.cSessions.map(w => ({ label: w.name, value: w.id }))
    }
  },
  methods: {
    async listarContatos() {
      this.loading = true;
      this.contactOptions = [];
      this.params.pageNumber = 1;
      this.params.hasMore = true; 
      try {
        while (this.params.hasMore) {
          const { data } = await ListarContatos(this.params);
          this.processarContatos(data)
          this.params.hasMore = data.hasMore;
          if (this.params.hasMore) {
            this.params.pageNumber++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error('Erro ao obter contatos:', error);
      } finally {
        this.loading = false;
      }
    },
    processarContatos(data) {
      const contatosFiltrados = data.contacts.filter(contato => this.isGroup ? contato.isGroup : !contato.isGroup);
      const opcoesContato = contatosFiltrados.map(contato => ({
        label: contato.name,
        value: contato.number
      }));
      this.contactOptions = [...this.contactOptions, ...opcoesContato];
    },
    handleCSVUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          this.processCSV(content);
        };
        reader.readAsText(file);
      }
    },
    processCSV(csvContent) {
      const lines = csvContent.split('\n');
      const numbers = lines.map(line => line.trim()).filter(line => line !== '');
      this.numberInput = numbers.join(',');
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async limparCampos(){
      this.message = ''
      this.numberInput = ''
      this.min = ''
      this.max = ''
      this.mediaUrl = ''
      this.mediaDescription = ''
      this.voiceUrl = ''
      this.whatsappId = null
      this.$q.notify({
        html: true,
        message: `Campos redefinidos, essa pagina será atualizada.`,
        type: 'warning',
        progress: true,
        position: 'top',
        actions: [{
          icon: 'close',
          round: true,
          color: 'white'
        }]
      })
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    async enviar(){
      if (this.contatosImportar){
        const numbers = this.selectedContacts.map(contact => contact.value);
        const minInt = parseInt(this.min, 10)
        const maxInt = parseInt(this.max, 10)
        const media = this.media
        const text = this.text
        const voice = this.voice
        const mediaLocal = this.mediaLocal
        const voiceLocal = this.voiceLocal
        if (this.whatsappId === null) {
          this.$q.notify({
            html: true,
            message: `Por favor, selecione uma conexão.`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        if (isNaN(minInt) || isNaN(maxInt)) {
          this.$q.notify({
            html: true,
            message: `Por favor, insira números válidos para min e max`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        if (numbers === "") {
          this.$q.notify({
            html: true,
            message: `Por favor, insira os números destino.`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        if (!text && !media && !voice && !mediaLocal) {
          this.$q.notify({
            html: true,
            message: `Por favor, escolha uma ou mais opções de envio.`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        // checagens
        if(text){
          if (this.message === "") {
            this.$q.notify({
              html: true,
              message: `Por favor, insira a mensagem que será enviada.`,
              type: 'warning',
              progress: true,
              position: 'top',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
            return;
          }
        } if (media) {
          if (this.mediaUrl === "" || this.mediaDescription === "") {
            this.$q.notify({
              html: true,
              message: `Por favor, insira a URL e descrição do arquivo que será enviado.`,
              type: 'warning',
              progress: true,
              position: 'top',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
            return;
          }
        } if (voice) {
          if (this.voiceUrl === "") {
            this.$q.notify({
              html: true,
              message: `Por favor, insira a URL do arquivo que será enviado.`,
              type: 'warning',
              progress: true,
              position: 'top',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
            return;
          }
        } if (mediaLocal) {
          if(!voiceLocal){
            if (this.file === "" || this.fileDescription === "") {
              this.$q.notify({
                html: true,
                message: `Por favor, faça o upload do arquivo e insira a descrição será enviada.`,
                type: 'warning',
                progress: true,
                position: 'top',
                actions: [{
                  icon: 'close',
                  round: true,
                  color: 'white'
                }]
              })
              return;
            }
          } else if(voiceLocal){
            if (this.file === "") {
              this.$q.notify({
                html: true,
                message: `Por favor, faça o upload do arquivo que será enviado.`,
                type: 'warning',
                progress: true,
                position: 'top',
                actions: [{
                  icon: 'close',
                  round: true,
                  color: 'white'
                }]
              })
              return;
            }
          }
        }
        this.$q.notify({
          html: true,
          message: `Aguarde, suas mensagens estão sendo carregadas.`,
          type: 'warning',
          progress: true,
          position: 'top',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
        // envios
        if(text){
          const data = {
            whatsappId: this.whatsappId.value,
            arrayNumbers: numbers,
            message: this.message,
            min: minInt,
            max: maxInt,
            groups: this.isGroup
          };
          await Texto(data)
        } if (media) {
          const data = {
            whatsappId: this.whatsappId.value,
            arrayNumbers: numbers,
            message: this.message,
            min: minInt,
            max: maxInt,
            groups: this.isGroup,
            media: this.media,
            mediaUrl: this.mediaUrl,
            mediaDescription: this.mediaDescription
          };
          await Texto(data)
        } if (voice) {
          const data = {
            whatsappId: this.whatsappId.value,
            arrayNumbers: numbers,
            min: minInt,
            max: maxInt,
            groups: this.isGroup,
            voice: this.voice,
            voiceUrl: this.voiceUrl,
          };
          await Texto(data)
        } if (mediaLocal) {
          if(!voiceLocal){
            const formData = new FormData();
            formData.append('whatsappId', this.whatsappId.value);
            formData.append('arrayNumbers', numbers.toString());
            formData.append('min', minInt.toString());
            formData.append('max', maxInt.toString());
            formData.append('groups', this.isGroup.toString());
            formData.append('mediaLocal', this.mediaLocal.toString());
            formData.append('mediaLocalDescription', this.fileDescription.toString());
            if (this.file) {
              formData.append('medias', this.file, this.file.name);
            }
            await Texto(formData)
          } else if(voiceLocal){
            const formData = new FormData();
            formData.append('whatsappId', this.whatsappId.value);
            formData.append('arrayNumbers', numbers.toString());
            formData.append('min', minInt.toString());
            formData.append('max', maxInt.toString());
            formData.append('groups', this.isGroup.toString());
            formData.append('voiceLocal', this.voiceLocal.toString());
            if (this.file) {
              formData.append('medias', this.file, this.file.name);
            }
            await Texto(formData)
          }
        }
        this.$q.notify({
          html: true,
          message: `Suas mensagens estão sendo enviadas.`,
          type: 'positive',
          progress: true,
          position: 'top',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
        await this.limparCampos();
        return;
      }
      if (!this.contatosImportar){
        const numbers = this.numberInput.split(',').map(num => num.trim())
        const minInt = parseInt(this.min, 10)
        const maxInt = parseInt(this.max, 10)
        const media = this.media
        const text = this.text
        const voice = this.voice
        const mediaLocal = this.mediaLocal
        const voiceLocal = this.voiceLocal
        if (this.whatsappId === null) {
          this.$q.notify({
            html: true,
            message: `Por favor, selecione uma conexão.`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        if (isNaN(minInt) || isNaN(maxInt)) {
          this.$q.notify({
            html: true,
            message: `Por favor, insira números válidos para min e max`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        if (this.numberInput === "") {
          this.$q.notify({
            html: true,
            message: `Por favor, insira os números destino.`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        if (!text && !media && !voice && !mediaLocal) {
          this.$q.notify({
            html: true,
            message: `Por favor, escolha uma ou mais opções de envio.`,
            type: 'warning',
            progress: true,
            position: 'top',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
          return;
        }
        // checagens
        if(text){
          if (this.message === "") {
            this.$q.notify({
              html: true,
              message: `Por favor, insira a mensagem que será enviada.`,
              type: 'warning',
              progress: true,
              position: 'top',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
            return;
          }
        } if (media) {
          if (this.mediaUrl === "" || this.mediaDescription === "") {
            this.$q.notify({
              html: true,
              message: `Por favor, insira a URL e descrição do arquivo que será enviado.`,
              type: 'warning',
              progress: true,
              position: 'top',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
            return;
          }
        } if (voice) {
          if (this.voiceUrl === "") {
            this.$q.notify({
              html: true,
              message: `Por favor, insira a URL do arquivo que será enviado.`,
              type: 'warning',
              progress: true,
              position: 'top',
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
            return;
          }
        } if (mediaLocal) {
          if(!voiceLocal){
            if (this.file === "" || this.fileDescription === "") {
              this.$q.notify({
                html: true,
                message: `Por favor, faça o upload do arquivo e insira a descrição será enviada.`,
                type: 'warning',
                progress: true,
                position: 'top',
                actions: [{
                  icon: 'close',
                  round: true,
                  color: 'white'
                }]
              })
              return;
            }
          } else if(voiceLocal){
            if (this.file === "") {
              this.$q.notify({
                html: true,
                message: `Por favor, faça o upload do arquivo que será enviado.`,
                type: 'warning',
                progress: true,
                position: 'top',
                actions: [{
                  icon: 'close',
                  round: true,
                  color: 'white'
                }]
              })
              return;
            }
          }
        }
        this.$q.notify({
          html: true,
          message: `Aguarde, suas mensagens estão sendo carregadas.`,
          type: 'warning',
          progress: true,
          position: 'top',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
        // envios
        if(text){
          const data = {
            whatsappId: this.whatsappId.value,
            arrayNumbers: numbers,
            message: this.message,
            min: minInt,
            max: maxInt,
            groups: this.isGroup
          };
          await Texto(data)
        } if (media) {
          const data = {
            whatsappId: this.whatsappId.value,
            arrayNumbers: numbers,
            message: this.message,
            min: minInt,
            max: maxInt,
            groups: this.isGroup,
            media: this.media,
            mediaUrl: this.mediaUrl,
            mediaDescription: this.mediaDescription
          };
          await Texto(data)
        } if (voice) {
          const data = {
            whatsappId: this.whatsappId.value,
            arrayNumbers: numbers,
            min: minInt,
            max: maxInt,
            groups: this.isGroup,
            voice: this.voice,
            voiceUrl: this.voiceUrl,
          };
          await Texto(data)
        } if (mediaLocal) {
          if(!voiceLocal){
            const formData = new FormData();
            formData.append('whatsappId', this.whatsappId.value);
            formData.append('arrayNumbers', this.numberInput);
            formData.append('min', minInt.toString());
            formData.append('max', maxInt.toString());
            formData.append('groups', this.isGroup.toString());
            formData.append('mediaLocal', this.mediaLocal.toString());
            formData.append('mediaLocalDescription', this.fileDescription.toString());
            if (this.file) {
              formData.append('medias', this.file, this.file.name);
            }
            await Texto(formData)
          } else if(voiceLocal){
            const formData = new FormData();
            formData.append('whatsappId', this.whatsappId.value);
            formData.append('arrayNumbers', this.numberInput);
            formData.append('min', minInt.toString());
            formData.append('max', maxInt.toString());
            formData.append('groups', this.isGroup.toString());
            formData.append('voiceLocal', this.voiceLocal.toString());
            if (this.file) {
              formData.append('medias', this.file, this.file.name);
            }
            await Texto(formData)
          }
        }
        this.$q.notify({
          html: true,
          message: `Suas mensagens estão sendo enviadas.`,
          type: 'positive',
          progress: true,
          position: 'top',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
        await this.limparCampos();
        return;
      }
    }
  },
  async mounted() {
    this.userProfile = localStorage.getItem('profile')
  }
}
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