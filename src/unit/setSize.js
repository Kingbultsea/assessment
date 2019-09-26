function setSizeRem () {
  var width = document.documentElement.clientWidth
  var html = document.querySelector('html')
  html.style.fontSize = width / 10 + 'px'
}
setSizeRem()
window.addEventListener('resize', setSizeRem)
