function __method_wrapper__() {
            onChange={val => {
              setTrailCount(val);
              const newSizes = Array(val)
                .fill(0)
                .map((_, i) => sizes[i] || sizes[sizes.length - 1] || 60);
              const newInnerSizes = Array(val)
                .fill(0)
                .map((_, i) => innerSizes[i] || innerSizes[innerSizes.length - 1] || 20);
              const newOpacities = Array(val)
                .fill(0)
                .map((_, i) => opacities[i] || opacities[opacities.length - 1] || 0.6);
              setSizes(newSizes);
              setInnerSizes(newInnerSizes);
              setOpacities(newOpacities);
            }}

}
