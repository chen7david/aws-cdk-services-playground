export const handler = async (): Promise<any> => {
  return {
    isBase64Encoded: false,
    body: JSON.stringify([
      {
        id: 1,
        name: 'browser'
      },
      {
        id: 2,
        name: 'code-editor'
      }
    ]),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  }
}
