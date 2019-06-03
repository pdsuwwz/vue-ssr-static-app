<template>
    <div>
        <Hello/>
        <router-link to="/test">Go to test</router-link>
    </div>
</template>
<script>
import Hello from '_c/Hello'
export default {
    data(){
        return {

        }
    },
    components: {
        Hello
    }
}
</script>
<style lang="scss">
</style>


