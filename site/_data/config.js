module.exports = () => {
  return {
    isProduction: (process.env.ELEVENTY_PRODUCTION === 'true')
  }
}