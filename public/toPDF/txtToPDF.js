let convertButton = document.getElementById('txt_to_pdf_button')
convertButton.disabled = true
let fileInputButton = document.getElementById('fileInput_txt_to_pdf')
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
        convertButton.onclick = async function () {
            loading.style.display = 'initial'
            convertButton.disabled = true
            fileInputButton.disabled = true
            await startConversion(file, 'txt', 'pdf', '', '', emailId)
            loading.style.display = 'none'
            fileInputButton.disabled = false
            convertButton.disabled = false
        }
    } else {
        convertButton.disabled = true
        setupButtonContainer()
    }
})
