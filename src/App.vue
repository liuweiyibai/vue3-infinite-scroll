<template>
  <div style="display: flex">
    <template v-if="visible">
      <HelloWorld :ref="setRefs" v-for="item in 3" :key="item" />
    </template>
  </div>
  <button @click="visible = !visible">切换</button>
  <button @click="onReset">重置</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  data() {
    return {
      visible: true,
      refs: [] as any,
    };
  },
  methods: {
    setRefs(ref: any) {
      this.refs.push(ref);
    },
    onReset() {
      this.refs[0].reset();
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
