---
title: 标签
aside: false
padding: false
---

<script setup>
import { onMounted } from "vue";
import { useData } from "vitepress"
import Home from "@/views/Home.vue"

const { params, site } = useData();

onMounted(() => {
  document.title = `标签：${params.value.name} | ${site.value.title}`;
});
</script>

<Home :showHeader="false" :showAside="false" :showTags="params.name" />