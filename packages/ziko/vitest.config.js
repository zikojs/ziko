// import { defineConfig, configDefaults  } from "vitest/config";
// export default defineConfig({
//     test : {
//         globals : true,
//         include : [ 'test/**/*.test.js'],
//         snapshotFormat : { escapeString : false },
//         environment: 'jsdom',
//         // reporters:['html']
//         // reporters: ['json', ...configDefaults.reporters],
//         // reporters: ['default', 'junit'], 
//         // outputFile: './reports/junit.xml', 
//     },
// })


import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include : [ 'test/**/*.test.js'],

    reporters: [
      'default',
      [
        resolve('./pdf.js'),
        {
          outputFile: '.reports/tests.pdf',
          title: 'ZikoJS – Test Report',
          showPassed: true,
          maxErrorLines: 25,
        },
      ],
    ],
  },
})