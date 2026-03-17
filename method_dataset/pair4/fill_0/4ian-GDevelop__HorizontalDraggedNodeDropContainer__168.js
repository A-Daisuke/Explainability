function HorizontalDraggedNodeDropContainer({
  DnDComponent,
  onDrop,
  activateTargets,
  getNodeAtPath,
  node,
  draggedNode,
  indentWidth,
  draggedNodeHeight,
}: HorizontalDraggedNodeDropContainerProps) {
  const { depth } = node;
  return (
    <>
      {new Array(depth).fill(0).map((_, depthStep) => {
        // Skip so that it does not hinder dragging and so that we don't have to
        // worry about delaying the drop target activation.
        if (depthStep === draggedNode.depth) return null;
        return (
          <DropTargetContainer
            key={depthStep}
            DnDComponent={DnDComponent}
            onDrop={() =>
              onDrop(
                moveNodeBelow,
                getNodeAtPath(node.nodePath.slice(0, depthStep + 1))
              )
            }
            canDrop={() => true}
            style={{
              dropArea: {
                top: '100%',
                bottom: `-${draggedNodeHeight}px`,
                left: `-${indentWidth * (depth - depthStep)}px`,
                width: indentWidth,
              },
              dropIndicator: {
                left: `-${indentWidth * (depth - depthStep)}px`,
                right: '0px',
                // The bottom is set so that the indicator is centered between the events.
                bottom: '-2px',
              },
            }}
          />
        );
      })}
    </>
  );
}
