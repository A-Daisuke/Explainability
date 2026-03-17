function __method_wrapper__() {
            processJson = function(graph) {
                /**
                 * Init netJsonGraph
                 */
                init = function(url, opts) {
                    d3.netJsonGraph(url, opts);
                };
                /**
                 * Remove all instances
                 */
                destroy = function() {
                    force.stop();
                    d3.select("#selectGroup").remove();
                    d3.select(".njg-overlay").remove();
                    d3.select(".njg-metadata").remove();
                    overlay.remove();
                    overlayInner.remove();
                    metadata.remove();
                    svg.remove();
                    node.remove();
                    link.remove();
                    nodes = [];
                    links = [];
                };
                /**
                 * Destroy and e-init all instances
                 * @return {[type]} [description]
                 */
                reInit = function() {
                    destroy();
                    init(url, opts);
                };

                var data = opts.prepareData(graph),
                    links = data.links,
                    nodes = data.nodes;

                // disable some transitions while dragging
                drag.on('dragstart', function(n){
                    d3.event.sourceEvent.stopPropagation();
                    zoom.on('zoom', null);
                })
                // re-enable transitions when dragging stops
                .on('dragend', function(n){
                    zoom.on('zoom', opts.redraw);
                })
                .on("drag", function(d) {
                    // avoid pan & drag conflict
                    d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
                });

                force.nodes(nodes).links(links).start();

                var link = panner.selectAll(".link")
                                 .data(links)
                                 .enter().append("line")
                                 .attr("class", function (link) {
                                     var baseClass = "njg-link",
                                         addClass = null;
                                         value = link.properties && link.properties[opts.linkClassProperty];
                                     if (opts.linkClassProperty && value) {
                                         // if value is stirng use that as class
                                         if (typeof(value) === "string") {
                                             addClass = value;
                                         }
                                         else if (typeof(value) === "number") {
                                             addClass = opts.linkClassProperty + value;
                                         }
                                         else if (value === true) {
                                             addClass = opts.linkClassProperty;
                                         }
                                         return baseClass + " " + addClass;
                                     }
                                     return baseClass;
                                 })
                                 .on("click", opts.onClickLink),
                    groups = panner.selectAll(".node")
                                   .data(nodes)
                                   .enter()
                                   .append("g");
                    node = groups.append("circle")
                                 .attr("class", function (node) {
                                     var baseClass = "njg-node",
                                         addClass = null;
                                         value = node.properties && node.properties[opts.nodeClassProperty];
                                     if (opts.nodeClassProperty && value) {
                                         // if value is stirng use that as class
                                         if (typeof(value) === "string") {
                                             addClass = value;
                                         }
                                         else if (typeof(value) === "number") {
                                             addClass = opts.nodeClassProperty + value;
                                         }
                                         else if (value === true) {
                                             addClass = opts.nodeClassProperty;
                                         }
                                         return baseClass + " " + addClass;
                                     }
                                     return baseClass;
                                 })
                                 .attr("r", opts.circleRadius)
                                 .on("click", opts.onClickNode)
                                 .call(drag);

                    var labels = groups.append('text')
                                       .text(function(n){ return n.label || n.id })
                                       .attr('dx', opts.labelDx)
                                       .attr('dy', opts.labelDy)
                                       .attr('class', 'njg-tooltip');

                // Close overlay
                closeOverlay.on("click", function() {
                    removeOpenClass();
                    overlay.classed("njg-hidden", true);
                });
                // Close Metadata panel
                closeMetadata.on("click", function() {
                    // Reinitialize the page
                    if(graph.type === "NetworkCollection") {
                        reInit();
                    }
                    else {
                        removeOpenClass();
                        metadata.classed("njg-hidden", true);
                    }
                });
                // default style
                // TODO: probably change defaultStyle
                // into something else
                if(opts.defaultStyle) {
                    var colors = d3.scale.category20c();
                    node.style({
                        "fill": function(d){ return colors(d.linkCount); },
                        "cursor": "pointer"
                    });
                }
                // Metadata style
                if(opts.metadata) {
                    metadata.attr("class", "njg-metadata").style("display", "block");
                }

                var attrs = ["protocol",
                             "version",
                             "revision",
                             "metric",
                             "router_id",
                             "topology_id"],
                    html = "";
                if(graph.label) {
                    html += "<h3>" + graph.label + "</h3>";
                }
                for(var i in attrs) {
                    var attr = attrs[i];
                    if(graph[attr]) {
                        html += "<p><b>" + attr + "</b>: <span>" + graph[attr] + "</span></p>";
                    }
                }
                // Add nodes and links count
                html += "<p><b>nodes</b>: <span>" + graph.nodes.length + "</span></p>";
                html += "<p><b>links</b>: <span>" + graph.links.length + "</span></p>";
                metadataInner.html(html);
                metadata.classed("njg-hidden", false);

                // onLoad callback
                opts.onLoad(url, opts);

                force.on("tick", function() {
                    link.attr("x1", function(d) {
                        return d.source.x;
                    })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

                    node.attr("cx", function(d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
                    });

                    labels.attr("transform", function(d) {
                        return "trans"+"late(" + d.x + "," + d.y + ")";
                    });
                })
                .on("end", function(){
                    force.stop();
                    // onEnd callback
                    opts.onEnd(url, opts);
                });

                return force;
            };

}
