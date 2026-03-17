class __C__ {
    onDragStart(element, uri, event) {
        var _a, _b;
        if (!event.dataTransfer) {
            return;
        }
        const elements = this.dnd.getDragElements(element);
        event.dataTransfer.effectAllowed = 'copyMove';
        event.dataTransfer.setData(DataTransfers.TEXT, uri);
        if (event.dataTransfer.setDragImage) {
            let label;
            if (this.dnd.getDragLabel) {
                label = this.dnd.getDragLabel(elements, event);
            }
            if (typeof label === 'undefined') {
                label = String(elements.length);
            }
            const dragImage = $('.monaco-drag-image');
            dragImage.textContent = label;
            const getDragImageContainer = (e) => {
                while (e && !e.classList.contains('monaco-workbench')) {
                    e = e.parentElement;
                }
                return e || this.domNode.ownerDocument;
            };
            const container = getDragImageContainer(this.domNode);
            container.appendChild(dragImage);
            event.dataTransfer.setDragImage(dragImage, -10, -10);
            setTimeout(() => container.removeChild(dragImage), 0);
        }
        this.domNode.classList.add('dragging');
        this.currentDragData = new ElementsDragAndDropData(elements);
        StaticDND.CurrentDragAndDropData = new ExternalElementsDragAndDropData(elements);
        (_b = (_a = this.dnd).onDragStart) === null || _b === void 0 ? void 0 : _b.call(_a, this.currentDragData, event);
    }

}
