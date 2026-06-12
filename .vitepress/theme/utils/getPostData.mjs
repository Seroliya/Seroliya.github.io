import { generateId } from "./commonTools.mjs";
import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import articleOrder from "./articleOrder.mjs";

/**
 * 获取 posts 目录下所有 Markdown 文件的路径
 * @returns {Promise<string[]>} - 文件路径数组
 */
/**
 * 目录索引页面（不作为文章展示）
 */
const indexPages = [
  "社会现象与心理/Social_Phenomenon&Psychology.md",
  "社交与信息获取/Socializing&Information_Gathering.md",
  "自我提升和学习/Self_improvement&Studying.md",
  "其他随笔/Others.md",
];

const getPostMDFilePaths = async () => {
  try {
    // 获取所有 md 文件路径
    let paths = await globby(["**.md"], {
      ignore: ["node_modules", "pages", "page", ".vitepress", "README.md"],
    });
    // 过滤路径，排除根目录下的非文章文件和目录索引页
    const rootExcluded = ["index.md", "markdown-examples.md", "api-examples.md", "page.md"];
    return paths.filter((item) => !rootExcluded.includes(item) && !indexPages.includes(item));
  } catch (error) {
    console.error("获取文章路径时出错:", error);
    throw error;
  }
};

/**
 * 基于 frontMatter 日期降序排序文章
 * @param {Object} obj1 - 第一篇文章对象
 * @param {Object} obj2 - 第二篇文章对象
 * @returns {number} - 比较结果
 */
const compareDate = (obj1, obj2) => {
  return obj1.date < obj2.date ? 1 : -1;
};

/**
 * 2026年6月13日/14日分界线
 * lastModified > SORT_CUTOFF → 新文章（排在前面）
 * lastModified <= SORT_CUTOFF → 旧文章（按手动列表排序）
 */
const SORT_CUTOFF = new Date("2026-06-14T00:00:00").getTime();

/**
 * 从 articleOrder 构建两个模块级映射表（只构建一次）：
 *   orderMap:   文件路径 → 列表中的排序索引
 *   manualDateMap: 文件路径 → 手动指定的真实创建时间戳
 */
const orderMap = new Map();
const manualDateMap = new Map();
articleOrder.forEach((entry, index) => {
  orderMap.set(entry.path, index);
  if (entry.date) {
    manualDateMap.set(entry.path, new Date(entry.date).getTime());
  }
});

/**
 * 文章排序比较函数
 * 第0级：置顶文章排最前（置顶之间按日期降序）
 * 第1级：2026年6月14日之后编辑的新文章排在前面（新文章之间按日期降序）
 * 第2级：旧文章按 articleOrder 列表顺序排列；不在列表中的按日期降序排在末尾
 */
const comparePostPriority = (a, b) => {
  // 第0级：置顶
  if (a.top && !b.top) return -1;
  if (!a.top && b.top) return 1;
  if (a.top && b.top) return compareDate(a, b);

  // 第1级：新文章 vs 旧文章
  const aNew = a.lastModified > SORT_CUTOFF;
  const bNew = b.lastModified > SORT_CUTOFF;
  if (aNew && !bNew) return -1;
  if (!aNew && bNew) return 1;
  if (aNew && bNew) return compareDate(a, b);

  // 第2级：旧文章按手动列表排序
  const aIndex = orderMap.get(a.filePath) ?? -1;
  const bIndex = orderMap.get(b.filePath) ?? -1;
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return compareDate(a, b);
};

/**
 * 获取所有文章，读取其内容并解析 front matter
 * @returns {Promise<Object[]>} - 文章对象数组
 */
export const getAllPosts = async () => {
  try {
    // 获取所有 Markdown 文件的路径
    let paths = await getPostMDFilePaths();
    // 读取和处理每个 Markdown 文件的内容
    let posts = await Promise.all(
      paths.map(async (item) => {
        try {
          // 读取文件内容
          const content = await fs.readFile(item, "utf-8");
          // 文件的元数据
          const stat = await fs.stat(item);
          // 获取文件创建时间和最后修改时间
          const { birthtimeMs, mtimeMs } = stat;
          // 解析 front matter
          const { data, content: bodyContent } = matter(content);
          const { title, date: fmDate, categories, description, tags, top, cover } = data;
          // 如果 frontmatter 没有 title，从正文第一个 # 标题提取
          const extractedTitle = title || (() => {
            const match = bodyContent.match(/^#\s+(.+)$/m);
            return match ? match[1].trim() : null;
          })();
          // 如果 frontmatter 没有 categories，从文件路径推断（只取父目录）
          const extractedCategories = categories || (() => {
            const parts = item.replace(/\\/g, "/").split("/");
            if (parts.length < 2) return null;
            // 只取第一级目录
            return [parts[0]];
          })();
          // 如果 frontmatter 没有 tags，且属于"社会现象与心理"子目录，用子文件夹名作为 tag
          const extractedTags = tags || (() => {
            const parts = item.replace(/\\/g, "/").split("/");
            // 至少有父目录和子目录两层，且父目录是"社会现象与心理"
            if (parts.length >= 3 && parts[0] === "社会现象与心理") {
              return [parts[1]];
            }
            return null;
          })();
          // 日期：手动列表日期 > frontmatter 日期 > 文件创建日期
          const manualDate = manualDateMap.get(item);
          const finalDate = manualDate != null
            ? manualDate
            : (fmDate ? new Date(fmDate).getTime() : birthtimeMs);
          // 计算文章的过期天数
          const expired = Math.floor(
            (new Date().getTime() - finalDate) / (1000 * 60 * 60 * 24),
          );
          // 返回文章对象
          return {
            id: generateId(item),
            filePath: item,
            title: extractedTitle || "未命名文章",
            date: finalDate,
            lastModified: mtimeMs,
            expired,
            tags: extractedTags,
            categories: extractedCategories,
            description,
            regularPath: `/${item.replace(".md", ".html")}`,
            top,
            cover,
          };
        } catch (error) {
          console.error(`处理文章文件 '${item}' 时出错:`, error);
          throw error;
        }
      }),
    );
    // 根据日期排序文章
    posts.sort(comparePostPriority);
    return posts;
  } catch (error) {
    console.error("获取所有文章时出错:", error);
    throw error;
  }
};

/**
 * 获取所有标签及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllType = (postData) => {
  const tagData = {};
  // 遍历数据
  postData.map((item) => {
    // 检查是否有 tags 属性
    if (!item.tags || item.tags.length === 0) return;
    // 处理标签
    if (typeof item.tags === "string") {
      // 以逗号分隔
      item.tags = item.tags.split(",");
    }
    // 遍历文章的每个标签
    item.tags.forEach((tag) => {
      // 初始化标签的统计信息，如果不存在
      if (!tagData[tag]) {
        tagData[tag] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果标签已存在，则增加计数和记录所属文章
        tagData[tag].count++;
        tagData[tag].articles.push(item);
      }
    });
  });
  return tagData;
};

/**
 * 获取所有分类及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllCategories = (postData) => {
  const catData = {};
  // 遍历数据
  postData.map((item) => {
    if (!item.categories || item.categories.length === 0) return;
    // 处理标签
    if (typeof item.categories === "string") {
      // 以逗号分隔
      item.categories = item.categories.split(",");
    }
    // 遍历文章的每个标签
    item.categories.forEach((tag) => {
      // 初始化标签的统计信息，如果不存在
      if (!catData[tag]) {
        catData[tag] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果标签已存在，则增加计数和记录所属文章
        catData[tag].count++;
        catData[tag].articles.push(item);
      }
    });
  });
  return catData;
};

/**
 * 获取所有年份及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含归档统计信息的对象
 */
export const getAllArchives = (postData) => {
  const archiveData = {};
  // 遍历数据
  postData.forEach((item) => {
    // 检查是否有 date 属性
    if (item.date) {
      // 将时间戳转换为日期对象
      const date = new Date(item.date);
      // 获取年份
      const year = date.getFullYear().toString();
      // 初始化该年份的统计信息，如果不存在
      if (!archiveData[year]) {
        archiveData[year] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果年份已存在，则增加计数和记录所属文章
        archiveData[year].count++;
        archiveData[year].articles.push(item);
      }
    }
  });
  // 提取年份并按降序排序
  const sortedYears = Object.keys(archiveData).sort((a, b) => parseInt(b) - parseInt(a));
  return { data: archiveData, year: sortedYears };
};
