// stores/paperStore.js
import { defineStore } from 'pinia'

export const usePaperStore = defineStore('paper', {
    state: () => ({
        // 存储论文数据，key 是 paper_id
        paperData: {}
    }),

    actions: {
        // 存储论文数据
        savePaper(result) {
            if (result && result.paper_id) {
                this.paperData[result.paper_id] = result
                console.log('论文数据已保存:', result.paper_id)
            }
        },

        // 读取论文数据
        getPaper(paperId) {
            return this.paperData[paperId] || null
        },

        // 清空所有数据（可选）
        clearAll() {
            this.paperData = {}
        }
    }
})