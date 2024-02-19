
/**
 * @param {string} string 
 * @returns {string}
 */
function escape(string) {
    const element = document.createElement("div");
    element.textContent = string;
    return element.innerHTML;
}

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
        const commentContainer = document.createElement("p");
        commentContainer.classList.add("daoscus-comment-container");
        const nickname = document.createElement("a");
        nickname.classList.add("daoscus-comment-nickname");
        nickname.href = `//dao3.fun/profile/${comment.userInfo.userId}`;
        nickname.target = "_blank";
        nickname.textContent = comment.userInfo.nickname;
        const replyContainer = document.createElement("div");
        replyContainer.classList.add("daoscus-reply-container");
        commentContainer.appendChild(nickname);
        commentContainer.innerHTML += ` ${new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}\n${escape(comment.comment)}`;
        container.appendChild(commentContainer);
        container.innerHTML += `\n${comment.replyCount}条回复\n`;
        container.appendChild(replyContainer);
        return commentContainer;
    }
    /**
     * @param {object} reply
     * @param {HTMLDivElement} container
     */
    initReply(reply, container) {
        this.initComment(reply, container);
    }
    /**
     * @param {HTMLDivElement} container 
     */
    async init(container) {
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        const rows = await this.getCommentRows();
        for (const comment of rows) {
            const commentContainer = this.initComment(comment, container);
            for (const reply of comment.replyList) {
                this.initComment(reply, commentContainer.getElementsByClassName("daoscus-reply-container"));
            }
        }
    }
}

globalThis.Daoscus = Daoscus;