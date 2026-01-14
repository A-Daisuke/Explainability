const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return (
            VAR_1 === "mousedown" || VAR_1 === "pointerdown" || VAR_1 === "touchstart"
          );
        }
        FUNCTION_1("mousedown");
        FUNCTION_1("pointerdown");
        FUNCTION_1("mousemove");
        FUNCTION_1("pointermove");
        FUNCTION_1("mouseup");
        FUNCTION_1("pointerup");
        FUNCTION_1("click");
        FUNCTION_1("dblclick");
        FUNCTION_1("contextmenu");
        FUNCTION_1("touchstart");
        FUNCTION_1("touchmove");
        FUNCTION_1("touchend");
    }
};