        function writeDelimiter(format) {
            switch (format & 60) {
                case 0:
                    break;
                case 16:
                    writePunctuation(",");
                    break;
                case 4:
                    writeSpace();
                    writePunctuation("|");
                    break;
                case 32:
                    writeSpace();
                    writePunctuation("*");
                    writeSpace();
                    break;
                case 8:
                    writeSpace();
                    writePunctuation("&");
                    break;
            }
        }
