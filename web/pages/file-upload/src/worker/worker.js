onmessage = async () => {
  setTimeout(() => {
    self.postMessage({ status: 'done' })
  }, 5000)
}
