import { createRouter, createWebHistory } from 'vue-router'
import First from '@/components/First.vue'
import Start from '@/components/Start.vue'
import Game from '@/components/Game.vue'
import MemoryGame from '@/components/MemoryGame.vue'
import Result from '@/components/Result.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'First',
      component: First
    },
    {
      path: '/start',
      name: 'Start',
      component: Start
    },
    {
      path: '/game',
      name: 'Game',
      component: Game
    },
    {
      path: '/memorygame',
      name: 'memorygame',
      component: MemoryGame
    },
    {
      path: '/result',
      name: 'Result',
      component: Result
    }
  ]
})

export default router
//
