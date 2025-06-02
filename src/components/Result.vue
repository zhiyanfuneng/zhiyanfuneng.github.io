<template>
  <div class="result-page">
    <h1>恭喜你,游戏结束!</h1>
    <p>综合评分: {{ totalScore }}</p>
    <p>记忆能力: {{ memoryScore }}</p>
    <p>反应能力: {{ reactionScore }}</p>
    <p>协调能力: {{ coordinationScore }}</p>
    <p>语言表达: {{ languageScore }}</p>
  </div>
</template>

<script>
export default {
  // 修正组件命名，使用多单词命名
  name: 'ResultPageComponent',
  props: {
    memoryAnswers: {
      type: Array,
      default: () => []
    },
    reactionCount: {
      type: Number,
      default: 0
    },
    poppedBalloons: {
      type: Number,
      default: 0
    },
    imageDescription: {
      type: String,
      default: ''
    }
  },
  computed: {
    memoryScore () {
      return this.memoryAnswers.filter(answer => answer).length
    },
    reactionScore () {
      return this.reactionCount * 0.5
    },
    coordinationScore () {
      return this.poppedBalloons * 0.5
    },
    languageScore () {
      // 根据描述内容完善度打分
      if (this.imageDescription.length > 10) {
        return 3
      } else if (this.imageDescription.length > 5) {
        return 2
      } else {
        return 1
      }
    },
    totalScore () {
      return this.memoryScore + this.reactionScore + this.coordinationScore + this.languageScore
    }
  }
}
</script>

<style scoped>
.result-page {
  text-align: center;
  padding: 20px;
}
</style>
//
