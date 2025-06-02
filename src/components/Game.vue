<template>
  <div class="game-page">
    <!-- 描述图片游戏 -->
    <div v-if="currentGameIndex === 0" class="fade-in">
      <h2>请尽可能描述您所看到的内容(且录音)</h2>
      <audio :src="audioSrc" autoplay @error="handleAudioError"></audio>
      <div class="image-container">
        <img src="tupian.png" alt="需要描述的图片" class="description-image">
      </div>
      <input type="text" v-model="imageDescription" placeholder="描述图片">
      <button @click="startRecording">开始录音</button>
      <button @click="stopRecording">停止录音</button>
      <button @click="submitImageDescription">提交描述</button>
      <audio v-if="recordedAudioUrl" :src="recordedAudioUrl" controls></audio>
    </div>
    <!-- 点击气球游戏 -->
    <div v-if="currentGameIndex === 1" class="fade-in">
      <h2>请点击上升的气球</h2>
      <audio :src="audioSrc" autoplay @error="handleAudioError"></audio>
      <div
        v-if="currentBalloon"
        @click="popBalloon"
        class="balloon"
        :style="{ left: currentBalloon.left + 'px', top: currentBalloon.top + 'px' }"
        :class="{ 'popped': currentBalloon.popped, 'idle': currentBalloon.idle }"
        @animationend="handleBalloonAnimationEnd"
        :key="balloonIndex"
      >
        <img src="balloon.png" alt="气球">
      </div>
      <p>已打破{{ poppedCount }}/10</p>
      <!-- 只在所有气球处理完成后显示按钮 -->
      <button v-if="showCompletionButton" @click="nextGame">进入下一个游戏</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameComponent',
  data () {
    return {
      currentGameIndex: 0,
      gameTypes: ['imageDescription', 'popBalloons'],
      imageDescription: '',
      recorder: null,
      recordedChunks: [],
      balloons: [],
      currentBalloon: null,
      poppedCount: 0,
      audioSrc: '',
      recordedAudioUrl: null,
      balloonWidth: 80,
      balloonHeight: 80,
      gameAreaWidth: window.innerWidth,
      gameAreaHeight: window.innerHeight,
      balloonIndex: 0,
      completedBalloons: 0,
      balloonGap: 300,
      waitForNextBalloon: false,
      showCompletionButton: false
    }
  },
  mounted () {
    this.setGameData()
  },
  methods: {
    setGameData () {
      const currentGame = this.gameTypes[this.currentGameIndex]
      if (currentGame === 'popBalloons') {
        this.initBalloons()
        this.showNextBalloon()
      }
      this.audioSrc = `audio/${currentGame}.mp3`
    },
    initBalloons () {
      const numBalloons = 10
      const midHeight = this.gameAreaHeight / 2
      const range = this.gameAreaHeight / 4
      for (let i = 0; i < numBalloons; i++) {
        const left = Math.random() * (this.gameAreaWidth - this.balloonWidth)
        const top = midHeight - range / 2 + Math.random() * range
        this.balloons.push({
          left,
          top,
          popped: false,
          animationDuration: Math.random() * 3 + 2,
          idle: true
        })
      }
    },
    showNextBalloon () {
      if (this.balloonIndex < 10) {
        this.currentBalloon = { ...this.balloons[this.balloonIndex] }
        this.currentBalloon.idle = false
        this.balloonIndex++
      } else {
        this.currentBalloon = null
        this.showCompletionButton = true
      }
    },
    popBalloon () {
      if (!this.currentBalloon.popped) {
        this.currentBalloon.popped = true
        this.poppedCount++
        this.completedBalloons++
        this.$nextTick(() => {
          this.showNextBalloon()
        })
      }
    },
    handleBalloonAnimationEnd () {
      this.completedBalloons++
      if (this.completedBalloons === 10) {
        this.showCompletionButton = true
      } else if (this.completedBalloons < 10) {
        this.showNextBalloon()
      }
    },
    submitPopBalloons () {
      console.log('点击气球游戏完成')
      this.showCompletionButton = true
    },
    startRecording () {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.recorder = new MediaRecorder(stream)
          this.recordedChunks = []
          this.recorder.ondataavailable = event => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data)
            }
          }
          this.recorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'audio/webm' })
            this.recordedAudioUrl = URL.createObjectURL(blob)
            console.log('录制的音频:', blob)
          }
          this.recorder.start()
        })
        .catch(error => {
          console.error('录音出错:', error)
        })
    },
    stopRecording () {
      if (this.recorder && this.recorder.state === 'recording') {
        this.recorder.stop()
      }
    },
    submitImageDescription () {
      console.log('提交的描述:', this.imageDescription)
      console.log('录制的音频 URL:', this.recordedAudioUrl)
      this.nextGame()
    },
    handleAudioError () {
      console.error('音频加载失败:', this.audioSrc)
    },
    nextGame () {
      this.currentGameIndex++
      if (this.currentGameIndex < this.gameTypes.length) {
        this.resetGameData()
        this.setGameData()
      } else {
        this.$router.push('/memorygame')
      }
    },
    resetGameData () {
      this.imageDescription = ''
      this.balloons = []
      this.currentBalloon = null
      this.poppedCount = 0
      this.recordedChunks = []
      this.recordedAudioUrl = null
      this.balloonIndex = 0
      this.waitForNextBalloon = false
      this.showCompletionButton = false
    }
  }
}
</script>

<style scoped>
.game-page {
  text-align: center;
  padding: 20px;
  position: relative;
}
button {
  margin: 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
input[type="text"] {
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.balloon {
  position: absolute;
  bottom: 0;
  animation: floatUp 3s ease-in-out;
  transition: opacity 0.5s ease;
  cursor: pointer;
}
.balloon.idle {
  animation: none;
}
@keyframes floatUp {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(0, -150vh);
  }
}
.popped {
  visibility: hidden;
}
.image-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 10px;
}
.description-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
//
