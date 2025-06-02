<template>
  <div id="app">
    <!-- 路由过渡动画 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup () {
    const router = useRouter()

    // 全局前置路由守卫
    // 修正：添加空格
    onBeforeMount(() => {
      // 修正：添加空格
      router.beforeEach((to, from, next) => {
        // 这里可以添加权限验证等逻辑
        console.log(`正在从 ${from.path} 导航到 ${to.path}`)
        // 确保 next 函数调用的逻辑完整性
        // 修正：添加空格
        if (to.path === '/restricted' && !isAuthenticated()) {
          next('/login')
        } else {
          next()
        }
      })
    })

    // 假设这里添加一个模拟的身份验证函数
    // 修正：添加空格
    const isAuthenticated = () => {
      // 这里可以实现具体的身份验证逻辑，比如从本地存储读取 token 等
      return false
    }

    return {}
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* 修正选择器，使用 Vue Router 的默认类名 */
.navbar.router-link {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}

.navbar.router-link:hover {
  text-decoration: underline;
}

/* 路由过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
//
