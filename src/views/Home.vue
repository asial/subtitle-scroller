<template>
    <div id="home">
        <ul>
            <li>
                <router-link :to="{name: 'subtitle'}">字幕表示</router-link>
            </li>
            <li>
                <router-link :to="{name: 'form'}">フォーム</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import MessageForm from '@/components/MessageForm'

    export default {
        name: 'home',
        components: {
            MessageForm
        }
    }
</script>

<style scoped>

</style>