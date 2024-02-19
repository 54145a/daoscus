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
    /**
     * @param {object} comment 
     * @param {HTMLDivElement} container 
     */
    initComment(comment,container){
        console.log(JSON.stringify(comment));
        const p = document.createElement("div");
        const a = document.createElement("a");
        a.href = `//dao3.fun/profile/${comment.userInfo.userId}`;
        a.innerText = comment.userInfo.nickname;
        p.classList.add("daoscus-comment");
        const time = new Date(comment.createdAt);
        p.appendChild(a);
        p.innerText = ` ${time.toLocaleString("zh-CN",{timeZone:"Asia/Shanghai"})}\n${comment.comment}`;
        container.appendChild(p);
    }
    /**
     * @param {HTMLDivElement} container 
     */
    async init(container){
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        const rows = await this.getCommentRows();
        for(const comment of rows){
            this.initComment(comment,container);
        }
    }
}

globalThis.Daoscus = Daoscus;