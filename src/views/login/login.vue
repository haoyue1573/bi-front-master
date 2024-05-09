<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">BI智能与你同行</h3>
      <el-form-item prop="userAccount">
        <el-input
          v-model="loginForm.userAccount"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="userPassword">
        <el-input
          v-model="loginForm.userPassword"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'"><span style="color: #20a0ff; font-family: 'MT Extra',serif">立即注册</span></router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <a href="https://beian.miit.gov.cn/">豫ICP备2024052256号-1</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        userAccount: "",
        userPassword: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          console.log("进入到派发任务前");
          this.$store
            .dispatch("user/login", this.loginForm) //store/modules/user.js中的login方法，提交的表单数据
            .then(() => {
              this.$router.push({ path: this.$route.query.redirect || "/" });
              this.loading = false;
            })
            .catch((e) => {
              console.log("派发任务异常" + e);
              this.loading = false;
            });
        } else {
          this.$message.error("请输入符合要求的登录信息");
          return false;
        }
      });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url(../../images/login-background.jpg) no-repeat center center;
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
