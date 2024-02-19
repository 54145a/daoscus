"use strict";
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
     * @param {boolean} isReply  
     */
    initComment(comment, container, isReply = false) {
        const commentContainer = document.createElement("p");
        commentContainer.classList.add("daoscus-comment-container");
        const nickname = document.createElement("a");
        nickname.classList.add("daoscus-comment-nickname");
        nickname.href = `//dao3.fun/profile/${comment.userInfo.userId}`;
        nickname.target = "_blank";
        nickname.textContent = comment.userInfo.nickname;
        commentContainer.appendChild(nickname);
        commentContainer.innerHTML += ` ${new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}\n${escape(comment.comment)}`;
        container.appendChild(commentContainer);
        container.innerHTML += `\n${comment.replyCount}条回复\n`;
        if (!isReply) {
            const replyContainer = document.createElement("div");
            replyContainer.classList.add("daoscus-comment-reply-container");
            container.appendChild(replyContainer);
        }
        container.appendChild(document.createElement("hr"));
        return commentContainer;
    }
    /**
     * @param {HTMLDivElement} container 
     */
    async init(container) {
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        container.appendChild(document.createElement("hr"));
        const rows = await this.getCommentRows();
        for (const comment of rows) {
            const commentContainer = this.initComment(comment, container);
            for (const reply of comment.replyList) {
                this.initComment(reply, commentContainer.getElementsByClassName("daoscus-comment-reply-container").item(0),true);
            }
        }
    }
}

globalThis.Daoscus = Daoscus;