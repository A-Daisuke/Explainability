export const getDebugInfo = (program: IProgram): IDebugInfo | null => {
  if (Object.prototype.hasOwnProperty.call(program, `inspect`)) {
    return {
      port: getDebugPort(program.inspect),
      break: false,
    }
  } else if (Object.prototype.hasOwnProperty.call(program, `inspectBrk`)) {
    return {
      port: getDebugPort(program.inspectBrk),
      break: true,
    }
  } else {
    return null
  }
}
