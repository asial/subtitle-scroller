<template>
    <div>
        <form id="messageForm" @submit.prevent="send">
            <input type="text" autofocus autocomplete="off" v-model="message">
        </form>
        <ol id="subtitles">
            <li v-for="subtitle in subtitles">
                {{subtitle}}
            </li>
        </ol>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueSocketio from 'vue-socket.io'
    Vue.use(VueSocketio, 'http://localhost:3000')

    export default {
        name: "MessageForm",
        data: () => ({
            message: '',
            subtitles: [],
        }),
        sockets: {
            sendMessage(message) {
                this.subtitles.push(message)
            }
        },
        computed: {

        },
        methods: {
            send() {
                if (this.message.trim() !== '') {
                    this.$socket.emit('sendMessage', this.message)
                    this.message = ''
                }
            }
        }
    }
</script>

<style scoped>

    #messageForm {
        position: fixed;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    #messageForm input {
        box-sizing: border-box;
        margin: 0;
        padding: 0.5em;
        width: 100%;
        font-size: 36px;
        background-color: rgba(255, 255, 200, .3);
        border: solid 2px #000;
    }


    #subtitles {
        padding: 83px 0 0;
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column-reverse;
    }

    #subtitles li {
        padding: 5px 10px;
    }

    #subtitles li:nth-child(odd) {
        background: #eee;
    }
</style>