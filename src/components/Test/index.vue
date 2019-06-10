<template>
    <div>
        {{ test }}
    </div>
</template>
<script>
export default {
    data(){
        return {
            test: 'old',
        }
    },
    async asyncData({ store, route }) {
        await new Promise(async (resolve) => {
            await setTimeout(() => {
                console.log('async Data 调用')
                resolve()
            }, 2000)
        })
        return {
            test: 'async 测试'
        }
    },
    mounted(){
        this.handleTest()
    },
    methods: {
        handleTest() {
            console.log('--------test mounted')
        }
    }
}
</script>
<style lang="scss" scoped>
</style>

