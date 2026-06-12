import { generateId } from "./commonTools.mjs";
import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";

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
const comparePostPriority = (a, b) => {
  if (a.top && !b.top) {
    return -1;
  }
  if (!a.top && b.top) {
    return 1;
  }
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
          const { title, date, categories, description, tags, top, cover } = data;
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
          // 如果 frontmatter 没有 tags，且属于“社会现象与心理”子目录，用子文件夹名作为 tag
          const extractedTags = tags || (() => {
            const parts = item.replace(/\\/g, "/").split("/");
            // 至少有父目录和子目录两层，且父目录是“社会现象与心理”
            if (parts.length >= 3 && parts[0] === "社会现象与心理") {
              return [parts[1]];
            }
            return null;
          })();
          // 计算文章的过期天数
          const expired = date ? Math.floor(
            (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
          ) : 0;
          // 返回文章对象
          return {
            id: generateId(item),
            title: extractedTitle || "未命名文章",
            date: date ? new Date(date).getTime() : birthtimeMs,
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
