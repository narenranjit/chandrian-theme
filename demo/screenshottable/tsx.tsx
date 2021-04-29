import React, { useState } from "react"

interface Props {
  children: (x: number, y: number) => JSX.Element | null
}
function Mouse({ children }: Props) {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    something: undefined
  })
  if (process.env.DEVELOPMENT) {
    return null
  }
  function handleMouseMove(event: React.MouseEvent<HTMLDivElement,MouseEvent>){
    setState({
      x: event.clientX,
      y: event.clientY,
    })
  }
  return (
    <div
      style={{ height: "100%", position: "relative" }}
      onMouseMove={handleMouseMove}
    >
      <a href="google.com">Google</a>
      <BigComponent type="huge" />
      {children(state.x, state.y)}
    </div>
  )
}
export default Mouse
