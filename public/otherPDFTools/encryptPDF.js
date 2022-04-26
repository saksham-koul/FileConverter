let convertButton = document.getElementById('encrypt_pdf_button')
convertButton.disabled = true
let fileInputButton = document.getElementById('fileInput_encrypt_pdf')
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

let pass = ''
let file

function handleButtons() {
    if (file !== undefined && pass.length > 0) {
        console.log("file input successful !", file)
        convertButton.disabled = false
        convertButton.onclick = async function () {
            loading.style.display = 'initial'
            fileInputButton.disabled = true
            convertButton.disabled = true
            await startConversion(file, 'pdf', 'encrypt', '', pass, emailId)
            loading.style.display = 'none'
            fileInputButton.disabled = false
            convertButton.disabled = false
        }
    } else {
        convertButton.disabled = true
        setupButtonContainer()
    }
}

fileInputButton.addEventListener('change', e => {
    file = e.currentTarget.files[0]
    handleButtons()
})

document.getElementById('encrypt_pass').addEventListener('change', e => {
    pass = e.target.value
    console.log(pass)
    handleButtons()
})
