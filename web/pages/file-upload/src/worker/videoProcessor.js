export default class VideoProcessor {
  #mp4Demuxer

  /**
   *
   * @param {object} options
   * @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
   */
  constructor({ mp4Demuxer }) {
    this.#mp4Demuxer = mp4Demuxer
  }

  /** @returns {ReadableStream} */
  mp4Decoder(stream) {
    return new ReadableStream({
      start: async (controller) => {
        const decoder = new VideoDecoder({
          /** @param {VideoFrame} frame */
          output(frame) {
            controller.enqueue(frame)
          },
          error: (err) => {
            console.error('Something went wrong with mp4Decoder', err)
            controller.error(err)
          },
        })

        return this.#mp4Demuxer
          .run(stream, {
            async onConfig(config) {
              const { supported } = await VideoDecoder.isConfigSupported(config)
              if (!supported) {
                const message = 'Unsupported codec configuration'
                console.error(message, config)
                controller.error(new Error(message))
                return
              }
              decoder.configure(config)
            },
            /** @param {EncodedVideoChunk} chunk */
            onChunk(chunk) {
              decoder.decode(chunk)
            },
          })
          .then(() => {
            setTimeout(() => {
              controller.close()
            }, 2000)
          })
      },
    })
  }

  encode144p(config) {
    let _encoder

    const readable = new ReadableStream({
      start: async (controller) => {
        const { supported } = await VideoEncoder.isConfigSupported(config)
        if (!supported) {
          const message = 'Unsupported encoder configuration'
          console.error(message, config)
          controller.error(new Error(message))
          return
        }

        _encoder = new VideoEncoder({
          /**
           *
           * @param {EncodedVideoChunk} frame
           * @param {EncodedVideoChunkMetadata} config
           */
          output: (frame, config) => {
            if (config.decoderConfig) {
              const decoderConfig = {
                type: 'config',
                config: config.decoderConfig,
              }
              controller.enqueue(decoderConfig)
            }
            controller.enqueue(frame)
          },
          error: (err) => {
            console.error('VideoEncoder 144p', err)
            controller.error(err)
          },
        })

        _encoder.configure(config)
      },
    })

    const writable = new WritableStream({
      async write(frame) {
        _encoder.encode(frame)
        frame.close()
      },
    })

    return { readable, writable }
  }

  renderDecodedFramesAndGetEncodedChunks(renderFrame) {
    let _decoder
    return new TransformStream({
      start: (controller) => {
        _decoder = new VideoDecoder({
          output: (frame) => {
            renderFrame(frame)
            frame.close()
          },
          error: (err) => {
            console.error('VideoDecoder', err)
            controller.error(err)
          },
        })
      },
      /**
       *
       * @param {EncodedVideoChunk} encodedChunk
       * @param {TransformStreamDefaultController} controller
       */
      async transform(encodedChunk, controller) {
        if (encodedChunk.type === 'config') {
          await _decoder.configure(encodedChunk.config)
          return
        }
        _decoder.decode(encodedChunk)
        controller.enqueue(encodedChunk)
      },
    })
  }

  async process({ file, encoderConfig, renderFrame }) {
    const stream = file.stream()
    const fileName = file.name.split('/').pop().replace('.mp4', '')
    await this.mp4Decoder(stream)
      .pipeThrough(this.encode144p(encoderConfig))
      .pipeThrough(this.renderDecodedFramesAndGetEncodedChunks(renderFrame))
      .pipeTo(
        new WritableStream({
          write(frame) {},
        })
      )
  }
}
