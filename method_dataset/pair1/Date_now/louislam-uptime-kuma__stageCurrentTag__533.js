function __method_wrapper__() {
        stageCurrentTag() {
            if (this.validateDraftTag.invalid) {
                return;
            }

            const isNew = this.newDraftTag.select == null;
            const name = isNew ? this.newDraftTag.name.trim() : this.newDraftTag.select.name;
            const color = isNew ? this.newDraftTag.color.color : this.newDraftTag.select.color;
            const value = this.newDraftTag.value ? this.newDraftTag.value.trim() : "";

            const stagedTagObject = {
                name: name,
                color: color,
                value: value,
                isNewSystemTag: isNew,
                systemTagId: isNew ? null : this.newDraftTag.select.id,
                keyForList: `staged-${Date.now()}-${Math.random().toString(36).substring(2, 15)}` // Unique key
            };

            this.stagedForBatchAdd.push(stagedTagObject);
            this.clearDraftTag(); // Reset input fields for the next tag
        },

}
