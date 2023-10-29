import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'fs'
import { join } from 'path'
import Busboy from 'busboy'

import { logger } from './util.js'

export default class UploadHandler {
  #downloadsFolder
  constructor({ downloadsFolder }) {
    this.#downloadsFolder = downloadsFolder
  }

  registerEvents(headers, onFinish) {
    const busboy = Busboy({ headers })

    busboy.on('file', this.#onFile.bind(this))

    busboy.on('finish', onFinish)

    return busboy
  }

  async #onFile(name, file, { filename, encoding, mimeType }) {
    const saveFileTo = join(this.#downloadsFolder, name)
    logger.info('Uploading: ' + saveFileTo)

    await pipeline(file, createWriteStream(saveFileTo))

    logger.info(`File [${name}] finished!`)
  }
}
