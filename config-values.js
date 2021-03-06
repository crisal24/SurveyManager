/*
 * Copyright 2016 e-UCM (http://www.e-ucm.es/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0 (link is external)
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * This file exports two objects ('defaultValues' and 'testValues') with the information needed to
 * create the 'config.js' and 'config-test.js' files, as specified in the file 'setup.js'.
 *
 * config.js is used in when we are not performing tests over the application ('npm start').
 * config-test.js is used when the tests are launched ('npm test').
 *
 * For more information about the configuration files, take a lok at 'setup.js' to see how generates
 * the files from the 'config-example.js' file.
 *
 * The following values are needed for the configuration.
 *
 * @param projectName - Used in the 'subject' of the emails received (contact form) or sent (password reset).
 * @param companyName -
 * @param a2Host - Used to build 'apiPath'
 * @param a2Port - Used to build 'apiPath'
 * @param apiPath - Path for the requests.
 * @param port - port to listen to.
 */

/**
 * Initializes 'conf' properties with values read from the environment.
 * The environment values must have the following format:
 *      'prefix' + 'conf.propertyKey'
 *          or
 *      'prefix' + 'conf.propertyKey.toUpperCase()'
 *
 * 'links' is an array with values that, when appended '_PORT', can be found in the environment.
 * Is useful for a faster parse of some values such as A2 host/port.
 *
 * @param conf
 * @param prefix
 * @param links
 */
function initFromEnv(conf, prefix, links) {

    for (var item in conf) {
        var envItem = process.env[prefix + item];
        if (!envItem) {
            envItem = process.env[prefix + item.toUpperCase()];
        }
        if (envItem) {
            conf[item] = envItem;
        }
    }

    links.forEach(function (link) {
        var linkPort = process.env[link.toUpperCase() + '_PORT'];
        if (linkPort) {
            /*
             We want to end up with:
             conf.mongoHost = 172.17.0.15;
             conf.mongoPort = 27017;
             Starting with values like this:
             MONGO_PORT=tcp://172.17.0.15:27017
             */
            var values = linkPort.split('://');
            if (values.length === 2) {
                values = values[1].split(':');
                if (values.length === 2) {
                    conf[link + 'Host'] = values[0];
                    conf[link + 'Port'] = values[1];
                }
            }
        }
    });
}

exports.defaultValues = {
    projectName: 'Survey Manager',
    companyName: 'e-UCM Research Group',
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongodbUrl: 'mongodb://localhost:27017/limesurveymanager',
    a2Host: 'localhost',
    a2Port: '3000',
    a2Prefix: 'surveymanager',
    a2HomePage: 'http://localhost:3000/',
    a2ApiPath: 'http://localhost:3000/api/',
    a2AdminUsername: 'root',
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    a2AdminPassword: process.env.A2_rootPassword || (process.env.A2_ROOTPASSWORD || 'root'),
    apiPath: 'localhost:4000/api',
    host: 'localhost',
    port: 4000,
    appPrefix: 'surveymanager',
    myHost: process.env.MY_HOST || 'localhost',
    limesurveyHost: 'localhost',
    limesurveyPort: '80',
    limesurveyUrl: 'http://localhost:80/',
    externalLimesurveyUrl: 'https://polls.e-ucm.es/',
    backendName: process.env.BACKEND_NAME
};

exports.testValues = {
    projectName: 'Survey Manager',
    companyName: 'e-UCM Research Group',
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongodbUrl: 'mongodb://localhost:27017/limesurveymanager-test',
    a2Host: 'localhost',
    a2Port: '3000',
    a2Prefix: 'surveymanager',
    a2HomePage: 'http://localhost:3000/',
    a2ApiPath: 'http://localhost:3000/api/',
    a2AdminUsername: 'root',
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    a2AdminPassword: process.env.A2_rootPassword || (process.env.A2_ROOTPASSWORD || 'root'),
    apiPath: 'localhost:4000/api',
    host: 'localhost',
    port: 4000,
    appPrefix: 'surveymanager',
    myHost: process.env.MY_HOST || 'localhost',
    limesurveyHost: 'localhost',
    limesurveyPort: '80',
    limesurveyUrl: 'http://localhost:80/',
    externalLimesurveyUrl: 'https://polls.e-ucm.es/',
    backendName: process.env.BACKEND_NAME
};

var prefix = 'RAGE_ANALYTICS_SURVEYMANAGER_';
var links = ['a2','limesurvey','mongo'];
initFromEnv(exports.defaultValues, prefix, links);
initFromEnv(exports.testValues, prefix, links);

// Some control instructions
exports.defaultValues.mongodbUrl = 'mongodb://' + exports.defaultValues.mongoHost + ':' + exports.defaultValues.mongoPort + '/limesurveymanager';
exports.testValues.mongodbUrl = exports.defaultValues.mongodbUrl + '-test';

exports.defaultValues.apiPath = 'http://' + exports.defaultValues.host + ':' + exports.defaultValues.port + '/api';
exports.testValues.apiPath = exports.defaultValues.apiPath;

exports.defaultValues.a2HomePage = 'http://' + exports.defaultValues.a2Host + ':' + exports.defaultValues.a2Port + '/';
exports.defaultValues.a2ApiPath = exports.defaultValues.a2HomePage + 'api/';
exports.testValues.a2HomePage = exports.defaultValues.a2HomePage;
exports.testValues.a2ApiPath = exports.defaultValues.a2ApiPath;


exports.testValues.a2AdminUsername = exports.defaultValues.a2AdminUsername;
exports.testValues.a2AdminPassword = exports.defaultValues.a2AdminPassword;

exports.defaultValues.limesurveyUrl = exports.defaultValues.limesurveyHost + ':' + exports.defaultValues.limesurveyPort;
exports.testValues.limesurveyUrl = exports.defaultValues.limesurveyUrl;

exports.defaultValues.backendUrl = exports.defaultValues.a2ApiPath + 'proxy/' + exports.defaultValues.backendName;
exports.testValues.backendUrl = exports.defaultValues.backendUrl;

if(process.env.LIMESURVEY_URL){
    exports.defaultValues.externalLimesurveyUrl = process.env.LIMESURVEY_URL;
    exports.testValues.externalLimesurveyUrl = process.env.LIMESURVEY_URL;
}

