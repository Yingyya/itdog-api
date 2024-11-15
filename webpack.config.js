// eslint-disable-next-line @typescript-eslint/no-var-requires
const JavaScriptObfuscator = require('webpack-obfuscator');
const _plugins = [];
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  _plugins.push(
    new JavaScriptObfuscator({
      compact: true, // 压缩
      controlFlowFlattening: false, // 混淆控制流
      deadCodeInjection: true, // 死代码注入
      identifierNamesGenerator: 'mangled', // 混淆标识符
      log: true, // 输出日志
      renameGlobals: false, // 重命名全局变量
      rotateStringArray: true, // 旋转字符串数组
      selfDefending: true, // 自定义防御
      target: 'node',
    }),
  );
}

module.exports = (config) => {
  return {
    ...config,
    externals: {
      '@nestjs/common': 'commonjs @nestjs/common',
      '@nestjs/core': 'commonjs @nestjs/core',
      '@nestjs/platform-express': 'commonjs @nestjs/platform-express',
      '@nestjs/platform-fastify': 'commonjs @nestjs/platform-fastify',
      '@nestjs/platform-socket.io': 'commonjs @nestjs/platform-socket.io',
      '@nestjs/websockets': 'commonjs @nestjs/websockets',
      rxjs: 'commonjs rxjs',
      'reflect-metadata': 'commonjs reflect-metadata',
    },
    plugins: [...config.plugins, ..._plugins],
  };
};
