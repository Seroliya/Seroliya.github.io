import { defineConfig } from 'vitepress'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "柒柒酱的个人小站",
  description: "柒柒酱的个人小站",
  themeConfig: {
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '日常周记', link: '/日常周记/Think Carefully & Move Boldly：柒柒的高二总结'},
      { text: '社交笔记', link: '/社交笔记/社交笔记之一：将抑郁深藏于心的“小太阳”' },
      { text: '社会思考', link: '/社会思考/应试教育：为何离开，何时回来' },
      { text: 'Project', link: 'https://seroliya.github.io/emo_support_ai/' },
    ],

    sidebar: [
      {
        text: '日常周记',
        items: [
          { text: 'Think Carefully & Move Boldly：柒柒的高二总结', link: '/日常周记/Think Carefully & Move Boldly：柒柒的高二总结' },
          { text: '周记25.16-主观能动性，金钱观，博弈下的人际关系', link: '/日常周记/周记25.16-主观能动性，金钱观，博弈下的人际关系' },
          { text: '周记25.17-回首与重构：对过往学习方式的重新审视', link: '/日常周记/周记25.17-回首与重构：对过往学习方式的重新审视' }, 
          { text: '周记25.20-自信的培养与主被动学习的同调', link: '/日常周记/周记25.20-自信的培养与主被动学习的同调' },
          { text: '周记25.22-专注力&日程规划的方法与感悟', link: '/日常周记/周记25.22-专注力&日程规划的方法与感悟' },
          
        ]
      },
    
      {
        text: "社交笔记",
        items: [
          { text: '社交笔记之一：将抑郁深藏于心的“小太阳”', link: '/社交笔记/社交笔记之一：将抑郁深藏于心的“小太阳”' },
          { text: '社交笔记之二：中考复读，她如何“出淤泥而不染”', link: '/社交笔记/社交笔记之二：中考复读，她如何“出淤泥而不染”' }, 
          { text: '关于VRC与虚拟社交的分析报告', link: '/社交笔记/关于VRC与虚拟社交的分析报告' },
        ]
      },

      {
        text: "社会思考",
        items: [
          { text: '应试教育：为何离开，何时回来', link: '/社会思考/应试教育：为何离开，何时回来' },
          { text: '互联网普及那么多年，谁还记得真正有益的上网原则', link: '/社会思考/互联网普及那么多年，谁还记得真正有益的上网原则' },
          { text: 'AI和算法时代之下：脑测应试教育的未来', link: '/社会思考/AI和算法时代之下：脑测应试教育的未来' },
          { text: '20250620 学校批判存档', link: '/社会思考/20250620 学校批判存档' },

          { text: "药物滥用白皮书",
            items: [
              { text: '前言+第一章：界定难题＆现象总览', link: '/社会思考/药物滥用白皮书/前言+第一章：界定难题＆现象总览' },
              { text: '第二章：应试，家庭，社会加剧精神危机', link: '/社会思考/药物滥用白皮书/第二章：应试，家庭，社会加剧精神危机' },
              { text: '附录：个人案例&调查统计', link: '/社会思考/药物滥用白皮书/附录：个人案例&调查统计' },
              
            ]}
        ]
      },

      {
        text: "Project",
        items: [
          {text: 'AI情感支持', link: "https://seroliya.github.io/emo_support_ai/"},
          {text: '旧版博客（内含已归档文章）',link:"https://seroliya.github.io/-archived-Seroliya.github.io/"}
        ]
      }
    ],

    socialLinks: [
      { icon: 'x', link: 'https://x.com/77KawaiiQwQ' }
    ]
  }
})
