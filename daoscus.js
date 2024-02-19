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
    /**
     * @param {number} contentType 
     */
    async getCommentRows(contentType) {
        const result = await fetch(`https://dao3.api.pgaot.com/comment/list?contentId=${this.mapId}&limit=100&offset=0&contentType=${contentType}`);
        const json = await result.json();
        console.log(json);
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
        commentContainer.appendChild(nickname);
        const content = document.createElement("div");
        content.classList.add("daoscus-comment-content");
        content.textContent = escape(comment.comment);
        commentContainer.appendChild(content);
        const createdAt = document.createElement("i");
        createdAt.classList.add("daoscus-comment-createdAt");
        createdAt.textContent = new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
        commentContainer.appendChild(createdAt);
        if (comment.replyList) {
            const replyHeading = document.createElement("p");
            replyHeading.textContent = `${comment.replyCount} 条回复`;
            commentContainer.append(replyHeading);
            const replyContainer = document.createElement("div");
            replyContainer.classList.add("daoscus-comment-reply-container");
            commentContainer.appendChild(replyContainer);
        }
        container.appendChild(commentContainer);
        return commentContainer;
    }
    /**
     * @param {HTMLDivElement} container 
     * @param {number} contentType 
     */
    async init(container,contentType) {
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        container.style.wordBreak = "break-all";
        container.appendChild(document.createElement("hr"));
        const rows = await this.getCommentRows(contentType);
        const commentNum = document.createElement("p");
        commentNum.classList.add("daoscus-commentNum");
        commentNum.textContent = `${rows.length} 评论`;
        container.appendChild(commentNum);
        container.appendChild(document.createElement("hr"));
        for (const comment of rows) {
            const commentContainer = this.initComment(comment, container);
        }
    }
}

globalThis.Daoscus = Daoscus;