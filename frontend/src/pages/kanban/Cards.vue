<template>
  <div class="cc-card">
    <img v-if="data.profilePicUrl" :src="data.profilePicUrl" alt="Profile Image" style="max-width: 80px; border-radius: 50%;">
    <p>{{ data.title }}</p>
    <!-- <a>{{ data.description }}</a> -->
    <a :href="getPhoneNumberLink(data.description)">
              {{ data.description }}
            </a>
    <p>{{"#" + data.id }}</p>
    <q-btn
      flat
      round
      icon="mdi-whatsapp"
      class="text-whatsapp"
      @mouseover="mostrarMensagem = true"
      @mouseleave="mostrarMensagem = false"
      @click="abrirTicket()"
    >
      <q-tooltip v-if="mostrarMensagem">Atendimento</q-tooltip>
    </q-btn>
    <q-btn
      flat
      round
      icon="mdi-cancel"
      class="text-red"
      @mouseover="mostrarMensagem = true"
      @mouseleave="mostrarMensagem = false"
      @click="markDone()"
      >
      <q-tooltip v-if="mostrarMensagem">Remover</q-tooltip>
    </q-btn>
    <!-- <button v-if="!data.done" class="cc-btn" @click="markDone()">Remover</button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      mostrarMensagem: false
    }
  },
  name: 'Cards',
  props: ['data'],
  methods: {
    getPhoneNumberLink(number) {
      if ((number.startsWith("55")) && (number.charAt(4) > 5)) {
        return `tel:${number.slice(0, 4)}9${number.slice(-8)}`;
      } else {
        return `tel:${number}`;
      }
    },
    abrirTicket() {
      this.$emit('abrirTicket', this.data);
    },
    markDone() {
      this.$emit('done', this.data);
    }
  }
};
</script>

<style lang="sass">
.cc-card
  background-color: #fff
  border-radius: 8px
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
  padding: 20px
  margin: 10px
  max-width: 300px
  text-align: center

  h3
    margin-bottom: 10px
    font-size: 1.5em

  p
    font-size: 1em
    color: #555

  .cc-btn
    background-color: #007bff
    color: #fff
    border: none
    border-radius: 4px
    padding: 10px 20px
    cursor: pointer
    font-size: 1em
    margin-top: 10px

    &:hover
      background-color: #0056b3

.text-whatsapp
  color: #25d366

.text-red
  color: #ff0000

.blur-effect 
  filter: blur(0px)
</style>
