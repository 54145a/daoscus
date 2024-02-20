"use strict";
class Daoscus {
    /**
     * @param {string} mapId
     */
    constructor(mapId) {
        this.mapId = mapId;
    }
    async getCommentRows() {
        const result = await fetch(`https://dao3.api.pgaot.com/comment/list?contentId=${this.mapId}&limit=100&offset=0&contentType=1&orderBy=1`);
        const json = await result.json();
        const rows = json.data.rows;
        for (const comment of rows) {
            if (comment.replyCount > 0) {
                comment.replyRows = await this.getReplyRows(comment.id);
            }
        }
        return rows;
    }
    /**
     * @param {number} id 
     */
    async getReplyRows(id) {
        const result = await fetch(`https://code-api-pc.dao3.fun/comment/${id}/replies?limit=100&offset=0`);
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
        commentContainer.appendChild(nickname);
        const content = document.createElement("p");
        content.classList.add("daoscus-comment-content");
        content.textContent = comment.comment;
        commentContainer.appendChild(content);
        const createdAt = document.createElement("i");
        createdAt.classList.add("daoscus-comment-createdAt");
        createdAt.textContent = `${new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`;
        commentContainer.appendChild(createdAt);
        if (!comment.replyTo&&comment.replyCount > 0) {
            const replyHeading = document.createElement("p");
            replyHeading.classList.add("daoscus-comment-reply-heading");
            replyHeading.style.fontWeight = "bold";
            replyHeading.textContent = `${comment.replyCount}回复`;
            commentContainer.append(replyHeading);
            const replyContainer = document.createElement("div");
            replyContainer.classList.add("daoscus-comment-reply-container");
            replyContainer.style.borderLeftWidth = "10px";
            commentContainer.appendChild(replyContainer);
        }
        container.appendChild(commentContainer);
        return commentContainer;
    }
    /**
     * @param {HTMLDivElement} container 
     */
    async init(container) {
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        container.style.wordBreak = "break-all";
        container.appendChild(document.createElement("hr"));
        const rows = await this.getCommentRows();
        const commentNum = document.createElement("p");
        commentNum.classList.add("daoscus-commentNum");
        commentNum.textContent = `${rows.length} 评论 - Daoscus ${this.mapId}`;
        container.appendChild(commentNum);
        for (const comment of rows) {
            container.appendChild(document.createElement("hr"));
            const commentContainer = this.initComment(comment, container);
            const replyPreviewContainer = commentContainer.getElementsByClassName("daoscus-comment-reply-container").item(0);
            if (comment.replyCount > 0) {
                for (const reply of comment.replyRows) {
                    this.initComment(reply, replyPreviewContainer);
                }
            }
        }
    }
}
globalThis.Daoscus = Daoscus;