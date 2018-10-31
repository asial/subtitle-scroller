<template>
    <div id="subtitleContainer" v-bind:style="containerStyle" class="pt-4">

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


        <div id="controlPanelOpenButton" v-show="!showControlPanel">
            <v-btn fab dark @click.native="showControlPanel = true">
                <v-icon dark>fas fa-cog</v-icon>
            </v-btn>
        </div>

        <div id="controlPanel" v-show="showControlPanel">
            <div class="controlPanelHeader">
                <v-icon large @click="showControlPanel = false">far fa-window-close</v-icon>
            </div>

            <v-tabs
                centered
                dark
                icons-and-text
            >
                <v-tabs-slider color="yellow"></v-tabs-slider>

                <v-tab href="#appearance">
                    外観
                    <v-icon>fas fa-font</v-icon>
                </v-tab>

                <v-tab href="#speed">
                    速度
                    <v-icon>fas fa-tachometer-alt</v-icon>
                </v-tab>

                <v-tab href="#others">
                    その他
                    <v-icon>fas fa-ellipsis-h</v-icon>
                </v-tab>

                <v-tab-item id="appearance">
                    <v-container fluid grid-list-lg>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-slider
                                    v-model="fontSize"
                                    always-dirty
                                    thumb-label="always"
                                    min="5"
                                    max="200"
                                    step="5"
                                    hide-details
                                    label="文字サイズ(px)"
                                    @input="saveSetting"
                                ></v-slider>
                            </v-flex>

                            <v-flex xs12>
                                <v-slider
                                    v-model="height"
                                    always-dirty
                                    thumb-label="always"
                                    min="5"
                                    max="500"
                                    step="5"
                                    hide-details
                                    label="字幕高さ(px)"
                                    @input="saveSetting"
                                ></v-slider>
                            </v-flex>

                            <v-flex d-flex xs12>
                                <div>
                                    背景色：
                                    <v-btn @click.native="showPicker.bodyBg = !showPicker.bodyBg">
                                        <v-icon class="mr-2" :color="pickedColor.bodyBg.hex">fas fa-square</v-icon>
                                        画面
                                    </v-btn>
                                    <v-btn @click.native="showPicker.subtitleBg = !showPicker.subtitleBg">
                                        <v-icon class="mr-2" :color="pickedColor.subtitleBg.hex">fas fa-square</v-icon>
                                        字幕
                                    </v-btn>
                                </div>

                                <div>
                                    字幕色：
                                    <v-btn @click.native="showPicker.subtitleText = !showPicker.subtitleText">
                                        <v-icon class="mr-2" :color="pickedColor.subtitleText.hex">fas fa-square</v-icon>
                                        文字
                                    </v-btn>
                                    <v-btn @click.native="showPicker.subtitleTextBorder = !showPicker.subtitleTextBorder">
                                        <v-icon class="mr-2" :color="pickedColor.subtitleTextBorder.hex">fas fa-square</v-icon>
                                        縁取り
                                    </v-btn>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-tab-item>

                <v-tab-item id="speed">
                    <v-container fluid grid-list-lg>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-slider
                                    v-model="speed.interval"
                                    always-dirty
                                    thumb-label="always"
                                    min="1"
                                    max="20"
                                    step="1"
                                    hide-details
                                    label="描画間隔(ms)"
                                    ticks="always"
                                    tick-size="2"
                                    @input="saveSetting"
                                ></v-slider>
                            </v-flex>

                            <v-flex xs12>
                                <v-slider
                                    v-model="speed.base"
                                    always-dirty
                                    thumb-label="always"
                                    min="0.5"
                                    max="8"
                                    step="0.1"
                                    hide-details
                                    label="移動距離(px)"
                                    @input="saveSetting"
                                ></v-slider>
                            </v-flex>

                            <v-flex xs12>
                                <v-slider
                                    v-model="speed.increase"
                                    always-dirty
                                    thumb-label="always"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    label="待ち速度調整(px)"
                                    ticks="always"
                                    tick-size="2"
                                    hint="表示待ちの字幕1つにつき、この距離を移動距離に加算して一時的に流れを早くします。字幕ループ時は無効。"
                                    persistent-hint
                                    @input="saveSetting"
                                ></v-slider>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-tab-item>

                <v-tab-item id="others">
                    <v-container fluid grid-list-lg>
                        <v-layout row wrap>
                            <v-flex xs12 d-flex>
                                <v-switch
                                    label="字幕をループさせる"
                                    v-model="isLoop"
                                    hide-details
                                    class="mt-1"
                                ></v-switch>

                                <p class="title text-sm-right mb-0 mt-2">現在の字幕速度:  {{subtitleSpeed}}</p>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-tab-item>
            </v-tabs>
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

            showControlPanel: false,

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
        }
    }
</script>

<style scoped>
    * {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    #subtitleContainer {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    #controlPanel {
        position: relative;
        background-color: #333333;
        width: 800px;
        z-index: 5;
    }

    #controlPanel .controlPanelHeader {
        position: absolute;
        right: 0;
        top: 0;
        z-index:6;
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
        position: absolute;
        left: 0;
        top: 0;
        margin: 40px;
        display: flex;
    }

    .colorPickerWrapper > div {
        position: relative;
        padding: 4px 10px;
        margin: 4px;
        background-color: #666;
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