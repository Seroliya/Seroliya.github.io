import { mainStore } from "@/store";
import { jumpRedirect } from "./commonTools.mjs";

// 必要数据
let loadingTimer = null;
let lastPathName = null;

// 是否仅触发跳转后
let isOnlyAfter = false;

/**
 * 判断是否即将导航到的地址和当前地址是相同页面
 * @return {boolean} 为 true 时表示是相同页面
 */
export const isSamePage = (to) => {
  if (typeof window === "undefined") return false;
  const targetPath = typeof to === "string"
    ? new URL(to, window.location.origin).pathname
    : to.path || to;
  const currentPath = window.location.pathname;
  return targetPath === currentPath;
};

// 路由跳转前
export const routeChange = (type, to) => {
  if (typeof window === "undefined") return false;
  try {
    // 跳转前
    if (type === "before") {
      isOnlyAfter = false;
      lastPathName = typeof to === "string"
        ? new URL(to, window.location.origin).pathname
        : window.location.pathname;
      changeLoading({ always: true });
    }
    // 跳转后
    else if (type === "after") {
      const isSame = isSamePage(to);
      const pathName = typeof to === "string"
        ? new URL(to, window.location.origin).pathname
        : window.location.pathname;
      if (isSame && lastPathName === pathName) {
        if (!isOnlyAfter) changeLoading();
        return false;
      } else {
        changeLoading();
      }
      isOnlyAfter = true;
      lastPathName = pathName;
    }
  } catch (error) {
    console.error("路由切换出错：", error);
    changeLoading();
  }
};

// 切换加载状态
const changeLoading = (option = {}) => {
  // pinia
  const store = mainStore();
  // 获取配置
  const { status = true, always = false } = option;
  // 开始加载
  store.loadingStatus = status;
  // 是否不结束
  if (always) return;
  // 随机延时结束
  loadingTimer = setTimeout(
    () => {
      console.log("加载动画延时结束");
      store.loadingStatus = false;
      // 替换链接
      // jumpRedirect(null, true);
      // 清除定时器
      clearTimeout(loadingTimer);
    },
    Math.floor(Math.random() * (800 - 260 + 1)) + 260,
  );
};
