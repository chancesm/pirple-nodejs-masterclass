// Create and export config variables

const environments = {
  staging: {
    environment: 'staging',
    port: 3000,
    securePort: 3001,
  },
  production: {
    environment: 'production',
    port: 4000,
    securePort: 4001,
  }
}
const currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : '';
const selectedConfig = environments[currentEnv] ? environments[currentEnv] : environments['staging'];
module.exports = selectedConfig;