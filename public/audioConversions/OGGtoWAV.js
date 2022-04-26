let convertButton = document.getElementById('ogg_to_wav_button')
convertButton.disabled = true
let fileInputButton = document.getElementById('fileInput_ogg_to_wav')
fileInputButton.disabled = false
let loading = document.getElementById('loader')
loading.style.display = 'none'
let emailCheckBox = document.getElementById('email-checkbox')
let emailTextBox = document.getElementById('email-textbox')
emailTextBox.style.display = 'none'

let emailId = ''

emailCheckBox.addEventListener('change', function () {
    if (this.checked) {
        console.log('Checked')
        emailTextBox.style.display = 'initial'
    } else {
        console.log('Not checked')
        emailTextBox.value = ''
        emailTextBox.style.display = 'none'
    }
})

emailTextBox.addEventListener('change', e => {
    emailId = e.target.value
    console.log(emailId)
})

fileInputButton.addEventListener('change', e => {
    let file = e.currentTarget.files[0]
    if (file !== undefined) {
        console.log("file input successful !", file)
        convertButton.disabled = false

        // todo: post request on server
        const formData = new FormData()
        formData.append('ogg_wav', file, file.name)
        convertButton.onclick = function () {
            loading.style.display = 'initial'
            convertButton.disabled = true
            fileInputButton.disabled = true
            const options = {
                method: 'POST',
                body: formData
            }
            fetch('/convert', options).then(response => {
                // console.log(response.json())
                response.json().then(result => {
                    console.log(result)
                    const data = {urls: [result.url], recipient: emailId, from: 'ogg', to: 'wav'}
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }
                    fetch('/email', options).then(response => console.log(response.json()))
                    let container = setupButtonContainer()
                    let btn = createButton('Download Audio', result.url)
                    container.appendChild(btn)
                    loading.style.display = 'none'
                    fileInputButton.disabled = false
                    convertButton.disabled = false
                })
            }).catch(e => console.log(e))
        }
    } else {
        convertButton.disabled = true
        setupButtonContainer()
    }
})
