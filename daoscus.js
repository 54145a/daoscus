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
        const result = await fetch(`https://code-api-pc.dao3.fun/comment/list?contentId=100105222&limit=20&offset=${offset}`);
        const json = await result.json();
        return json.data.rows;
    }
    /**
     * @param {number} offset
     */
    async getDisplayCommentsRows(offset){
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