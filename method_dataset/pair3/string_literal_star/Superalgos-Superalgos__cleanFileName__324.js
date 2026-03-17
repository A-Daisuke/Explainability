        function cleanFileName(fileName) {
            for(let i = 0; i < 100; i++) {
                fileName = fileName
                    .replace(' ', '-')
                    .replace('--', '-')
                    .replace('?', '')
                    .replace('#', '')
                    .replace('$', '')
                    .replace('%', '')
                    .replace('^', '')
                    .replace('&', '')
                    .replace('*', '')
                    .replace('(', '')
                    .replace(')', '')
                    .replace('!', '')
                    .replace('..', '.')
                    .replace(',', '')
                    .replace('\'', '')
                    .replace(':', '')
                    .replace('|', '')
                    .replace('"', '')
                    .replace('<', '')
                    .replace('>', '')
                    .replace(';', '')
                    .replace('=', '')
            }
            return fileName
        }
