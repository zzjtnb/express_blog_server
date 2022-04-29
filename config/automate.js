module.exports = {
  dbOptions: {
    database: 'nodesql',
    username: 'root',
    password: 'root',
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    logging: false,
    define: {
      underscored: false,
      freezeTableName: false,
      charset: 'utf8mb4',
      timezone: '+08:00',
      dialectOptions: {
        collate: 'utf8mb4_general_ci',
      },
      timestamps: true,
    },
  },

  options: {
    type: 'js', // 指定 models 代码风格
    camelCase: false, // Models 文件中代码是否使用驼峰发命名
    fileNameCamelCase: true, // Model 文件名是否使用驼峰法命名，默认文件名会使用表名，如 `user_post.js`；如果为 true，则文件名为 `userPost.js`
    dir: 'model', // 指定输出 models 文件的目录
    typesDir: 'model', // 指定输出 TypeScript 类型定义的文件目录，只有 TypeScript / Midway 等会有类型定义
    emptyDir: false, // 生成 models 之前是否清空 `dir` 以及 `typesDir`
    tables: null, // 指定生成哪些表的 models，如 ['user', 'user_post']；如果为 null，则忽略改属性
    skipTables: null, // 指定跳过哪些表的 models，如 ['user']；如果为 null，则忽略改属性
    tsNoCheck: false, // 是否添加 `@ts-nocheck` 注释到 models 文件中
  },
};
