<!-- 本地搜索 -->
<template>
  <Modal
    :show="store.searchShow"
    title="搜索文章"
    titleIcon="search"
    @mask-click="store.changeShowStatus('searchShow')"
    @modal-close="store.changeShowStatus('searchShow')"
  >
    <div class="local-search">
      <div class="search-box">
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          placeholder="输入关键词搜索..."
          autofocus
          @input="doSearch"
        />
      </div>
      <div v-if="query" class="search-results">
        <Transition name="fade" mode="out-in">
          <div v-if="results.length" class="search-list">
            <div
              v-for="item in results"
              :key="item.id"
              class="search-item s-card hover"
              @click="jumpTo(item.regularPath)"
            >
              <p class="title">{{ item.title }}</p>
              <p v-if="item.categories?.length" class="category">
                {{ item.categories.join(" / ") }}
              </p>
            </div>
          </div>
          <div v-else class="no-result">
            <i class="iconfont icon-search-empty" />
            <span class="text">未找到相关文章</span>
          </div>
        </Transition>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const router = useRouter();
const searchInput = ref(null);

const { theme } = useData();
const query = ref("");
const results = ref([]);

const doSearch = () => {
  const q = query.value.trim().toLowerCase();
  if (!q) {
    results.value = [];
    return;
  }
  const posts = theme.value.postData || [];
  results.value = posts.filter((post) => {
    const title = (post.title || "").toLowerCase();
    const cats = (post.categories || []).join(" ").toLowerCase();
    const desc = (post.description || "").toLowerCase();
    return title.includes(q) || cats.includes(q) || desc.includes(q);
  });
};

const jumpTo = (path) => {
  store.changeShowStatus("searchShow");
  router.go(path);
};

onBeforeUnmount(() => {
  query.value = "";
  results.value = [];
});
</script>

<style lang="scss">
.local-search {
  height: 100%;
  .search-box {
    height: 40px;
    width: 100%;
    input {
      width: 100%;
      outline: none;
      border-radius: 8px;
      font-size: 16px;
      padding: 0.6rem 1rem;
      color: var(--main-font-color);
      font-family: var(--main-font-family);
      border: 1px solid var(--main-card-border);
      background-color: var(--main-card-second-background);
      transition: border-color 0.3s, box-shadow 0.3s;
      &:focus {
        border-color: var(--main-color);
        box-shadow: 0 8px 16px -4px var(--main-color-bg);
      }
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
  }
  .search-results {
    margin-top: 20px;
    min-height: 300px;
    .no-result {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 40px;
        margin-bottom: 12px;
      }
      .text {
        font-size: 18px;
        opacity: 0.6;
      }
    }
    .search-list {
      .search-item {
        margin-bottom: 12px;
        .title {
          display: inline;
          font-size: 16px;
          margin-bottom: 6px;
        }
        .category {
          margin-top: 6px;
          color: var(--main-font-second-color);
          font-size: 13px;
        }
        p {
          margin: 0;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
