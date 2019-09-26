module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://webres.psy-1.com/sgy/dist' : './', // /cosleep/teacher/    ./ https://webres.psy-1.com/sgy/dist
  assetsDir: './',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/GlobalScss/setSize.scss";` // @import "@/globalscss/setSize.scss";
      }
    }
  }
}
