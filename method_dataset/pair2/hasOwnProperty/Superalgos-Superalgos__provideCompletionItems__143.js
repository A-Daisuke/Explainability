const __obj__ = {
            provideCompletionItems: function (model, position, token) {
                // Split everything the user has typed on the current line up at each space, and only look at the last word
                let last_chars = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 0,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                let words = last_chars.replace("\t", "").split(" ");
                let activeTyping = words[words.length - 1]; // What the user is currently typing (everything after the last space)
                if (activeTyping.includes('(')) {
                    let split = activeTyping.split('(');
                    activeTyping = split[split.length - 1]
                }

                // If the last character typed is a period then we need to look at member objects of our object
                let isMember = activeTyping.charAt(activeTyping.length - 1) === ".";

                // Array of autocompletion results
                let result = [];

                // Used for generic handling between member and non-member objects
                let lastToken = object;
                let prefix = '';

                if (isMember) {
                    // Is a member, get a list of all members, and the prefix
                    let parents = activeTyping.substring(0, activeTyping.length - 1).split(".");
                    lastToken = object[parents[0]];
                    prefix = parents[0];

                    // Loop through all the parents the current one will have (to generate prefix)
                    for (let i = 1; i < parents.length; i++) {
                        if (lastToken !== undefined && lastToken.hasOwnProperty(parents[i])) {
                            prefix += '.' + parents[i];
                            lastToken = lastToken[parents[i]];
                        } else {
                            // Not valid
                            return result[0] = '';
                        }
                    }
                }

                // Get all the child properties of the last token
                for (let prop in lastToken) {
                    if (lastToken.hasOwnProperty(prop) && !prop.startsWith("__")) {
                        // Get the detail type (try-catch) in case object does not have prototype
                        let details = '';
                        try {
                            details = lastToken[prop].__proto__.constructor.name;
                        } catch (e) {
                            details = typeof lastToken[prop];
                        }

                        // Create completion object
                        let suggestion = {
                            label: prop,
                            kind: getType(lastToken[prop], isMember),
                            detail: details,
                            insertText: prop
                        };

                        // Change insertText and documentation for functions
                        if (suggestion.detail.toLowerCase() === 'function') {
                            suggestion.insertText += "(";
                            suggestion.documentation = (lastToken[prop].toString()).split("{")[0]; // Show function prototype in the documentation popup
                        }

                        // Add to final results
                        result.push(suggestion);
                        // TODO: Manually adding "value" property if parent is tradingEngine

                    }
                }

                return {
                    suggestions: result
                };
            }

};
