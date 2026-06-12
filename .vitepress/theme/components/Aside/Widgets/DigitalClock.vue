<!-- 侧边栏 - 数字时钟 -->
<template>
  <div class="digital-clock s-card">
    <div class="title">
      <i class="iconfont icon-clock"></i>
      <span class="title-name">当前时间</span>
    </div>
    <div class="time-display">
      <span class="time">{{ timeStr }}</span>
      <span class="date">{{ dateStr }}</span>
    </div>
  </div>
</template>

<script setup>
const timeStr = ref("");
const dateStr = ref("");
let timer = null;

const update = () => {
  const now = new Date();
  timeStr.value = now.toLocaleTimeString("zh-CN", { hour12: false });
  dateStr.value = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
};

onMounted(() => {
  update();
  timer = setInterval(update, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.digital-clock {
  .time-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    .time {
      font-size: 2rem;
      font-weight: bold;
      font-variant-numeric: tabular-nums;
      letter-spacing: 2px;
      color: var(--main-color);
    }
    .date {
      margin-top: 6px;
      font-size: 0.9rem;
      opacity: 0.7;
    }
  }
}
</style>
