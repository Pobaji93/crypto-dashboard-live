// next.config.js
module.exports = {
  webpack: (config) => {
    config.externals.push({
      'bufferutil': 'commonjs bufferutil',
      'utf-8-validate': 'commonjs utf-8-validate',
    });
    return config;
  },
};
