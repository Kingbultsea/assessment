<template>
  <div id="app" :class="{'font-android': isAndroidd}">
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
    private isAndroidd: boolean = false
    private mounted() {
      // console.log('n2')
      const u = navigator.userAgent
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      if (isAndroid) {
        this.isAndroidd = true
      }
      // console.log('n')
    }
  }
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.font-android {
  font-family: "思源黑体 CN Normal";
}

#app {
  letter-spacing: px2html(0.8px);
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
