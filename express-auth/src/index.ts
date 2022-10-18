import app from './app'
import { config } from './utils/config'

app.listen(config.port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${config.port}`)
  /* eslint-enable no-console */
})
