const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Disable source map loading for MediaPipe packages
    if (config.module && config.module.rules) {
      config.module.rules.forEach(rule => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use.forEach(loader => {
            if (loader.loader && loader.loader.includes('source-map-loader')) {
              if (!loader.exclude) {
                loader.exclude = [];
              }
              // Add the MediaPipe package to the exclude list
              loader.exclude.push(/node_modules[\\/]@mediapipe/);
            }
          });
        }
      });
    }
    
    return config;
  }
);
