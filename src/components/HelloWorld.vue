<template>
  <div class="infinite-list-wrapper" style="overflow: auto" ref="scrollRef">
    <ul
      class="infinite-list"
      v-infinite-scroll="{
        callback: load,
        immediateCheck: true,
        disabled: disabled,
      }"
    >
      <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
    </ul>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>

<script>
import { nextTick } from '@vue/runtime-core';
export default {
  expose: ['reset'],
  data() {
    return {
      count: 10,
      loading: false,
    };
  },
  computed: {
    noMore() {
      return this.count >= 100;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 10;
        this.loading = false;
      }, 2000);
    },
    reset() {
      this.$refs.scrollRef.scrollTop = 0;
      nextTick(() => {
        this.count = 10;
      });
    },
  },
};
</script>

<style lang="css" scoped>
.infinite-list-wrapper {
  height: 300px;
  text-align: center;
  flex: 1;
}
.infinite-list-wrapper p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #e8f3fe;
  margin: 10px;
  color: #7dbcfc;
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
