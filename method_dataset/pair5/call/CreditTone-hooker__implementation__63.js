function __method_wrapper__() {
        getTextFunc.implementation = function() {
        	var startTime = new Date().getTime();
            var editable = getTextFunc.call(this);
            if (isClass(this, "android.widget.EditText")) {
                var clz = this.getClass().getName();
                var viewId = this.getId();
                console.log("EditTextClz: " + clz);
                console.log("ViewId: " + viewId);
                console.log("Text: " + Java.cast(editable, charSequenceClz));
                var invokeId = Math.random().toString(36).slice( - 8);
        		var executor = this.hashCode();
        		methodInBeat(invokeId, startTime, 'android.widget.EditText.getText()', executor);
            }
            return editable;
        };

}
