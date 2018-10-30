<template>
    <div id="home">
        <ul>
            <li>
                <a href="/subtitle">字幕表示</a>
            </li>
            <li>
                <a href="/form">フォーム</a>
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