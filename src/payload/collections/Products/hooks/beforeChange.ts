import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

const logs = true // Enable logging for debugging

export const beforeProductChange: BeforeChangeHook = async ({ req, data }) => {
  const { payload } = req
  const newDoc: Record<string, unknown> = { ...data, skipSync: false }

  if (logs) payload.logger.info(`Before change hook triggered with data: ${JSON.stringify(data)}`)

  // Explicitly preserve the price field
  if (data.price !== undefined) {
    newDoc.price = data.price
    newDoc.priceJSON = data.price // Assign price to priceJSON
    if (logs) payload.logger.info(`Setting newDoc.price to ${data.price}`)
  } else {
    if (logs) payload.logger.info(`data.price is undefined`)
  }

  // Include stock field if it exists
  if (data.stock !== undefined) {
    newDoc.stock = data.stock
    if (logs) payload.logger.info(`Setting newDoc.stock to ${data.stock}`)
  } else {
    if (logs) payload.logger.info(`data.stock is undefined`)
  }

  // Log the newDoc object before returning
  if (logs) payload.logger.info(`Final newDoc object: ${JSON.stringify(newDoc)}`)

  return newDoc
}
