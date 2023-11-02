import WebMWriter from '../libs/webm-writer2.js'

import VideoProcessor from './videoProcessor.js'
import MP4Demuxer from './mp4Demuxer.js'
import CanvasRenderer from './canvasRenderer.js'
import Service from '../service/index.js'

const qvgaConstraints = { width: 320, height: 240 }
// @suggestion: we could use this constraints in the future
// const vgaConstraints = { width: 640, height: 480 }
// const hdConstraints = { width: 1280, height: 720 }

const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6,
  // -> WebM
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',

  // -> MP4
  // codec: 'avc1,42002A',
  // pt: 1,
  // hardwareAcceleration: 'prefer-hardware',
  // avc: { format: 'annexb' },
}

const webmWriterConfig = {
  ...qvgaConstraints,
  codec: 'VP9',
  bitrate: encoderConfig.bitrate,
}

const mp4Demuxer = new MP4Demuxer()
const webMWriter = new WebMWriter(webmWriterConfig)
const service = new Service({
  url: 'http://localhost:3000',
})
const videoProcessor = new VideoProcessor({ mp4Demuxer, webMWriter, service })

onmessage = async ({ data }) => {
  const renderFrame = CanvasRenderer.getRenderer(data.canvas)

  await videoProcessor.process({
    file: data.file,
    renderFrame,
    encoderConfig,
    sendMessage(message) {
      self.postMessage(message)
    },
  })

  self.postMessage({ status: 'done' })
}
