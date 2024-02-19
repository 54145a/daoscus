class Daoscus {
    /**
     * @param {string} mapId
     */
    constructor(mapId) {
        this.mapId = mapId;
    }
    /**
     * @param {number} offset
     */
    async getCommentRows(offset) {
        const result = await fetch(`https://dao3.api.pgaot.com/comment/list?contentId=${this.mapId}&limit=20&offset=${offset}`);
        const json = await result.json();
        return json.data.rows;
    }
    /**
     * @param {number} offset
     */
    async getDisplayCommentRows(offset){
        const rows = await this.getCommentRows(offset);
        const content = rows.map((v) => ({
            isTop: v.isTop,
            comment: v.comment,
            nickname: v.nickname,
            createdAt: v.createdAt
        }));
        return content;
    }
}

globalThis.Daoscus = Daoscus;