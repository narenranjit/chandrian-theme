import React, { useState } from "react"
interface Props {
  children: (x: number, y: number) => JSX.Element | null
}

const Mouse: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
  })
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
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
      {children(state.x, state.y)}
    </div>
  )
}
export default Mouse
