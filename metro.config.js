// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const jsoMetroPlugin = require("obfuscator-io-metro-plugin")(
    {
      // Các tùy chọn obfuscation cho plugin
      compact: false,
      sourceMap: false, // Source Map không cần thiết
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1,
    },
    {
      runInDev: false,  // Không chạy obfuscation trong môi trường dev
      logObfuscatedFiles: true, 
    }
  );
  
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = {
    ...config, // Kết hợp cấu hình Expo mặc định
    transformer: {
      ...config.transformer, // Kết hợp cấu hình transformer mặc định từ Expo
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    ...jsoMetroPlugin, // Thêm cấu hình obfuscator vào
  };