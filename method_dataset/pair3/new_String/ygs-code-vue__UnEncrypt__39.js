const __obj__ = {
        UnEncrypt: function (Text) {
            if (this.num > 0) {
                this.num = this.num - 1;
                output = new String;
                alterText1 = new Array();
                varCost1 = new Array();
                TextSize = Text.length;
                for (i = 0; i < TextSize; i++) {
                    alterText[i] = Text.charCodeAt(i);
                    varCost[i] = Text.charCodeAt(i + 1);
                }
                for (i = 0; i < TextSize; i = i + 2) {
                    output += String.fromCharCode(alterText[i] - varCost[i]);
                }
                //text1.value = output;
                return output;
            }
        }

};
