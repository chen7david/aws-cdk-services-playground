export const handler = async (): Promise<any> => {
  return {
    isBase64Encoded: false,
    body: JSON.stringify([
      {
        id: 1,
        name: 'browser-db'
      },
      {
        id: 2,
        name: 'code-editor-db'
      }
    ]),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  }
}
