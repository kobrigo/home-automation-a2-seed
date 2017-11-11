import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from "./seed.config.interfaces";

import { argv } from 'yargs';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  PORT = argv['port'] || 4444;

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},

      /* Selects a pre-built Material theme */
      {src: '@angular/material/prebuilt-themes/indigo-pink.css', inject: true}
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
    let additionalPackages: ExtendPackages[] = [
      // {
      //   name: 'ng2-translate',
      //   // Path to the package's bundle
      //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
      // }
      {
        name: '@angular/material',
        path: 'node_modules/@angular/material/bundles/material.umd.js'
      },
      {
        name: '@angular/flex-layout',
        path: 'node_modules/@angular/flex-layout/bundles/flex-layout.umd.js'
      },
      {
        name: 'socket.io-client',
        path: 'node_modules/socket.io-client/dist',
        packageMeta: {
          defaultExtension: 'js',
          main: 'socket.io.js'
        }
      },
      {
        name: 'ng2-socket-io',
        path: 'node_modules/ng2-socket-io/',
        packageMeta: {
          defaultExtension: 'js',
          main: 'index.js'
        }
      }

    ];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    this.PROXY_MIDDLEWARE = [
      // require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
      require('http-proxy-middleware')('/api', {ws: true, target: 'http://localhost:4000', logLevel: 'debug'})
    ];

    /* Add to or override NPM module configurations: */
    this.PLUGIN_CONFIGS['browser-sync'] = {
      socket: {
        // namespace: '/seed-browser-sync',
        domain: 'localhost:5555'
      },
      ghostMode: false
    };

    //Added support for scss like described in https://github.com/mgechev/angular-seed/wiki/Working-with-SASS
    this.ENABLE_SCSS = true;
  }

}
