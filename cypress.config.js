// Copyright 2024 oschuhmacher
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { defineConfig } = require("cypress");

const webpack = require("@cypress/webpack-preprocessor");

const preprocessor = require("@badeball/cypress-cucumber-preprocessor");



async function setupNodeEvents(on, config) {

    await preprocessor.addCucumberPreprocessorPlugin(on, config);



    on(

        "file:preprocessor",

        webpack({

            webpackOptions: {

                resolve: {

                    extensions: [".ts", ".js"],

                },

                module: {

                    rules: [

                        {

                            test: /\.feature$/,

                            use: [

                                {

                                    loader: "@badeball/cypress-cucumber-preprocessor/webpack",

                                    options: config,

                                },

                            ],

                        },

                    ],

                },

            },

        })

    );

    return config;

}



module.exports = defineConfig({
    e2e: {

        specPattern: "**/*.feature",

        supportFile: false,
        video: true,
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        retries: {
            runMode: 2, // 3 runs in total 
        },
        reporter: require.resolve("@badeball/cypress-cucumber-preprocessor/pretty-reporter"),
        setupNodeEvents,
    },
}); 