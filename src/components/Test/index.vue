<template>
    <div>
        测试页面
    </div>
</template>
<script>
export default {
    async asyncData({ store, route }) {
        await new Promise(async (resolve) => {
            await setTimeout(() => {
                console.log('async Data 调用', store, route)
                resolve()
            }, 2000)
        })
    },
}
</script>
<style lang="scss" scoped>
</style>

