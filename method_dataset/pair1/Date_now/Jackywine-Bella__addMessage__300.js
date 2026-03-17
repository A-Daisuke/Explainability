class __C__ {
    addMessage(role, content, isWelcome = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `bella-message bella-message-${role}`;
        
        if (isWelcome) {
            messageElement.classList.add('bella-welcome-message');
        }

        const timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageElement.innerHTML = `
            <div class="bella-message-avatar">
                ${role === 'user' ? '👤' : '💝'}
            </div>
            <div class="bella-message-content">
                <div class="bella-message-text">${this.formatMessage(content)}</div>
                <div class="bella-message-time">${timestamp}</div>
            </div>
        `;

        this.messageContainer.appendChild(messageElement);
        this.messages.push({ role, content, timestamp: Date.now() });

        // 限制消息数量
        if (this.messages.length > this.maxMessages) {
            const oldMessage = this.messageContainer.firstChild;
            if (oldMessage) {
                this.messageContainer.removeChild(oldMessage);
            }
            this.messages.shift();
        }

        // 滚动到底部
        this.scrollToBottom();

        // 添加动画效果
        setTimeout(() => {
            messageElement.classList.add('bella-message-appear');
        }, 10);
    }

}
