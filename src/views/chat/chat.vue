<template>
  <div id="app">
    <div class="chat-container">
      <div class="chat-header">
        <h5>chat with AI</h5>
      </div>
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" :class="message.sender === 'user' ? 'user-message' : 'bot-message'">
          <div v-if="message.sender === 'user'" class="message">
            <span>{{ message.content }}</span>
            <img :src=message.avatar alt="" style="width: 20px;height:20px"/>
          </div>
          <div v-else-if="message.sender === 'bot'" class="message">
            <img :src=message.avatar alt="" style="width: 20px;height:20px"/>
            <span>{{ message.content }}</span>
          </div>
        </div>
      </div>
      <div class="chat-input">
          <input type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="输入消息...">
          <button @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

/*
 使用js原生对象做演示
const ws = new WebSocket('ws://localhost:8000/websocket/')
//onopen事件监听
ws.addEventListener('open',e=>{
  console.log('与服务端连接打开->',e)
},false)
//onclose事件监听
ws.addEventListener('close',e=>{
  console.log('与服务端连接关闭->',e)
},false)
//onmessage事件监听
ws.addEventListener('message',e=>{
  console.log('来自服务端的消息->',e)
},false)
//onerror事件监听
ws.addEventListener('error',e=>{
  console.log('与服务端连接异常->',e)
},false)
*/


export default {
  data() {
    return {
      webSocketObject: null,
      identification: "ai",
      inputMessage: '',
      userQuestion:'',
      messages: [
        { sender: 'bot', content: '你好，我是你的专属聊天助手' ,avatar:'https://al-bi.oss-cn-beijing.aliyuncs.com/20230427203550_d4fc2.heif'},
        { sender: 'user', content: '我是傻叉',avatar:'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif' }
      ]
    };
  },
  created() {
    //初始化WebSocket
    this.webSocketInit()
  },
  methods: {
    sendMessage() {
      const message = this.inputMessage
      const identification = this.identification
      this.webSocketObject.send(JSON.stringify({
        id: 1,
        message,
        identification,
        time: new Date().getTime()
      }))

/*       if (this.inputMessage.trim()) {
        this.messages.push({ sender: 'user', content: this.inputMessage ,avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'});
        console.log(this.messages)
        this.userQuestion = this.inputMessage
        this.inputMessage = '';
        axios.get(`http://123.249.10.204:9903/xfModel/test?uid=8848&text=${this.userQuestion}`)
          .then(response => {
            // 处理响应数据
            this.messages.push({sender: 'bot',content: response.data.data,avatar:'https://al-bi.oss-cn-beijing.aliyuncs.com/20230427203550_d4fc2.heif'})
          })
          .catch(error => {
            // 处理错误
           console.log('ai请求失败',error)
          });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } */
    },
    scrollToBottom() {
      const chatContainer = document.querySelector('.chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    },
    webSocketInit(){
      const webSocketUrl = 'ws://localhost:8080/api/websocket/'+this.identification
      this.webSocketObject = new WebSocket(webSocketUrl);
      this.webSocketObject.onopen = this.webSocketOnOpen
      this.webSocketObject.onmessage = this.webSocketOnMessage
      this.webSocketObject.onerror = this.webSocketOnError
      this.webSocketObject.onclose = this.webSocketOnClose
    },
    webSocketOnOpen(e){
      console.log('与服务端连接打开->',e)
    },
    webSocketOnMessage(e){
      console.log('来自服务端的消息->',e)
      this.messages.push({sender: 'bot',content: e,avatar:'https://al-bi.oss-cn-beijing.aliyuncs.com/20230427203550_d4fc2.heif'})
    },
    webSocketOnError(e){
      console.log('与服务端连接异常->',e)
    },
    webSocketOnClose(e){
      console.log('与服务端连接关闭->',e)
    },
  }
};
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
.chat-container {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-image: url("../../images/artem-sapegin-1.jpg");
  padding: 20px;
  overflow-y: auto;
}
span{
  padding-right: 5px;
  padding-left: 10px;
}

.chat-header {
  font-size: 24px;
  margin-bottom: 20px;
}

.chat-messages {
  margin-bottom: 20px;
}

.user-message,
.bot-message {
  display: flex;
  margin-bottom: 10px;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.chat-input {
  padding-bottom: 0;
  display: flex;
}

input[type='text'] {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}
</style>





