export function createNotification(text, type = "info") {
    // 创建通知元素
    let notification = document.createElement('div');
    notification.className = 'notification_of_easyspider'; // 使用 class 方便后续添加样式
    notification.setAttribute("data-timestamp", new Date().getTime()); // 用于清除通知
    // 设置通知文本
    notification.innerText = text;

    // 定义与添加样式
    let cssText = `
      position: fixed;
      bottom: 20px; /* 距底部20px */
      right: -320px; /* 初始位置在屏幕右侧，假设通知框宽度320px */
      min-width: 300px;
      padding: 10px 20px;
      color: white;
      z-index: 2147483641;
      border-radius: 4px;
      text-align: center;
      font-size: 15px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: right 0.5s ease-in-out; /* 动画效果 */
    `;
    notification.style.cssText = cssText;

    if (type === "success") {
        notification.style.backgroundColor = 'rgb(103, 194, 58)';
    } else if (type === "info") {
        notification.style.backgroundColor = '#00a8ff';
    } else if (type === "warning") {
        notification.style.backgroundColor = 'rgb(230, 162, 60)';
    } else if (type === "error") {
        notification.style.backgroundColor = '#ff6b6b';
        notification.style.bottom = '70px';
    }

    // 将通知添加到页面中
    document.body.appendChild(notification);

    // 触发动画，通知从右向左滑入
    setTimeout(function () {
        notification.style.right = '20px'; // 调整距离左边的位置
    }, 100);
    // let removeXPathText = text.split("是否正确：")[0].split("is correct:")[0];
    // let timeoutInterval = 1500 * removeXPathText.length / 5;
    let timeoutInterval = 1500 * text.length / 5;
    // 设置退出动画，通知从右向左滑出
    setTimeout(function () {
        notification.style.right = '-320px'; // 向左退出
        // 确定动画结束后移除通知
        notification.addEventListener('transitionend', function () {
            if (notification.parentNode === document.body) {
                document.body.removeChild(notification); // 避免移除已经不存在的元素
            }
        });
    }, timeoutInterval + 500); // 通知停留时间加上动画时间
}
