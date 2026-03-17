  var initiliazeSVG = /* @__PURE__ */ __name((treeConfig) => {
    const {
      htmlId,
      isHorizontal,
      hasPan,
      hasZoom,
      mainAxisNodeSpacing,
      nodeHeight,
      nodeWidth,
      marginBottom,
      marginLeft,
      marginRight,
      marginTop
    } = treeConfig;
    const margin = {
      top: marginTop,
      right: marginRight,
      bottom: marginBottom,
      left: marginLeft
    };
    const { areaHeight, areaWidth } = getAreaSize(treeConfig.htmlId);
    const width = areaWidth - margin.left - margin.right;
    const height = areaHeight - margin.top - margin.bottom;
    const svg = d3_default.select("#" + htmlId).append("svg").attr("width", areaWidth).attr("height", areaHeight);
    const ZoomContainer = svg.append("g");
    const zoom = d3_default.zoom().on("zoom", (e) => {
      ZoomContainer.attr("transform", () => e.transform);
    });
    svg.call(zoom);
    if (!hasPan) {
      svg.on("mousedown.zoom", null).on("touchstart.zoom", null).on("touchmove.zoom", null).on("touchend.zoom", null);
    }
    if (!hasZoom) {
      svg.on("wheel.zoom", null).on("mousewheel.zoom", null).on("mousemove.zoom", null).on("DOMMouseScroll.zoom", null).on("dblclick.zoom", null);
    }
    const MainG = ZoomContainer.append("g").attr(
      "transform",
      mainAxisNodeSpacing === "auto" ? "translate(0,0)" : isHorizontal ? "translate(" + margin.left + "," + (margin.top + height / 2 - nodeHeight / 2) + ")" : "translate(" + (margin.left + width / 2 - nodeWidth / 2) + "," + margin.top + ")"
    );
    return MainG;
  }, "initiliazeSVG");
