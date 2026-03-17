const __obj__ = {
            onClickNode: function(n) {
                var overlay = d3.select(".njg-overlay"),
                    overlayInner = d3.select(".njg-overlay > .njg-inner"),
                    html = "<p><b>id</b>: " + n.id + "</p>";
                    if(n.label) { html += "<p><b>label</b>: " + n.label + "</p>"; }
                    if(n.properties) {
                        for(var key in n.properties) {
                            if(!n.properties.hasOwnProperty(key)) { continue; }
                            html += "<p><b>"+key.replace(/_/g, " ")+"</b>: " + n.properties[key] + "</p>";
                    }
                }
                if(n.linkCount) { html += "<p><b>links</b>: " + n.linkCount + "</p>"; }
                if(n.local_addresses) {
                    html += "<p><b>local addresses</b>:<br />" + n.local_addresses.join('<br />') + "</p>";
                }
                overlayInner.html(html);
                overlay.classed("njg-hidden", false);
                overlay.style("display", "block");
                // set "open" class to current node
                removeOpenClass();
                d3.select(this).classed("njg-open", true);
            },

};
