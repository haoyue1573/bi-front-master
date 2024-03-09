<template>
  <div>
    <el-dialog
      title="注册信息"
      :visible.sync="dialogFormVisible"
      :modal="true"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerForm"
        label-width="100px"
      >
        <el-form-item label="账号名称" prop="userAccount">
          <el-input
            ref="username"
            type="text"
            v-model="registerForm.userAccount"
            auto-complete="on"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号密码" prop="userPassword">
          <el-input
            ref="password"
            type="password"
            v-model="registerForm.userPassword"
            autocomplete="off"
          ></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            ref="checkpassword"
            type="password"
            v-model="registerForm.checkPassword"
            autocomplete="off"
          ></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister()">注册</el-button>
          <el-button @click="cancelRegister">取消注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { register } from "@/api/user";
export default {
  name: "Register",
  data() {
    var checkuserAccount = (rule, value, callback) => {
      if (value.length < 4) {
        return callback(new Error("账号长度不能小于4"));
      } else {
        callback();
      }
    };
    var validateuserPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 8) {
        callback(new Error("密码长度小于8，请再次输入"));
      } else {
        setTimeout(() => {
          if (this.registerForm.checkPassword !== "") {
            this.$refs.registerForm.validateField("password"); //注意！！！这个password要和input输入框的ref一样
          }
          callback();
        }, 1000);
      }
    };
    var validatecheckPassword2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.userPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        userAccount: "",
        userPassword: "",
        checkPassword: "",
      },
      rules: {
        userAccount: [{ validator: checkuserAccount, trigger: "blur" }],
        userPassword: [{ validator: validateuserPassword, trigger: "blur" }],
        checkPassword: [{ validator: validatecheckPassword2, trigger: "blur" }],
      },
      loading: false,
      passwordType: "password",
      dialogFormVisible: true,
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
    handleClose() {
      this.$router.push("/login");
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
    handleRegister() {
      this.loading = true;
      const self = this;
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            console.log("到了注册request方法前");
            register(this.registerForm)
              .then((response) => {
                console.log("注册响应的用户ID值：" + response.data);
                self.loading = false;
                resolve();
              })
              .catch((error) => {
                console.log("注册出了问题" + error);
                reject(error);
              });
          }).then(() => {
            self.loading = false;
            self.$router.push({ path: "/login" });
          });
        } else {
          this.$message.error("请输入符合要求的注册信息");
          return false;
        }
      });
    },
    cancelRegister() {
      this.$message("你已经取消注册");
      this.$router.push({ path: "/login" });
    },
    
  },
};
</script>

<style lang="scss" scoped>
</style>
