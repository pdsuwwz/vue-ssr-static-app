<template>
    <div>
        <div :class="$style['hello']">
            <div :class="$style['logo']"></div>
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
<style lang="scss" module>
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
            background-image: url('./assets/logo.png');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
        }
    }
</style>

