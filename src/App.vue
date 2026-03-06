<script setup>
import { ref } from 'vue';
import Sticker from './Sticker.vue';
import { useMainStore } from './store/main.store';

const settingsPanel = ref(false);

const store = useMainStore();
let offsetX = 0
let offsetY = 0

function moveSticker(e, id) {

  const sticker = store.getStickers.find(s => s.id === id)

  offsetX = e.clientX - sticker.x
  offsetY = e.clientY - sticker.y

  const move = (ev) => {
    store.setPositionSticker(
      id,
      ev.clientX - offsetX,
      ev.clientY - offsetY
    )
  }

  const stop = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', stop)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stop)
}

function useSettingsPanel() {
    settingsPanel.value = !settingsPanel.value;
}

</script>

<template>
    <div class="main">

        <div class="board">
            <nav>
                <button @click="store.createSticker(
                    '', // текст
                    false, // свернут ?
                    store.getStickers.length == 0 ? 50 : (store.getStickers.length * 10) + 50, // по X
                    store.getStickers.length == 0 ? 50 : (store.getStickers.length * 10) + 50, // по Y
                    Math.max(...store.stickers.map(s => s.z), 0), // z-index
                    store.settings.width, // Ширина
                    store.settings.height // Высота
                )">Добавить +</button>
                <button @click="store.clearBoard">
                    Очистить доску
                </button>
                <button @click="useSettingsPanel()">
                    Настройки
                </button>
            </nav>
            <Transition name="collapsed" v-show="store.getStickers.length">
                <div class="collapsedPanel">
                    <div class="collapsedPanel__sticker" v-for="sticker in store.getStickers.filter(s => s.folded)"
                        :key="sticker.id"
                        :style="{backgroundColor: store.settings.color}"
                        >
                        <button @click="store.setFoldedSticker(sticker.id)">+</button>
                        <p>{{ sticker.text }}</p>
                    </div>
                </div>
            </Transition>
            <Sticker v-for="sticker in store.getStickers.filter(s => !s.folded)"
            :key="sticker.id"
            :styleObj="{ left: sticker.x + 'px',
            top: sticker.y + 'px',
            width: sticker.w + 'px',
            height: sticker.h + 'px',
            zIndex: sticker.z }"
            @mousedown="(e) => moveSticker(e, sticker.id)"
            :stickerInfo="sticker"
            />
            <Transition name="setting" v-show="settingsPanel">
                <div class="settingsPanel">
                    <h2>Настройки</h2>
                    <div>
                        <label for="font-size">Размер шрифта</label>
                        <input name="font-size" type="number" v-model="store.settings.font">
                    </div>
                    <div>
                        <label for="sticker-color">Цвет стикера</label>
                        <select name="sticker-color" v-model="store.settings.color">
                            <option value="#FFF9C4">Мягкий желтый</option>
                            <option value="#E8F5E9">Нежный зеленый</option>
                            <option value="#E3F2FD">Светлый голубой</option>
                            <option value="#F3E5F5">Мягкий фиолетовый</option>
                            <option value="#FCE4EC">Нежный розовый</option>
                            <option value="#FFF3E0">Светлый оранжевый</option>
                        </select>
                    </div>
                    <div>
                        <label for="font-color">Цвет шрифта</label>
                        <select name="sticker-color" v-model="store.settings.fontColor">
                            <option value="#000000">Черный</option>
                            <option value="#2C3E50">Темно-синий</option>
                            <option value="#2F4F4F">Темный серо-зеленый</option>
                            <option value="#4A235A">Темный фиолетовый</option>
                            <option value="#5D4037">Темный коричневый</option>
                            <option value="#37474F">Графитовый</option>
                        </select>
                    </div>
                    <div>
                        <label for="width">Ширина</label>
                        <input name="width" type="number" v-model="store.settings.width">
                    </div>
                    <div>
                        <label for="height">Высота</label>
                        <input name="height" type="number" v-model="store.settings.height">
                    </div>
                    <button @click="store.persist()">Сохранить</button>
                    <button @click="store.settingsDefault()">Сбросить</button>
                    <h3 style="color: red">Эти настройки будут только для новых - создаваемых стикеров</h3>
                </div>
            </Transition>
        </div>


    </div>
</template>

<style lang="sass" scoped>

nav
    position: relative
    display: flex
    flex-direction: row
    justify-content: space-evenly
    align-items: center
    background: rgba(54, 149, 121, 0.12)
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1)
    backdrop-filter: blur(4px)
    -webkit-backdrop-filter: blur(4px)
    border: 1px solid rgba(54, 149, 121, 0.3)
    z-index: 9000
    button
        padding: 3px 6px
        color: white
        background-color: crimson
        &:last-child
            background-color: gray
        &:first-child
            background-color: green

.main
    display: flex

.board
    position: relative
    width: 100vw
    height: 100vh
    background-color: #1f3d36
    overflow: hidden
    z-index: 1000

.collapsedPanel
    position: absolute
    left: 0
    top: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: flex-start
    padding: 20px 0
    width: 5.5vw
    height: 100%
    background: rgba(54, 149, 121, 0.12)
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1)
    backdrop-filter: blur(4px)
    -webkit-backdrop-filter: blur(4px)
    border: 1px solid rgba(54, 149, 121, 0.3)
    z-index: 9000
    &__sticker
        border: 1px solid black
        display: flex
        flex-direction: column
        justify-content: flex-start
        align-items: center
        overflow: hidden
        padding: 1px
        width: 40px
        height: 40px
        margin: 4px
        transition: .2s
        button
            width: 20px
            height: 20px
        p
            font-size: 6px
        &:hover
            width: 45px
            height: 45px
            transform: translateY(-3px)
            transition: .2s

.settingsPanel
    position: absolute
    right: 0
    top: 0
    width: 18vw
    height: 100%
    background: rgba(54, 149, 121, 0.12)
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1)
    backdrop-filter: blur(4px)
    -webkit-backdrop-filter: blur(4px)
    border: 1px solid rgba(54, 149, 121, 0.3)
    z-index: 9000
    color: white
    input
        width: 50px
    select
        width: 100%

// Для правой панели
.setting-enter-active,
.setting-leave-active
  transition: transform 0.5s ease, opacity 0.5s ease

.setting-enter-from
  transform: translateX(100%)
  opacity: 0

.setting-leave-to
  transform: translateX(100%)
  opacity: 0

// Для левой панели
.collapsed-enter-active,
.collapsed-leave-active
  transition: transform 0.5s ease, opacity 0.5s ease

.collapsed-enter-from
  transform: translateX(-100%)
  opacity: 0

.collapsed-leave-to
  transform: translateX(-100%)
  opacity: 0


</style>
