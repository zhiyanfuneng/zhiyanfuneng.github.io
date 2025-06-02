<template>
  <div class="start-page">
    <img src="1.png" alt="游戏开始图片" class="start-page-image">
    <h1>您好呀!一起来玩游戏吧~</h1>
    <button @click="startGame">开始</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from '@vue/reactivity'

export default {
  name: 'StartPageComponent',
  setup () {
    const router = useRouter()
    const imageSrc = ref('/assets/images/start-game.jpg')

    const startGame = () => {
      router.push('/game')
    }

    return {
      startGame,
      imageSrc
    }
  }
}
</script>

<style scoped>
.start-page {
  text-align: center;
  padding: 20px;
}
.start-page-image {
  max-width: 300px;
  height: auto;
  margin-top: 20px; /* 控制图片与上方按钮的间距 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
//
