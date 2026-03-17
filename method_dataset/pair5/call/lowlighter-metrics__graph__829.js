class __C__ {
  graph(type, data, {area = true, points = true, text = true, low = NaN, high = NaN, match = null, labels = null, width = 480, height = 315, ticks = 0} = {}) {
    //Generate SVG
    const margin = {top: 10, left: 10, right: 10, bottom: 45}
    const d3n = new D3node()
    const svg = d3n.createSVG(width, height)

    //Data
    const X = data.map(({x}) => x)
    const start = X.at(0)
    const end = X.at(-1)
    const Y = data.map(({y}) => y)
    const extremum = Math.max(...Y)
    high = !Number.isNaN(high) ? high : extremum
    low = !Number.isNaN(low) ? low : 0
    const T = data.map(({text}, i) => text ?? Y[i])

    //Time range
    const x = (type === "time" ? d3.scaleTime() : d3.scaleLinear())
      .domain([start, end])
      .range([margin.top, width - margin.left - margin.right])
    let xticks = d3.axisBottom(x).tickSizeOuter(0)
    if (labels)
      xticks = xticks.tickFormat((_, i) => labels[i])
    if (ticks)
      xticks = xticks.ticks(ticks)
    svg.append("g")
      .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
      .call(xticks)
      .call(g => g.select(".domain").attr("stroke", "rgba(127, 127, 127, .8)"))
      .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.5))
      .selectAll("text")
      .attr("transform", "translate(-5,5) rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 20)
      .attr("fill", "rgba(127, 127, 127, .8)")

    //Data range
    const y = d3.scaleLinear()
      .domain([high, low])
      .range([margin.left, height - margin.top - margin.bottom])
    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisRight(y).ticks(Math.round(height / 50)).tickSize(width - margin.left - margin.right))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.5).attr("stroke-dasharray", "2,2"))
      .call(g => g.selectAll(".tick text").attr("x", 0).attr("dy", -4))
      .selectAll("text")
      .style("font-size", 20)
      .attr("fill", "rgba(127, 127, 127, .8)")

    //Generate graph line
    const datum = Y.map((y, i) => [X.at(i), y])
    const tdatum = Y.map((y, i) => [X.at(i), y, T[i]])
    const xticked = xticks.scale().ticks(xticks.ticks()[0])
    const yticked = match?.(tdatum, xticked) ?? tdatum
    svg.append("path")
      .datum(datum)
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr(
        "d",
        d3.line()
          .curve(d3.curveLinear)
          .x(d => x(d[0]))
          .y(d => y(d[1])),
      )
      .attr("fill", "transparent")
      .attr("stroke", "#87ceeb")
      .attr("stroke-width", 2)

    //Generate graph area
    if (area) {
      svg.append("path")
        .datum(datum)
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr(
          "d",
          d3.area()
            .curve(d3.curveLinear)
            .x(d => x(d[0]))
            .y0(d => y(d[1]))
            .y1(() => y(low)),
        )
        .attr("fill", "rgba(88, 166, 255, .1)")
    }

    //Generate graph points
    if (points) {
      svg.append("g")
        .selectAll("circle")
        .data(yticked)
        .join("circle")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("cx", d => x(d[0]))
        .attr("cy", d => y(d[1]))
        .attr("r", 2)
        .attr("fill", "#106cbc")
    }

    //Generate graph text
    if (text) {
      svg.append("g")
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("stroke", "rgba(88, 166, 255, .05)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 4)
        .attr("paint-order", "stroke fill")
        .selectAll("text")
        .data(yticked)
        .join("text")
        .attr("transform", `translate(${margin.left},${margin.top - 4})`)
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .text(d => d[2] ? d[2] : "")
        .attr("fill", "rgba(127, 127, 127, .8)")
    }

    return d3n.svgString()
  },

}
