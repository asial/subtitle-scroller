<template>
    <div id="subtitleContainer" v-bind:style="containerStyle">

        <div class="colorPickerWrapper">
            <div v-show="showPicker.bodyBg">
                <div class="closePicker">
                    <button style="vertical-align: top" @click="showPicker.bodyBg = false">✕</button>
                </div>
                <p>背景色：画面</p>
                <color-picker v-model="pickedColor.bodyBg" @input="saveSetting"></color-picker>
            </div>

            <div v-show="showPicker.subtitleBg">
                <div class="closePicker">
                    <button style="vertical-align: top" @click="showPicker.subtitleBg = false">✕</button>
                </div>
                <p>背景色：字幕</p>
                <color-picker v-model="pickedColor.subtitleBg" @input="saveSetting"></color-picker>
            </div>

            <div v-show="showPicker.subtitleText">
                <div class="closePicker">
                    <button style="vertical-align: top" @click="showPicker.subtitleText = false">✕</button>
                </div>
                <p>字幕色：文字</p>
                <color-picker v-model="pickedColor.subtitleText" @input="saveSetting"></color-picker>
            </div>

            <div v-show="showPicker.subtitleTextBorder">
                <div class="closePicker">
                    <button style="vertical-align: top" @click="showPicker.subtitleTextBorder = false">✕</button>
                </div>
                <p>字幕色：縁取り</p>
                <color-picker v-model="pickedColor.subtitleTextBorder" @input="saveSetting"></color-picker>
            </div>
        </div>

        <div id="controlPanel" v-show="showControlPanel">
            <div class="controlPanelHeader">
                <button style="vertical-align: top" @click="showControlPanel = false">✕</button>
            </div>
            <ul>
                <li>
                    <div>
                        文字サイズ：<input type="number" v-model.number="fontSize" step="5" @change="saveSetting">px
                    </div>
                    <div>
                        字幕高さ：<input type="number" v-model.number="height" step="5" @change="saveSetting">px
                    </div>
                </li>
                <li>
                    <div>
                        背景色：<button @click="showPicker.bodyBg = !showPicker.bodyBg">画面</button>
                        <button @click="showPicker.subtitleBg = !showPicker.subtitleBg">字幕</button>
                    </div>
                    <div>
                        字幕色：<button @click="showPicker.subtitleText = !showPicker.subtitleText">文字</button>
                        <button @click="showPicker.subtitleTextBorder = !showPicker.subtitleTextBorder">縁取り</button>
                    </div>
                </li>
                <li>
                    <div>
                        字幕を
                        <input type="number" v-model.number="speed.interval" step="1" min="1" @change="saveSetting">msごとに
                        <input type="number" v-model.number="speed.base" step="0.1" min="1" @change="saveSetting">px移動
                    </div>
                </li>
                <li>
                    <div>
                        (ループ時以外)待機字幕1つ毎に<input type="number" v-model.number="speed.increase" step="0.1" min="" @change="saveSetting">px増加
                    </div>
                </li>
                <li>
                    <div>
                        <input id="isLoopCheckbox" type="checkbox" v-model="isLoop"><label for="isLoopCheckbox">字幕をループさせる：</label>
                    </div>
                    <div>
                        <span style="margin-left: 120px;">現在の字幕速度:  {{subtitleSpeed}}</span>
                    </div>
                </li>
            </ul>
        </div>

        <div id="subtitleWrapper" v-bind:style="subtitleWrapperStyle">
            <ul v-bind:style="ulStyle">
                <li v-for="subtitle in subtitles" :key="subtitle.id" class="subtitle">
                    <span v-bind:style="Object.assign(subtitleTextStyle, {paddingLeft: `${subtitle.padding}px`})">{{subtitle.text}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueSocketio from 'vue-socket.io'
    Vue.use(VueSocketio, 'http://localhost:3000')

    import store from 'store'
    import { Swatches } from 'vue-color'

    export default {
        name: "Subtitle",
        data: () => ({
            subtitles: [],
            counter: 1,

            showControlPanel: true,

            showPicker: {
                bodyBg: false,
                subtitleBg: false,
                subtitleText: false,
                subtitleTextBorder: false,
            },

            fontSize: 80,
            height: 180,
            speed: {
                base: 5.5,
                interval: 8,
                increase: 0.2,
            },
            isLoop: false,
            pickedColor: {
                bodyBg: {
                    hex: '#000000',
                },
                subtitleBg: {
                    hex: '#81C784',
                },
                subtitleText: {
                    hex: '#000000',
                },
                subtitleTextBorder: {
                    hex: '#ffffff',
                },
            },
        }),
        components: {
            'color-picker': Swatches
        },
        created() {
            this.initSetting()
        },
        mounted() {
            this.$nextTick(this.slideFirstText)
        },
        computed: {
            containerStyle() {
                return {
                    backgroundColor: this.pickedColor.bodyBg.hex,
                }
            },
            subtitleWrapperStyle() {
                return {
                    fontSize: `${this.fontSize}px`,
                    height: `${this.height}px`,
                    backgroundColor: this.pickedColor.subtitleBg.hex,
                }
            },
            ulStyle() {
                return {
                    lineHeight: `${this.height}px`,
                }
            },
            controlPanelStyle() {
                return {
                    bottom: `${this.height + 20}px`,
                }
            },
            subtitleTextStyle() {
                return {
                    color: this.pickedColor.subtitleText.hex,
                    textShadow: `${this.pickedColor.subtitleTextBorder.hex} 2px 2px 0,
                    ${this.pickedColor.subtitleTextBorder.hex} -2px -2px 0,
                    ${this.pickedColor.subtitleTextBorder.hex} -2px 2px 0,
                    ${this.pickedColor.subtitleTextBorder.hex} 2px -2px 0,
                    ${this.pickedColor.subtitleTextBorder.hex} 0 2px 0,
                    ${this.pickedColor.subtitleTextBorder.hex} 0 -2px 0,
                    ${this.pickedColor.subtitleTextBorder.hex} -2px 0 0,
                    ${this.pickedColor.subtitleTextBorder.hex} 2px 0 0`,
                }
            },
            subtitleSpeed() {
                if (this.isLoop) {
                    return this.speed.base
                } else {
                    if (this.subtitles.length > 0) {
                        return this.speed.base + ((this.subtitles.length - 1) * this.speed.increase)
                    } else {
                        return this.speed.base
                    }
                }
            }
        },
        sockets: {
            sendMessage(message) {
                this.addSubtitle(message)
            }
        },
        methods: {
            initSetting() {
                const defaultSettings = {
                    height: 180,
                    fontSize: 80,
                    bodyBg: '#000000',
                    subtitleBg: '#81C784',
                    subtitleText: '#000000',
                    subtitleTextBorder: '#ffffff',
                    speedBase: 5.5,
                    speedInterval: 8,
                    speedIncrease: 0.2,
                }

                const setting = Object.assign(defaultSettings, store.get('settings', {}))

                this.height = setting.height
                this.fontSize = setting.fontSize
                this.pickedColor.bodyBg.hex = setting.bodyBg
                this.pickedColor.subtitleBg.hex = setting.subtitleBg
                this.pickedColor.subtitleText.hex = setting.subtitleText
                this.pickedColor.subtitleTextBorder.hex = setting.subtitleTextBorder
                this.speed.base = setting.speedBase
                this.speed.interval = setting.speedInterval
                this.speed.increase = setting.speedIncrease
            },
            saveSetting() {
                console.log("save settings")
                store.set('settings', {
                    height: this.height,
                    fontSize: this.fontSize,
                    bodyBg: this.pickedColor.bodyBg.hex,
                    subtitleBg: this.pickedColor.subtitleBg.hex,
                    subtitleText: this.pickedColor.subtitleText.hex,
                    subtitleTextBorder: this.pickedColor.subtitleTextBorder.hex,
                    speedBase: this.speed.base,
                    speedInterval: this.speed.interval,
                    speedIncrease: this.speed.increase,
                })
            },
            addSubtitle(message, lastPadding) {
                const screenWidth = this.$el.clientWidth
                let padding

                // ループ時、前回のpadding値がある場合はそれを使い、無い場合は計算する
                if (lastPadding === undefined) {
                    if (this.subtitles.length > 0) {
                        // まだ字幕が表示されている時
                        const lastSubtitleEl = this.$el.querySelector('.subtitle:last-child')

                        // 字幕に終わりが見えている時
                        if ((lastSubtitleEl.offsetLeft + lastSubtitleEl.clientWidth) < screenWidth) {
                            padding = screenWidth - (lastSubtitleEl.offsetLeft + lastSubtitleEl.clientWidth)
                        } else {
                            padding = 0
                        }
                    } else {
                        // 字幕が空の時
                        padding = screenWidth
                    }
                } else {
                    padding = lastPadding
                }

                this.subtitles.push({
                    id: ++this.counter,
                    text: message,
                    padding: padding,
                })

            },
            getSubtitleLength() {
                // 最初の要素は現在表示中として無視する
                if (this.subtitles.length <= 2) {
                    return 0
                } else {
                    return this.subtitles
                        .map(message => message.text.length)
                        .reduce((accumulator, currentValue) => accumulator + currentValue)
                }
            },
            slideFirstText() {
                if (this.subtitles.length > 0) {
                    const subtitleEl = this.$el.querySelector('.subtitle')

                    if (subtitleEl) {
                        if (subtitleEl.style.marginLeft === '') {
                            subtitleEl.style.marginLeft = '0px'
                        }

                        if (subtitleEl.clientWidth <= Math.abs(subtitleEl.offsetLeft)) {
                            subtitleEl.style.marginLeft = '0px'
                            const message = this.subtitles.shift()
                            if (this.isLoop) {
                                setTimeout( () => {
                                    this.addSubtitle(message.text, message.padding)
                                }, 10)
                            }
                        } else {
                            const currentMarginLeft = parseInt(subtitleEl.style.marginLeft)
                            subtitleEl.style.marginLeft = `${currentMarginLeft - this.subtitleSpeed}px`
                        }
                    }
                }

                setTimeout( () => {
                    this.slideFirstText()
                }, this.speed.interval)
            },
            getRandomString() {
                return Math.random().toString(36).slice(-8)
            },
        }
    }
</script>

<style scoped>
    * {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    button {
        cursor: pointer;
        background-color: rgba(144, 144, 255, 1)
    }

    #subtitleContainer {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    #controlPanel {
        background-color: rgba(255, 255, 255, .5);
        text-align: right;
        position: absolute;
        width: 800px;
        right: 30%;
        top: 20%;
        z-index: 5;
    }

    #controlPanel ul {
        margin: 0;
        padding: 30px;
        list-style-type: none;
    }

    #controlPanel ul li {
        margin: 20px 0;
        padding: 0;
        display: flex;
        justify-content: space-around;
    }
    #controlPanel ul li:first-child {
        margin: 0 0 20px;
    }
    #controlPanel ul li:last-child {
        margin: 20px 0 0;
    }


    #controlPanel * {
        font-size: 30px;
    }

    #controlPanel input[type=number] {
        width: 80px;
        padding: 5px;
    }
    #controlPanel input[type=checkbox] {
        display: none;
    }

    #controlPanel label {
        position: relative;
    }

    #controlPanel label:before {
        content: '';
        width: 48px;
        height: 48px;
        display: inline-block;
        position: absolute;
        right: -48px;
        top: -9px;
        background-color:   #fff;
        box-shadow:     inset 1px 2px 3px 0 #000;
        border-radius:      6px 6px 6px 6px;
        line-height: 55px;
    }
    #controlPanel input[type=checkbox]:checked + label:before {
        content: '\2713';
        font-size: 46px;
        color: #ffffff;
        background-color: rgba(144, 144, 255, 1);
    }

    #controlPanel .controlPanelHeader {
        position: absolute;
        right: 0;
        top: 0;
    }
    #controlPanel .controlPanelHeader button {
        font-size: 30px !important;
    }




    #subtitleWrapper {
        position: absolute;
        width: 999999px;
        overflow: hidden;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .2);
    }

    #subtitleWrapper ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
    }

    .colorPickerWrapper {
        margin: 40px;
        display: flex;
    }

    .colorPickerWrapper > div {
        position: relative;
        padding: 4px 10px;
        margin: 4px;
        background-color: #ccc;
        z-index: 10;
    }

    .colorPickerWrapper > div p {
        text-align: center;
        font-size: 120%;
        margin: 0;
        padding: 4px 0;
    }

    .colorPickerWrapper .closePicker {
        position: absolute;
        right: 0;
        top: 0;
    }
    .colorPickerWrapper .closePicker button {
        margin: 6px;
        font-size: 20px;
    }

</style>