import { defineConfig } from 'vitepress'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "柒柒酱的个人小站",
  description: "柒柒酱的个人小站",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '日常周记', link: '/Think Carefully & Move Boldly：柒柒的高二总结' },
      { text: '社交笔记', link: '/markdown-examples' },
      { text: '社会报告', link: '/markdown-examples' },
      { text: 'Project', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: "日常周记", 
        link: '/docs/Ryoko的日常周记/' 
      },
    

      {
        text: "ai情感支持",
        link: "/https://seroliya.github.io/emo_support_ai/"
        
      }
    ],

    socialLinks: [
      { icon: 'x', link: 'https://x.com/77KawaiiQwQ' }
    ]
  }
})
