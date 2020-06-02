import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

Vue.use(Vuex)

/* 
动态加载vuex中所有的modules模块
不再需要通过import手动一个一个引入
*/
const context = require.context('./modules', false, /\.js$/)
const modules = context.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = context(modulePath).default
  return modules
}, {})

// const modules2 = []
// const context2 = require.context('./modules', false, /\.js$/)
// const modulePaths = context2.keys()
// modulePaths.forEach(path => {
//   const moduleName = path.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const module = context(path).default
//   modules2[moduleName] = module
//   // console.log(path, moduleName, module)
// })
// console.log('modules', modules)

const context2 = require.context('./modules', false, /\.js$/)
const modules2 = context2.keys().reduce((pre, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const module = context2(modulePath).default
  pre[moduleName] = module
  return pre
}, {})

const store = new Vuex.Store({
  modules: modules2,
  getters,
})

export default store
