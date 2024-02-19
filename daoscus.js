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
    initComment(comment, container) {
        console.log(comment);
        const commentContainer = document.createElement("div");
        commentContainer.classList.add("daoscus-comment-container");
        const nickname = document.createElement("a");
        nickname.classList.add("daoscus-comment-nickname");
        nickname.href = `//dao3.fun/profile/${comment.userInfo.userId}`;
        nickname.target = "_blank";
        nickname.innerText = comment.userInfo.nickname;
        const time = document.createElement("p");
        time.classList.add("daoscus-comment-time");
        time.innerText = new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
        const content = document.createElement("p");
        content.classList.add("daoscus-comment-content");
        content.innerText = encodeURIComponent(comment.comment);
        commentContainer.appendChild(nickname);
        commentContainer.appendChild(time);
        commentContainer.appendChild(document.createElement("br"));
        commentContainer.appendChild(content);
        container.appendChild(commentContainer);
    }
    /**
     * @param {HTMLDivElement} container 
     */
    async init(container) {
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        const rows = await this.getCommentRows();
        for (const comment of rows) {
            this.initComment(comment, container);
        }
    }
}

globalThis.Daoscus = Daoscus;