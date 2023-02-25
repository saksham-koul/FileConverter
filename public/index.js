const secretKey = 'Your ConvertAPI Key here'

let convertApi = ConvertApi.auth({secret: secretKey})

async function startConversion(fileToBeConverted, from, to, text = '', pass = '', recipient = '', buttonContainer = 'buttonContainer') {
    console.log("conversion started...", from, to, fileToBeConverted)
    try {
        let params = convertApi.createParams()
        if (to === "merge") {
            params.add('files', fileToBeConverted)
        } else params.add('file', fileToBeConverted)
        if (text.length !== 0) {
            params.add('text', text)
        }
        if (pass.length !== 0) {
            if (to === 'decrypt') params.add('Password', pass)
            else params.add('UserPassword', pass)
        }

        let container = setupButtonContainer(buttonContainer)

        let result = await convertApi.convert(from, to, params)
        let len = result.files.length

        let fileUrl
        let urls = []
        if (len === 1) {
            fileUrl = result.files[0].Url
            urls.push(fileUrl)
            console.log('conversion successful!', 'url = ', fileUrl)
            // Showing download button with the result file
            let btn = createButton('Download File', fileUrl);

            container.appendChild(btn);
        } else {
            for (let i = 0; i < len; i++) {
                fileUrl = result.files[i].Url
                urls.push(fileUrl)
                console.log('conversion successful!', 'url = ', fileUrl)
                // Showing download button with the result file
                let btn = createButton('Download Page ' + (i + 1) + ' of PDF', fileUrl, false);
                container.appendChild(btn);
            }
        }

        if (recipient.length !== 0) {
            const data = {urls: urls, recipient: recipient, from: from, to: to}
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch('/email', options).then(response => console.log(response.json()))
        }
    } catch (e) {
        let text
        if (to !== 'decrypt') text = "Something went wrong! Please try again later."
        else text = "Please enter correct password!"

        $('.error').text(text).fadeIn(400).delay(3000).fadeOut(400);
    } finally {
        document.documentElement.style.cursor = 'default'
    }
}

function setupButtonContainer(buttonContainer = 'buttonContainer') {
    let container = document.getElementById(buttonContainer);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    return container
}

function createButton(text, url, flag = true) {
    let btn = document.createElement('button');
    btn.textContent = text;
    if (flag === false) {
        btn.classList.add('split-btn')
    } else {
        btn.classList.add('download-btn')
    }

    btn.addEventListener("click", function () {
        location = url
    });
    return btn
}

