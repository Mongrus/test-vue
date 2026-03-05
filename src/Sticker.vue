<script setup>
import { watch } from 'vue';
import { useMainStore} from './store/main.store';

const store = useMainStore();

const { stickerInfo, styleObj} = defineProps({
    styleObj: Object,
    stickerInfo: Object,
})

watch(
    () => stickerInfo.text,
    () => store.persist()
)


</script>

<template>
    <div class="sticker" :style="[styleObj, {color: store.settings?.fontColor}]">
        <div class="actionSticker">
            <button @click="store.setFoldedSticker(stickerInfo.id)">-</button>
            <button @click="store.destroySticker(stickerInfo.id)">X</button>
        </div>
        <h2>Стикер</h2>
        <p>№{{ stickerInfo.id }}</p>
        <textarea :style="[{fontSize: store.settings?.font + 'px'}, {backgroundColor: store.settings?.color}, {color: store.settings?.fontColor}]"
        v-model="stickerInfo.text">
        </textarea>
    </div>
</template>

<style lang="sass" scoped>

.sticker
    position: absolute
    border: 2px solid white
    color: black
    background-color: white
    margin: 10px
    cursor: grab
    overflow: hidden
    textarea
        width: 100%
        height: 100%
        resize: none
        border: none
        outline: none
        background: transparent

.actionSticker
    display: flex
    flex-direction: row
    justify-content: flex-end
    text-align: center
    height: 20px
    background-color: blue
    button
        width: 20px
        height: 20px
        color: white
        display: flex
        align-items: center
        justify-content: center
        &:first-child
            background-color: gray
        &:last-child
            background-color: red

</style>