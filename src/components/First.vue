<template>
  <!-- 网站标识和网址 -->
  <div class="logo-and-url">
      <img src="logo.png" alt="江苏师范大学" class="logo">
      <h2>智言赋能</h2>
  </div>
  <!-- 测评信息 -->
  <!-- 信息登记表单 -->
  <form class="registration-form">
      <h2>待测评人信息登记</h2>
      <!-- 更多表单字段，如病历号、姓名等，类似编写 -->
      <div class="form-group">
          <label for="name">测评人姓名</label>
          <input type="text" id="name" placeholder="请输入测评人姓名">
      </div>
      <div class="form-group">
          <label for="gender">性别</label>
          <div>
              <input type="radio" id="male" value="male" v-model="gender">
              <label for="male">男</label>
              <input type="radio" id="female" value="female" v-model="gender">
              <label for="female">女</label>
              <input type="radio" id="unknown" value="unknown" v-model="gender">
              <label for="unknown">未知</label>
          </div>
      </div>
      <div class="form-group">
          <label for="number">手机号</label>
          <input type="text" id="number" placeholder="请输入手机号">
      </div>
      <!-- 手机号、出生日期等字段类似编写 -->
      <button type="submit" class="btn-start" @click.prevent="startAssessment">开始测评</button>
  </form>
</template>

<style>
.app-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.network-status {
  display: flex;
}

.logo-and-url {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;  /* 将上下外边距设为 0 */
}

.logo {
  height: 100px;
  margin-right: 50px;
}

.logo-and-url h2 {
  font-size: 40px;
  line-height: 100px;
  margin: 0;
}

.info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.registration-form {
  background-color: white; /* 将背景颜色改为白色 */
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  margin: 0 auto;  /* 水平居中表单，并移除上下外边距 */
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 25px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
}

.btn-info {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
}

.btn-start {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
}
</style>

<script>
export default {
  name: 'FirstComponent',
  data () {
    return {
      gender: 'unknown'
      // 其他表单字段对应的数据属性
    }
  },
  methods: {
    // 例如提取信息方法
    extractInfo () {
      // 这里可以编写调用后端接口或处理数据的逻辑
      console.log('执行提取信息操作')
    },
    // 开始测评方法
    startAssessment () {
      // 验证表单数据等逻辑
      console.log('开始测评操作')
      this.$router.push('/start')// 跳转到 start 页面
    }
  }
}
</script>
//
