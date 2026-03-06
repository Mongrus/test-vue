<script setup>
import { ref, watch } from 'vue';
import { useMainStore} from './store/main.store';

const settingsSticker = ref(false);
const store = useMainStore();

const { stickerInfo, styleObj} = defineProps({
    styleObj: Object,
    stickerInfo: Object,
})

watch(
    () => stickerInfo.text,
    () => store.persist()
)

function useSettingsSticker() {
    settingsSticker.value = !settingsSticker.value;
}

function resizeSticker(e, id, corner) {

    const sticker = store.getStickers.find(s => s.id === id)

    let prevX = e.clientX
    let prevY = e.clientY

    const resize = (ev) => {

        const deltaX = ev.clientX - prevX
        const deltaY = ev.clientY - prevY

        store.setSizeSticker(id, deltaX, deltaY, corner)

        prevX = ev.clientX
        prevY = ev.clientY
    }

    const stop = () => {
    window.removeEventListener('mousemove', resize)
    window.removeEventListener('mouseup', stop)
  }

  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stop)
}

</script>

<template>
    <div class="sticker" :style="[styleObj, {color: store.settings?.fontColor}]">
        <div class="actionSticker">
            <button @click="useSettingsSticker()">⚙︎</button>
            <button @click="store.setFoldedSticker(stickerInfo.id)">-</button>
            <button @click="store.destroySticker(stickerInfo.id)">X</button>
        </div>
        <Transition mode="out-in">
            <textarea v-if="!settingsSticker" :style="[{fontSize: store.settings?.font + 'px'}, {backgroundColor: store.settings?.color}, {color: store.settings?.fontColor}]"
            v-model="stickerInfo.text">
            </textarea>
            <div class="settings-sticker" v-else>
                <h3 style="color: white">Тут будут настройки для конкретно этого стикера =)</h3>
                <p>Ширина: {{ stickerInfo.w }}</p>
                <p>Высота: {{ stickerInfo.w }}</p>
            </div>
        </Transition>
        <div class="resize resize__resize-lt" @mousedown.stop="resizeSticker($event, stickerInfo.id, 'lt')"></div>
        <div class="resize resize__resize-lb" @mousedown.stop="resizeSticker($event, stickerInfo.id, 'lb')"></div>
        <div class="resize resize__resize-rb" @mousedown.stop="resizeSticker($event, stickerInfo.id, 'rb')"></div>
    </div>
</template>

<style lang="sass" scoped>

.sticker
    position: absolute
    margin: 10px
    cursor: grab
    display: flex
    flex-direction: column
    textarea
        flex: 1
        padding: 5px
        width: 100%
        resize: none
        border: 2px outset gray
        outline: none
        background: transparent

.actionSticker
    display: flex
    flex-direction: row
    justify-content: flex-end
    text-align: center
    height: 20px
    button
        width: 20px
        height: 20px
        color: white
        display: flex
        align-items: center
        justify-content: center
        background-color: gray
        &:last-child
            background-color: red

.settings-sticker
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    background-color: gray
    width: 100%
    height: 100%

.resize
    position: absolute
    width: 7px
    height: 7px
    border: 1px solid black
    background-color: white
    opacity: 0
    &:hover
        opacity: 1
        cursor: pointer
    &__resize-lt
        left: -2px
        top: 18px
    &__resize-rb
        right: -2px
        bottom: -2px
    &__resize-lb
        left: -2px
        bottom: -2px

.v-enter-active
.v-leave-active 
  transition: opacity 0.5s ease


.v-enter-from,
.v-leave-to 
  opacity: 0


</style>