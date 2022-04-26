let convertButton = document.getElementById('merge_pdf_button')
convertButton.disabled = true
let fileInputButton = document.getElementById('fileInput_merge_pdf')
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
    let file = e.currentTarget.files
    if (file.length > 0) {
        console.log("file input successful !", file)
        convertButton.disabled = false
        convertButton.onclick = async function () {
            loading.style.display = 'initial'
            fileInputButton.disabled = true
            convertButton.disabled = true
            await startConversion(file, 'pdf', 'merge', '', '', emailId)
            loading.style.display = 'none'
            convertButton.disabled = false
            fileInputButton.disabled = false
        }
    } else {
        console.log("no file selected!!")
        convertButton.disabled = true
        setupButtonContainer()
    }
})
