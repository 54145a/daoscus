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
    async getComments(offset) {
        const result = await fetch(`https://code-api-pc.dao3.fun/comment/list?contentId=100105222&limit=20&offset=${offset}`);
        const data = await result.json();
        return data.rows;
    }
    /**
     * @param {number} offset
     */
    async getDisplayComments(offset){
        const data = await this.getComments(offset);
        const content = data.rows.map((v) => ({
            isTop: v.isTop,
            comment: v.comment,
            nickname: v.nickname,
            createdAt: v.createdAt
        }));
        return content;
    }
}

globalThis.Daoscus = Daoscus;