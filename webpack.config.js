const path = require('path');

const BUILD_TYPE_MAP = {
  'vendor-dll': (config, { webpack }) => {
    config.plugins.push(new webpack.DllPlugin({
      context: __dirname,
      name: 'vendor',
      path: path.join(__dirname, 'lib', 'vendor.manifest.json'),
    }));

    Object.assign(config.output, {
      path: path.join(__dirname, 'public', 'dll', 'vendor'),
      library: 'vendor',
      // filename: 'vendor.js',
    });

    return config;
  },
  'app-dll': (config, { webpack }) => {
    config.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, 'lib', 'vendor.manifest.json'),
      name: 'vendor',
    }));

    // config.plugins.push(new webpack.DllPlugin({
    //   context: __dirname,
    //   name: 'app',
    //   path: path.join(__dirname, 'lib', 'app.manifest.json'),
    // }));

    Object.assign(config.output, {
      path: path.join(__dirname, 'public', 'dll', 'app'),
      library: 'app',
      // filename: 'app.js',
    });

    return config;
  },
  'module-build': (config, { webpack }) => {
    config.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, 'lib', 'vendor.manifest.json'),
      name: 'vendor',
    }));

    // config.plugins.push(new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.join(__dirname, 'lib', 'app.manifest.json'),
    //   name: 'app',
    // }));

    console.log('NODE_BUILD_MODULE_PATH ->>>> ', process.env.NODE_BUILD_MODULE_PATH);

    Object.assign(config.output, {
      path: path.resolve(process.env.NODE_BUILD_MODULE_PATH, 'dist'),
      // filename: 'moduleA.js',
    });

    // config.resolve.modules.push(path.join(__dirname, 'node_modules'));
    // config.resolve.modules.push(path.join(process.cwd(), 'node_modules'));
    // config.resolve.modules.shift();
    // config.resolve.modules.shift();
    // config.resolve.modules.push(path.join(__dirname, 'node_modules'));
    // console.log(config.resolve.modules);

    return config;
  },
  'module-dev': (config, { webpack }) => {
    config.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, 'lib', 'vendor.manifest.json'),
      name: 'vendor',
    }));

    // config.plugins.push(new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.join(__dirname, 'lib', 'app.manifest.json'),
    //   name: 'app',
    // }));

    config.resolve.modules.push(path.join(__dirname, 'node_modules'));
    console.log(config.resolve.modules);

    return config;
  },
  'modules-build': (config, { webpack }) => {
    config.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, 'lib', 'vendor.manifest.json'),
      name: 'vendor',
    }));

    // config.plugins.push(new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.join(__dirname, 'lib', 'app.manifest.json'),
    //   name: 'app',
    // }));

    Object.assign(config.output, {
      path: path.join(__dirname, 'modules'),
      // filename: 'moduleA.js',
    });

    return config;
  },
  'modules-dev': (config, { webpack }) => {
    // config.plugins.push(new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.join(__dirname, 'lib', 'vendor.manifest.json'),
    //   name: 'vendor',
    // }));

    // config.plugins.push(new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.join(__dirname, 'lib', 'app.manifest.json'),
    //   name: 'app',
    // }));

    // config.resolve.modules.push(path.join(__dirname, 'node_modules'));

    return config;
  },
  otherwise : (config, { webpack }) => {
    config.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, 'lib', 'vendor.manifest.json'),
      name: 'vendor',
    }));

    return config;
  },
}

module.exports = BUILD_TYPE_MAP[process.env.NODE_BUILD_TYPE] || BUILD_TYPE_MAP.otherwise;
