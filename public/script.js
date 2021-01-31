function blobToDownloadLink(pdfBlob) {
  const linkSource = `data:application/pdf;base64,${pdfBlob}`
  const downloadLink = document.createElement('a')
  const fileName = 'screenshot.pdf'
  downloadLink.href = linkSource
  downloadLink.download = fileName
  const linkText = document.createTextNode('screenshot.pdf')
  downloadLink.appendChild(linkText)
  return downloadLink
}

document
  .querySelector('button[type="submit"]')
  .addEventListener('click', (e) => {
    e.preventDefault()

    const pageToPdf = document.getElementById('page').value

    if (!pageToPdf)
      return (document.getElementById('result').textContent =
        'Please enter a page URL')

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        pageToPdf,
      }),
    }

    document.getElementById('result').textContent = 'Please wait...'

    fetch('/.netlify/functions/take-screenshot', options)
      .then((res) => res.json())
      .then((res) => {
        if (!res.pdfBlob)
          return (document.getElementById('result').textContent =
            'Error no pdf blob in response')

        const link = blobToDownloadLink(res.pdfBlob)
        document.getElementById('result').innerHTML = link.outerHTML
      })
      .catch((err) => {
        console.log('Request error', err)
        document.getElementById(
          'result',
        ).textContent = `Error: ${err.toString()}`
      })
  })
