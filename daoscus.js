"use strict";
class Daoscus {
    /**
     * @param {string} mapId
     */
    constructor(mapId) {
        this.mapId = mapId;
    }
    async getCommentRows() {
        const result = await fetch(`https://dao3.api.pgaot.com/comment/list?contentId=${this.mapId}&limit=100&offset=0&contentType=1`);
        const json = await result.json();
        const rows = json.data.rows;
        for (const comment of rows) {
            comment.replyRows = await this.getReplyRows(comment.id);
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
        /*if(comment.replyTo.nickname){
            const replyTo = document.createElement();
        }*/
        commentContainer.appendChild(document.createElement("br"));
        const content = document.createElement("p");
        content.classList.add("daoscus-comment-content");
        content.textContent = comment.comment;
        commentContainer.appendChild(content);
        commentContainer.appendChild(document.createElement("br"));
        const createdAt = document.createElement("i");
        createdAt.classList.add("daoscus-comment-createdAt");
        container.textContent= `${new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`;
        commentContainer.appendChild(createdAt);
        const like = document.createElement("button");
        like.classList.add("daoscus-comment-like");
        like.textContent = `顶(${comment.likeCount})`;
        commentContainer.appendChild(like);
        if (!comment.replyTo) {
            const showReply = document.createElement("button");
            showReply.classList.add("daoscus-comment-show-reply");
            showReply.textContent = `查看回复(${comment.replyCount})`;
            commentContainer.append(showReply);
            const replyContainer = document.createElement("div");
            replyContainer.classList.add("daoscus-comment-reply-container");
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
        container.appendChild(document.createElement("hr"));
        for (const comment of rows) {
            const commentContainer = this.initComment(comment, container);
            container.appendChild(document.createElement("hr"));
        }
    }
}
globalThis.Daoscus = Daoscus;