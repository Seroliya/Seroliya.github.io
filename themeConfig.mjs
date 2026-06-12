// 主题配置 - 用户自定义
export const themeConfig = {
  // 站点信息
  siteMeta: {
    // 站点标题
    title: "柒柒酱的个人小站",
    // 站点描述
    description: "柒柒酱的个人小站 & Personal Archive",
    // 站点logo
    logo: "/photo.jpg",
    // 站点地址
    site: "https://seroliya.github.io",
    // 语言
    lang: "zh-CN",
    // 作者
    author: {
      name: "Seroliya",
      cover: "/photo.jpg",
      email: "",
      link: "https://github.com/Seroliya",
    },
  },
  // 备案信息
  icp: "",
  // 建站日期
  since: "2024",
  // 每页文章数据
  postSize: 10,
  // inject
  inject: {
    header: [
      ["link", { rel: "icon", href: "/icon.svg" }],
      // iconfont（主题图标字体）
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css",
        },
      ],
    ],
  },
  // 导航栏菜单
  nav: [
    {
      text: "文章",
      items: [
        { text: "文章列表", link: "/pages/archives" },
        { text: "全部分类", link: "/pages/categories" },
        { text: "全部标签", link: "/pages/tags" },
      ],
    },
    {
      text: "分类",
      items: [
        { text: "社会现象与心理", link: "/社会现象与心理/Social_Phenomenon&Psychology" },
        { text: "社交与信息获取", link: "/社交与信息获取/Socializing&Information_Gathering" },
        { text: "自我提升和学习", link: "/自我提升和学习/Self_improvement&Studying" },
        { text: "其他随笔", link: "/其他随笔/Others" },
      ],
    },
    {
      text: "关于",
      items: [
        { text: "关于本站", link: "/pages/about" },
      ],
    },
  ],
  // 导航栏菜单 - 左侧
  navMore: [
    {
      name: "链接",
      list: [
        {
          icon: "/icon.svg",
          name: "GitHub",
          url: "https://github.com/Seroliya",
        },
      ],
    },
  ],
  // 封面配置
  cover: {
    twoColumns: false,
    showCover: {
      enable: false,
    },
  },
  // 页脚信息
  footer: {
    social: [
      {
        icon: "github",
        link: "https://github.com/Seroliya",
      },
      {
        icon: { svg: "/zhihu.svg" },
        link: "https://www.zhihu.com/people/77-20-28-71",
      },
      {
        icon: "twitter-x",
        link: "https://x.com/77KawaiiQwQ",
      },
      {
        icon: "bilibili",
        link: "https://space.bilibili.com/1501387815",
      },
    ],
    sitemap: [
      {
        text: "分类",
        items: [
          { text: "社会现象与心理", link: "/社会现象与心理/Social_Phenomenon&Psychology" },
          { text: "社交与信息获取", link: "/社交与信息获取/Socializing&Information_Gathering" },
          { text: "自我提升和学习", link: "/自我提升和学习/Self_improvement&Studying" },
          { text: "其他随笔", link: "/其他随笔/Others" },
        ],
      },
      {
        text: "页面",
        items: [
          { text: "文章归档", link: "/pages/archives" },
          { text: "全部分类", link: "/pages/categories" },
          { text: "全部标签", link: "/pages/tags" },
          { text: "关于本站", link: "/pages/about" },
        ],
      },
    ],
  },
  // 评论
  comment: {
    enable: false,
    type: "artalk",
    artalk: {
      site: "",
      server: "",
    },
    twikoo: {
      js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/twikoo/1.6.39/twikoo.all.min.js",
      envId: "",
      region: "ap-shanghai",
      lang: "zh-CN",
    },
  },
  // 侧边栏
  aside: {
    hello: {
      enable: true,
      text: "这里是<strong>柒柒酱</strong>的个人小站，主要分享关于<strong>社会现象</strong>、<strong>心理学</strong>、<strong>社交</strong>与<strong>个人成长</strong>的观察与思考。",
    },
    toc: {
      enable: true,
    },
    tags: {
      enable: true,
    },
    countDown: {
      enable: true,
      data: {
        name: "元旦",
        date: "2027-01-01",
      },
    },
    siteData: {
      enable: true,
    },
  },
  // 友链
  friends: {
    circleOfFriends: "",
    dynamicLink: {
      server: "",
      app_token: "",
      table_id: "",
    },
  },
  // 音乐播放器
  music: {
    enable: false,
    url: "",
    id: 0,
    server: "netease",
    type: "playlist",
  },
  // 搜索（本地搜索，无需第三方服务）
  search: {
    enable: true,
  },
  // 打赏
  rewardData: {
    enable: false,
    wechat: "",
    alipay: "",
  },
  // 图片灯箱
  fancybox: {
    enable: false,
    js: "",
    css: "",
  },
  // 外链中转
  jumpRedirect: {
    enable: false,
    exclude: [],
  },
  // 站点统计
  tongji: {
    "51la": "",
  },
};
