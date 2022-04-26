let convertButton = document.getElementById('m4a_to_mp3_button')
convertButton.disabled = true
let fileInputButton = document.getElementById('fileInput_m4a_to_mp3')
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
        formData.append('m4a_mp3', file, file.name)
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
                    const data = {urls: [result.url], recipient: emailId, from: 'm4a', to: 'mp3'}
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
