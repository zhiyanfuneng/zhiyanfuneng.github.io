<template>
  <div id="game-container">
    <h1>颜色位置记忆测试</h1>
    <p id="instruction">{{ instructionText }}</p>
    <button
      id="start-button"
      :style="{ display: gameStarted ? 'none' : 'block' }"
      @click="startGame"
    >
      开始游戏
    </button>
    <div id="game-area" :style="{ display: gameStarted ? 'grid' : 'none' }">
      <div
        v-for="(square, index) in squares"
        :key="index"
        class="square"
        :style="{ backgroundColor: square.color, opacity: square.clicked ? 0.5 : 1 }"
        @click="handleSquareClick(index)"
      ></div>
    </div>
    <button
      id="confirm-button"
      :style="{ display: confirmButtonVisible ? 'block' : 'none' }"
      @click="handleConfirm"
    >
      确定
    </button>
    <div
      id="final-score"
      :style="{ display: showFinalScore ? 'block' : 'none' }"
    >
      恭喜您！游戏结束，您的得分为 <span id="final-score-value">{{ score.toFixed(1) }}</span> 分
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const instructionText = ref('点击开始按钮开始游戏')
const confirmButtonVisible = ref(false)
const showFinalScore = ref(false)
const score = ref(0)
const currentTestIndex = ref(0)
const targetPositions = ref([])
const squares = ref([])
const gameState = ref('not_started') // not_started, preparing, showing, answering
const currentColor = ref('') // 当前轮次要记忆的颜色
const ROUND_SCORE = 2.5 // 每轮总分
const gameStarted = ref(false) // 游戏是否已开始

// 颜色映射对象，键为颜色值，值为对应的中文名称
const colorMap = {
  red: '红色',
  green: '绿色',
  blue: '蓝色',
  yellow: '黄色'
}

// 测试颜色值（英文）
const testColors = ['red', 'green', 'blue', 'yellow']

// 开始游戏
const startGame = () => {
  gameStarted.value = true
  score.value = 0
  currentTestIndex.value = 0
  showRound()
}

// 显示当前轮次
const showRound = () => {
  if (currentTestIndex.value >= testColors.length) {
    showFinalScore.value = true
    return
  }

  gameState.value = 'preparing'
  currentColor.value = testColors[currentTestIndex.value]
  instructionText.value = `请准备记忆${colorMap[currentColor.value]}方块的位置`
  // 准备阶段
  setTimeout(() => {
    gameState.value = 'showing'
    instructionText.value = `记忆${colorMap[currentColor.value]}方块的位置`
    generateSquares(currentColor.value)
    // 展示1秒后切换
    setTimeout(() => {
      gameState.value = 'answering'
      instructionText.value = `请点击${colorMap[currentColor.value]}方块出现过的位置`
      showPureColor(currentColor.value)
      confirmButtonVisible.value = true
    }, 1000)
  }, 1000)
}

// 生成25个方块（含3个不相邻的目标方块）
const generateSquares = (targetColor) => {
  squares.value = []
  targetPositions.value = getThreeNonAdjacentPositions()

  const colors = ['red', 'green', 'blue', 'yellow']
  colors.splice(colors.indexOf(targetColor), 1)

  for (let i = 0; i < 25; i++) {
    const isTarget = targetPositions.value.includes(i)
    const color = isTarget ? targetColor : colors[Math.floor(Math.random() * colors.length)]
    squares.value.push({
      color,
      clicked: false,
      index: isTarget ? i : null,
      isTarget: isTarget // 标记是否为目标方块
    })
  }
}

// 生成三个互不相邻的位置
const getThreeNonAdjacentPositions = () => {
  const allPositions = Array.from({ length: 25 }, (_, i) => i)
  const selectedPositions = []
  const maxAttempts = 100
  let attempts = 0

  const isAdjacent = (pos, targets) => {
    const row = Math.floor(pos / 5)
    const col = pos % 5
    return targets.some(existing => {
      const exRow = Math.floor(existing / 5)
      const exCol = existing % 5
      return (row === exRow && Math.abs(col - exCol) === 1) || (col === exCol && Math.abs(row - exRow) === 1)
    })
  }

  while (selectedPositions.length < 3 && attempts < maxAttempts) {
    const available = allPositions.filter(pos =>
      !selectedPositions.includes(pos) && !isAdjacent(pos, selectedPositions)
    )

    if (available.length === 0) {
      attempts++
      continue
    }

    const randomPos = available[Math.floor(Math.random() * available.length)]
    selectedPositions.push(randomPos)
  }

  return selectedPositions
}

// 显示纯色界面
const showPureColor = (currentColor) => {
  const colors = ['red', 'green', 'blue', 'yellow']
  colors.splice(colors.indexOf(currentColor), 1)
  const pureColor = colors[Math.floor(Math.random() * colors.length)]

  // 保留目标位置信息，只改变显示颜色
  squares.value = squares.value.map(square => ({
    ...square,
    color: pureColor,
    clicked: false
  }))
}

// 处理方块点击
const handleSquareClick = (index) => {
  if (gameState.value !== 'answering') return
  // 点击时显示当前轮次要记忆的颜色
  squares.value[index].clicked = !squares.value[index].clicked
  if (squares.value[index].clicked) {
    squares.value[index].color = currentColor.value
  } else {
    // 未点击状态恢复为纯色
    const colors = ['red', 'green', 'blue', 'yellow']
    colors.splice(colors.indexOf(currentColor.value), 1)
    const pureColor = colors[Math.floor(Math.random() * colors.length)]
    squares.value[index].color = pureColor
  }
}

// 处理确定按钮点击
const handleConfirm = () => {
  const clickedSquares = squares.value.filter(square => square.clicked)
  const clickedIndices = clickedSquares.map(square => square.index).filter(index => index !== null)
  // 显示正确和错误的选择
  squares.value.forEach(square => {
    if (square.isTarget) {
      square.color = 'green' // 正确的目标方块
    } else if (square.clicked && !square.isTarget) {
      square.color = 'red' // 错误点击的方块
    }
  })
  // 检查是否全部正确
  const isAllCorrect =
    clickedIndices.length === 3 &&
    clickedIndices.every(index => targetPositions.value.includes(index))
  if (isAllCorrect) {
    score.value += ROUND_SCORE
    alert(`恭喜！本轮得2.5分，总得分：${score.value.toFixed(1)}分`)
  } else {
    alert(`很遗憾，本轮得0分，总得分：${score.value.toFixed(1)}分`)
  }

  currentTestIndex.value++
  resetGameArea()
  showRound()
}

// 重置游戏区域
const resetGameArea = () => {
  squares.value.forEach(square => {
    square.clicked = false
    square.color = ''
  })
  confirmButtonVisible.value = false
}

onMounted(() => {
  // 不再自动开始游戏
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

#game-container {
  text-align: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
}

#game-area {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px auto;
  border: 2px solid #ccc;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 2px;
}

.square {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#instruction {
  font-size: 20px;
  margin: 20px 0;
  color: #333;
}

#start-button,
#confirm-button {
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: block;
  width: fit-content;
}

#start-button:hover,
#confirm-button:hover {
  background-color: #0056b3;
}

#final-score {
  display: none;
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}
</style>
//
