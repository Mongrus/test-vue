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
            </div>
        </Transition>
    </div>
</template>

<style lang="sass" scoped>

.sticker
    position: absolute
    margin: 10px
    cursor: grab
    overflow: hidden
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
    justify-content: center
    align-items: center
    text-align: center
    background-color: gray
    width: 100%
    height: 100%

.v-enter-active
.v-leave-active 
  transition: opacity 0.5s ease


.v-enter-from,
.v-leave-to 
  opacity: 0


</style>