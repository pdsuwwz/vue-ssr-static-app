<template>
    <div>
        <div class="hello">
            <div class="logo"></div>
            <p @click="testClick()">{{hello}}</p>
            <router-link to="/test">点我两秒后跳转</router-link>
        </div>
    </div>
</template>
<script>
export default {
    data: function(){
        return {
            hello: '点我问好！'
        }
    },
    mounted(){
        console.log(document)
    },
    methods: {
        testClick(){
            this.hello = this.$store.state.text
        }
    }
}
</script>
<style lang="scss" scoped>
    .hello {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        align-items: center;
        color: #41b883;
        font-size: 25px;
        font-weight: bold;
        padding-top: 20px;
        .logo {
            width: 200px;
            height: 200px;
            // 相对路径和别名路径均适用
            // background-image: url('./assets/logo.png');
            background-image: url('~_assets/home/logo.png'); // 别名路径注意要加 ~ 符号
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
        }
    }
</style>

