/** @type {HTMLCanvasElement} */
let _canvas = {}
let _ctx = {}

export default class CanvasRenderer {
  /** @param {VideoFrame} frame */
  static drawFrame(frame) {
    const { displayWidth, displayHeight } = frame
    _canvas.width = displayWidth
    _canvas.height = displayHeight
    _ctx.drawImage(frame, 0, 0, displayWidth, displayHeight)
    frame.close()
  }

  static getRenderer(canvas) {
    _canvas = canvas
    _ctx = canvas.getContext('2d')

    const renderer = this
    let pendingFrame = null
    return (frame) => {
      const renderAnimationFrame = () => {
        renderer.drawFrame(pendingFrame)
        pendingFrame = null
      }

      if (pendingFrame) {
        pendingFrame.close()
      } else {
        requestAnimationFrame(renderAnimationFrame)
      }

      pendingFrame = frame
    }
  }
}
