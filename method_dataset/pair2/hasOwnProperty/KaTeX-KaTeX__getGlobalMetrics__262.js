export function getGlobalMetrics(size: number): FontMetrics {
    let sizeIndex: FontSizeIndex;
    if (size >= 5) {
        sizeIndex = 0;
    } else if (size >= 3) {
        sizeIndex = 1;
    } else {
        sizeIndex = 2;
    }
    if (!fontMetricsBySizeIndex[sizeIndex]) {
        const metrics = fontMetricsBySizeIndex[sizeIndex] = {
            cssEmPerMu: sigmasAndXis.quad[sizeIndex] / 18,
        };
        for (const key in sigmasAndXis) {
            if (sigmasAndXis.hasOwnProperty(key)) {
                metrics[key] = sigmasAndXis[key][sizeIndex];
            }
        }
    }
    return fontMetricsBySizeIndex[sizeIndex];
}
