<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>

      <el-form-item prop="userAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.userAccount"
          placeholder="用户账号"
          name="useraccount"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="userPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.userPassword"
          :type="passwordType"
          placeholder="账号密码"
          name="userpassword"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />

        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!-- <register-form></register-form> -->
      <!-- 注册Form -->
      <el-button type="text" @click="redirectToRegister">注册</el-button>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin()"
        >登录</el-button
      >
       <div>登录账号：qqqq    登录密码：11111111</div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("账号过短"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error("账号密码过短"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        userAccount: "",
        userPassword: "",
      },

      loginRules: {
        userAccount: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        userPassword: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },

      redirect: undefined,
      loading: false,
      passwordType: "password",
      formLabelWidth: "120px",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    redirectToRegister() {
      this.$router.push("/register");
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
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
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-size: cover;
  background: url(../../images/juskteez-vu.jpg) no-repeat center center;
  // background-color: #c0c4cc;
  overflow: hidden;

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #e78622;
    border-radius: 5px;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .el-button--text {
    color: #000;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;
}
}
</style>
