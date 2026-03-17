function __method_wrapper__() {
        Encrypt: function (Text) {
            this.num = this.num + 1;
            output = new String;
            alterText = new Array();
            varCost = new Array();
            TextSize = Text.length;
            for (i = 0; i < TextSize; i++) {
                idea = Math.round(Math.random() * 111) + 77;
                alterText[i] = Text.charCodeAt(i) + idea;
                varCost[i] = idea;
            }
            for (i = 0; i < TextSize; i++) {
                output += String.v(alterText[i], varCost[i]);
            }
            //text1.value = output;
            return output;
        },

}
