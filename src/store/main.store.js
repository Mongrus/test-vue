import { defineStore } from "pinia";

const DEFAULT_SETTINGS = {
    font: 14,
    color: '#FFF9C4',
    fontColor: '#000000',
    width: 300,
    height: 180
}

export const useMainStore = defineStore('stickers', {
    state: () => ({
        stickers: (() => {
            try{
                return JSON.parse(localStorage.getItem('stickers') || '[]')
            } catch{
                return [];
            }
        })(),

        settings: (() => {
            try {
                const saved = JSON.parse(localStorage.getItem('settings'))
                return { ...DEFAULT_SETTINGS, ...(saved || {}) }
            } catch {
                return { ...DEFAULT_SETTINGS }
            }
        })()
    }),

    getters: {
        getStickers() {
            return this.stickers
        }
    },

    actions: {
        persist() {
            localStorage.setItem('stickers', JSON.stringify(this.stickers))
            localStorage.setItem('settings', JSON.stringify(this.settings))
        },

        createSticker(text, folded, x, y, z, w, h) {
            const id = Date.now();

            this.stickers.push({ id , text, folded, x, y, z, w, h})
            this.persist()
        },

        setPositionSticker(id, x, y) {
            const sticker = this.stickers.find(s => s.id === id)
            
            const maxZ = Math.max(...this.stickers.map(s => s.z), 0)

            sticker.x = x
            sticker.y = y
            sticker.z = maxZ + 1

            this.persist()
        },

        setSizeSticker(id, deltaX, deltaY, corner) {
        const sticker = this.stickers.find(s => s.id === id)

        if (corner === 'rb') {
            sticker.w += deltaX
            sticker.h += deltaY
        }

        if (corner === 'lb') {
            sticker.w -= deltaX
            sticker.h += deltaY
            sticker.x += deltaX
        }

        if (corner === 'lt') {
            sticker.w -= deltaX
            sticker.h -= deltaY
            sticker.x += deltaX
            sticker.y += deltaY
        }
        },

        clearBoard() {
            this.stickers = [];
            localStorage.removeItem('stickers');
        },

        destroySticker(id) {
            this.stickers = this.stickers.filter(s => s.id !== id)
            this.persist()
        },

        setFoldedSticker(id) {
            const sticker = this.stickers.find(s => s.id === id)

            sticker.folded = !sticker.folded

            this.persist()
        },

        setSettingFont(size) {
            this.settings.font = size;

            this.persist();
        },

        settingsDefault() {
            this.settings = { ...DEFAULT_SETTINGS }

            this.persist();
        }
    }
})