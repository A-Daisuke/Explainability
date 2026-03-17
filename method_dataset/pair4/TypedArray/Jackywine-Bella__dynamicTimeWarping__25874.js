function dynamicTimeWarping(matrix) {
    const [output_length, input_length] = matrix.dims;

    const outputShape = [output_length + 1, input_length + 1];

    const cost = new Tensor(
        'float32',
        new Float32Array(outputShape[0] * outputShape[1]).fill(Infinity),
        outputShape
    );

    const trace = new Tensor(
        'float32',
        new Float32Array(outputShape[0] * outputShape[1]).fill(-1),
        outputShape
    )

    // same as `cost[0][0] = 0`;
    cost[0].data[0] = 0;

    for (let j = 1; j < input_length + 1; ++j) {
        for (let i = 1; i < output_length + 1; ++i) {

            const c0 = cost[i - 1][j - 1].item();
            const c1 = cost[i - 1][j].item();
            const c2 = cost[i][j - 1].item();

            let c, t;
            if (c0 < c1 && c0 < c2) {
                c = c0;
                t = 0;
            } else if (c1 < c0 && c1 < c2) {
                c = c1;
                t = 1;
            } else {
                c = c2;
                t = 2;
            }

            cost[i].data[j] = matrix[i - 1][j - 1].item() + c;
            trace[i].data[j] = t;
        }
    }

    // backtrace
    let i = output_length;
    let j = input_length;

    // @ts-ignore
    trace.data.fill(2, 0, outputShape[1]) // trace[0, :] = 2
    for (let i = 0; i < outputShape[0]; ++i) { // trace[:, 0] = 1
        trace[i].data[0] = 1;
    }

    let text_indices = [];
    let time_indices = [];

    while (i > 0 || j > 0) {
        text_indices.push(i - 1);
        time_indices.push(j - 1);

        const t = trace[i][j].item();
        switch (t) {
            case 0:
                --i; --j;
                break;
            case 1:
                --i;
                break;
            case 2:
                --j;
                break;
            default:
                throw new Error(
                    `Internal error in dynamic time warping. Unexpected trace[${i}, ${j}]. Please file a bug report.`
                )
        }
    }

    text_indices.reverse();
    time_indices.reverse();

    return [text_indices, time_indices];

}
