<script>
// JSX 与 template 不可并存
export default {
    data(){
        return {
            test: 'old',
            list: [
                {
                    text: 'vue',
                    create: 'Evan You'
                },
                {
                    text: 'react',
                    create: 'facebook'
                },
            ]
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
    render(h) {
        return (
            <div>
                <h3> { this.test } </h3>
                来自 JSX 的渲染： {
                    this.list.map((item) => {
                        return (
                            <div>
                                { item.text } - { item.create }
                            </div>
                        )
                    })
                }
            </div>
        )
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

