import { defineConfig, configDefaults  } from "vitest/config";
export default defineConfig({
    test : {
        globals : true,
        include : [ 'test/**/*.test.js'],
        snapshotFormat : { escapeString : false },
        environment: 'jsdom',
        // reporters:['html']
        // reporters: ['json', ...configDefaults.reporters],
        // reporters: ['default', 'junit'], 
        // outputFile: './reports/junit.xml', 
    },
})