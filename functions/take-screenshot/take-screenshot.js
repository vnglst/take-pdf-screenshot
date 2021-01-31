const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context) => {
  const pageToPdf = JSON.parse(event.body).pageToPdf

  if (!pageToPdf)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Page URL not defined' }),
    }

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true, //chromium.headless,
  })

  const page = await browser.newPage()

  await page.goto(pageToPdf, { waitUntil: 'networkidle2' })

  const pdf = await page.pdf()

  await browser.close()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Pdf file ${pageToPdf}`,
      pdfBlob: pdf.toString('base64'),
    }),
  }
}
