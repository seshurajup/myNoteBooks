# Setup Angular
#### Install NPM on mac OS
```console
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew install node
```
### Install angular-cli ( angular - command line interface )
```console
npm install -g @angular/cli
```

### Create angular project with angular-cli
based on this course 
* https://www.lynda.com/Angular-tutorials/Learning-Angular-CLI/653259-2.html
```console
ng new appname --routing --style=scss --service-worker # --dry-run --prefix=prefix_component
```
create angular project name as  **appname** with following properties
* **--routing** : including routing
* **--style=scss** : scss as our high level style library
* **--service-worker** : To include service worker for this angular project to cache it at browser side
* **--dry-run** : Generate the files output but not actually created on disk
* **--prefix** : Adding custom prefix to components for this project
```console
CREATE appname/README.md (1024 bytes)
CREATE appname/angular.json (3648 bytes)
CREATE appname/package.json (1311 bytes)
CREATE appname/tsconfig.json (384 bytes)
CREATE appname/tslint.json (2805 bytes)
CREATE appname/.editorconfig (245 bytes)
CREATE appname/.gitignore (503 bytes)
CREATE appname/src/environments/environment.prod.ts (51 bytes)
CREATE appname/src/environments/environment.ts (631 bytes)
CREATE appname/src/favicon.ico (5430 bytes)
CREATE appname/src/index.html (294 bytes)
CREATE appname/src/main.ts (370 bytes)
CREATE appname/src/polyfills.ts (3194 bytes)
CREATE appname/src/test.ts (642 bytes)
CREATE appname/src/assets/.gitkeep (0 bytes)
CREATE appname/src/styles.scss (80 bytes)
CREATE appname/src/browserslist (375 bytes)
CREATE appname/src/karma.conf.js (964 bytes)
CREATE appname/src/tsconfig.app.json (194 bytes)
CREATE appname/src/tsconfig.spec.json (282 bytes)
CREATE appname/src/tslint.json (314 bytes)
CREATE appname/src/app/app-routing.module.ts (245 bytes)
CREATE appname/src/app/app.module.ts (393 bytes)
CREATE appname/src/app/app.component.scss (0 bytes)
CREATE appname/src/app/app.component.html (1173 bytes)
CREATE appname/src/app/app.component.spec.ts (1107 bytes)
CREATE appname/src/app/app.component.ts (208 bytes)
CREATE appname/e2e/protractor.conf.js (752 bytes)
CREATE appname/e2e/src/app.e2e-spec.ts (303 bytes)
CREATE appname/e2e/src/app.po.ts (208 bytes)
CREATE appname/e2e/tsconfig.e2e.json (213 bytes)

> fsevents@1.2.4 install /Users/dolcera/Sites/myNoteBooks/appname/node_modules/fsevents
> node install

[fsevents] Success: "/Users/dolcera/Sites/myNoteBooks/appname/node_modules/fsevents/lib/binding/Release/node-v59-darwin-x64/fse.node" is installed via remote

> node-sass@4.9.0 install /Users/dolcera/Sites/myNoteBooks/appname/node_modules/node-sass
> node scripts/install.js

Cached binary found at /Users/dolcera/.npm/node-sass/4.9.0/darwin-x64-59_binding.node

> node-sass@4.9.0 postinstall /Users/dolcera/Sites/myNoteBooks/appname/node_modules/node-sass
> node scripts/build.js

Binary found at /Users/dolcera/Sites/myNoteBooks/appname/node_modules/node-sass/vendor/darwin-x64-59/binding.node
Testing binary
Binary is fine

> @angular/cli@6.0.8 postinstall /Users/dolcera/Sites/myNoteBooks/appname/node_modules/@angular/cli
> node ./bin/ng-update-message.js
```
### Setup development environment
based on this course
* https://www.lynda.com/Angular-tutorials/Learning-Angular-CLI/653259-2.html
```console
cd appname
```
* **package.json** : describe the project and its dependencies.
* **angular.json** : describe the additional information about the angular cli project
* **karma.conf.js** : configuration file for karma to do unit testing
* **protractor.js** : configration file for end to end testing
* **tsconfig.json** : describe the compiliation required to compile this project
* **tslint.js** : it is static analysis for typescript to check readability, maintainability and fuctionality erros

#### angular.json
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "appname": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {
        "@schematics/angular:component": {
          "styleext": "scss"
        }
      },
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/appname",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss",
             // "../node_modules/bootstrap/scss/bootstrap.scss" # other way of adding bootstrap 
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "appname:build"
          },
          "configurations": {
            "production": {
              "browserTarget": "appname:build:production"
            }
          }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "appname:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.spec.json",
            "karmaConfig": "src/karma.conf.js",
            "styles": [
              "src/styles.scss"
            ],
            "scripts": [],
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ]
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "src/tsconfig.app.json",
              "src/tsconfig.spec.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    },
    "appname-e2e": {
      "root": "e2e/",
      "projectType": "application",
      "architect": {
        "e2e": {
          "builder": "@angular-devkit/build-angular:protractor",
          "options": {
            "protractorConfig": "e2e/protractor.conf.js",
            "devServerTarget": "appname:serve"
          },
          "configurations": {
            "production": {
              "devServerTarget": "appname:serve:production"
            }
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": "e2e/tsconfig.e2e.json",
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "defaultProject": "appname"
}
```
* **assets** : all assets we use for our project
* **styles** : Loading all styles including external frameworks like bootstrap4
* **scripts** : Loading all exterinal javascript libraries
* **environments** : loading dev/prod environment parameters
```bash
    ng build # default build run for the development environment
    ng build --prod # build run for the production environment
```
* **serviceworker**: to enable/disable service-worker for this project


#### Adding Bootstrap 4 to angular project
```bash
npm install bootstrap --save # installing bootstrap 4
npm install jquery@1.9.1 --save
npm install popper.js@^1.14.3 --save
```
* Modify src/styles.scss to load bootstrap in styles section
```scss
@import "./style/appname-theme.scss";
@import "../node_modules/bootstrap/scss/bootstrap.scss";
// import your own custom files, e.g.
@import "style/variables";
@import "style/global";
```
### Build Development Environment
based on this course
* https://www.lynda.com/Angular-tutorials/Learning-Angular-CLI/653259-2.html

```json
{
  "name": "appname",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --host=localhost --open", // usage: npm start # --proxy-config proxy-config.json
    "build:dev": "ng build --stats-json", // usage: npm run build
    "build:prod": "ng build --prod --stats-json",  // usage: npm run build:prod
    "test": "ng test --code-coverage --watch --progress=false", // usage npm test
    "test:once": "ng test --code-coverage --single-run --progress=false", // usage: npm test:once
    "lint": "ng lint",
    "e2e": "ng e2e" // To run ent to end testing
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^6.0.3",
    "@angular/common": "^6.0.3",
    "@angular/compiler": "^6.0.3",
    "@angular/core": "^6.0.3",
    "@angular/forms": "^6.0.3",
    "@angular/http": "^6.0.3",
    "@angular/platform-browser": "^6.0.3",
    "@angular/platform-browser-dynamic": "^6.0.3",
    "@angular/router": "^6.0.3",
    "core-js": "^2.5.4",
    "rxjs": "^6.0.0",
    "zone.js": "^0.8.26"
  },
  "devDependencies": {
    "@angular/compiler-cli": "^6.0.3",
    "@angular-devkit/build-angular": "~0.6.8",
    "typescript": "~2.7.2",
    "@angular/cli": "~6.0.8",
    "@angular/language-service": "^6.0.3",
    "@types/jasmine": "~2.8.6",
    "@types/jasminewd2": "~2.0.3",
    "@types/node": "~8.9.4",
    "codelyzer": "~4.2.1",
    "jasmine-core": "~2.99.1",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "~1.7.1",
    "karma-chrome-launcher": "~2.2.0",
    "karma-coverage-istanbul-reporter": "~2.0.0",
    "karma-jasmine": "~1.1.1",
    "karma-jasmine-html-reporter": "^0.2.2",
    "protractor": "~5.3.0",
    "ts-node": "~5.0.1",
    "tslint": "~5.9.1"
  }
}
```
#### karma.conf.js
Based on these courses
* https://www.lynda.com/Angular-tutorials/Learning-Angular-CLI/653259-2.html
* https://www.lynda.com/Angular-tutorials/Angular-Workflows/642502-2.html

```bash
npm install karma-spec-report --save-dev
npm install -D husky
npm install -D prettier
```
* **karma-spec-report**: Give more detail test reports in terminal output
```js
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-spec-report') // Added karma-spec-report 
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly','text-summary'], // Added text-summary for output parameters
      fixWebpackSourcePaths: true,
      thresholds: {
          statements: 80, // Added statements coverage thresold
          branches: 80, // Added branches coverage thresold
          lines: 80, // Added lines coverage thresold
          functions: 80 // Added functions coverage thresold
      }
    },
    reporters: ['spec', 'kjhtml'], // Replace progress with spec
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'], // Modify Chrome to ChromeHeadless
    singleRun: false
  });
};
```

```json
"scripts": {
    "ng": "ng",
    "start": "ng serve --host=localhost --open", // usage: npm start # --proxy-config proxy-config.json
    "build:dev": "ng build --stats-json", // usage: npm run build
    "build:prod": "ng build --prod --stats-json",  // usage: npm run build:prod
    "test": "ng test --code-coverage --watch --progress=false", // usage npm test
    "test:once": "ng test --code-coverage --single-run --progress=false", // usage: npm test:once
    "precommit": "run-s format:fix lint", // Before commit pretty the code then check the syntax issues
    "format:fix": "pretty-quick --staged",
    "lint": "ng lint",
    "e2e": "ng e2e" // To run ent to end testing
  },
```

```bash
touch .prettierrc
touch .prettierignore
# install the prettier plugin for a visual code editor
```
* its good to try Jest as alternative test framework other than Karma and protractor