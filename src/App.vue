<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <Loading v-if="this.$root.loading"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
  import Loading from './components/Loading.vue'
  import {Component, Vue} from 'vue-property-decorator'
  @Component({
    components: {
      Loading
    }
  })
  export default class App extends Vue {

  }
</script>

<style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }
#app {
  font-family: "思源黑体 CN Normal";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #F7F7F7;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
