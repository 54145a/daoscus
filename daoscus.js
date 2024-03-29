//@ts-nocheck
"use strict";
class Daoscus {
    /**
     * @param {string} mapId
     */
    constructor(mapId) {
        this.mapId = mapId;
    }
    /**
     * @returns {object[]}
     */
    async getCommentRows() {
        const result = await fetch(`https://code-api-pc.dao3.fun/comment/list?contentId=${this.mapId}&limit=100&offset=0&contentType=1&orderBy=1`, {
            mode: "cors"
        });
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
     * @returns {object[]}
     */
    async getReplyRows(id) {
        const result = await fetch(`https://code-api-pc.dao3.fun/comment/${id}/replies?limit=100&offset=0`, {
            mode: "cors"
        });
        const json = await result.json();
        return json.data.rows;
    }
    /**
     * @param {string} authorization
     * @param {string} nonce 
     * @param {string} hash 
     * @param {string} content 
     */
    async postComment(authorization, nonce, hash, content) {
        const result = await fetch("//dao3.api.pgaot.com/comment", {
            method: "POST",
            headers: {
                "Cache-Control": "no-cache,no-store,must-revalidate",
                Authorization: authorization,
                nonce: nonce,
                hash: hash,
                timestamp: Date.now()
            },
            body: {
                comment: content,
                contentId: this.mapId,
                contentType: 1
            }

        });
    }
    /**
     * @param {object} comment 
     * @param {HTMLDivElement} container 
     * @returns {HTMLDivElement}
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
        if (comment.replyTo?.nickname) {
            const replyTo = document.createElement("i");
            replyTo.classList.add("daoscus-comment-replyTo");
            replyTo.textContent = ` 回复 ${comment.replyTo.nickname}`;
            commentContainer.appendChild(replyTo);
        }
        const content = document.createElement("p");
        content.classList.add("daoscus-comment-content");
        content.textContent = comment.comment;
        commentContainer.appendChild(content);
        const createdAt = document.createElement("i");
        createdAt.classList.add("daoscus-comment-createdAt");
        createdAt.textContent = `${new Date(comment.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`;
        commentContainer.appendChild(createdAt);
        if (!comment.replyTo && comment.replyCount > 0 && comment.replyList) {
            const replyHeading = document.createElement("p");
            replyHeading.classList.add("daoscus-comment-reply-heading");
            replyHeading.style.fontWeight = "bold";
            replyHeading.textContent = `${comment.replyCount}回复`;
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
     */
    async init(container) {
        const mapId = this.mapId;
        container.classList.add("daoscus-container");
        container.innerHTML = "";
        container.style.wordBreak = "break-all";
        container.appendChild(document.createElement("hr"));
        const rows = await this.getCommentRows();
        const commentNum = document.createElement("p");
        commentNum.classList.add("daoscus-commentNum");
        commentNum.textContent = `${rows.length} 评论 - Daoscus ${mapId}`;
        container.appendChild(commentNum);
        const createComment = document.createElement("button");
        createComment.classList.add("daoscus-create-comment");
        createComment.textContent = "发评论/回复评论";
        createComment.onclick = function(){
            open(`//dao3.fun/exp/experience/detail/${mapId}`);
        };
        container.appendChild(createComment);
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
        container.appendChild(document.createElement("hr"));
    }
}
globalThis.Daoscus = Daoscus;