function __method_wrapper__() {
            onClickLink: function(l) {
                var overlay = d3.select(".njg-overlay"),
                    overlayInner = d3.select(".njg-overlay > .njg-inner"),
                    html = "<p><b>source</b>: " + (l.source.label || l.source.id) + "</p>";
                    html += "<p><b>target</b>: " + (l.target.label || l.target.id) + "</p>";
                    html += "<p><b>cost</b>: " + l.cost + "</p>";
                if(l.properties) {
                    for(var key in l.properties) {
                        if(!l.properties.hasOwnProperty(key)) { continue; }
                        html += "<p><b>"+ key.replace(/_/g, " ") +"</b>: " + l.properties[key] + "</p>";
                    }
                }
                overlayInner.html(html);
                overlay.classed("njg-hidden", false);
                overlay.style("display", "block");
                // set "open" class to current link
                removeOpenClass();
                d3.select(this).classed("njg-open", true);
            }

}
