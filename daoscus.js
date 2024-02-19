class Daoscus {
    /**
     * @param {string} mapId
     */
    constructor(mapId) {
        this.mapId = mapId;
    }
    async getCommentRows() {
        const result = await fetch(`https://dao3.api.pgaot.com/comment/list?contentId=${this.mapId}&limit=100&offset=0`);
        const json = await result.json();
        return json.data.rows;
    }
    async getDisplayCommentRows(){
        const rows = await this.getCommentRows();
        const content = rows.map((v) => ({
            comment: v.comment,
            nickname: v.nickname,
            createdAt: v.createdAt
        }));
        return content;
    }
    /**
     * @param {object} comment 
     * @param {HTMLDivElement} container 
     */
    initComment(comment,container){
        const p = document.createElement("div");
        p.classList.add("daoscus-comment");
        const time = new Date(comment.createdAt);
        p.innerText = `${comment.nickname} ${time.toLocaleString("zh-CN",{timeZone:"Asia/Shanghai"})}\n${comment.comment}`;
        container.appendChild(p);
    }
    /**
     * @param {HTMLDivElement} container 
     */
    async init(container){
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        const rows = await this.getDisplayCommentRows();
        for(const comment of rows){
            this.initComment(comment,container);
        }
    }
}

export {Daoscus};