const express = require('express')
const fileUpload = require('express-fileupload')
const CloudConvert = require('cloudconvert')
const fs = require('fs')
require('dotenv').config()

const app = express()
app.listen(3000, () => console.log("listening on port 3000"))
app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))

app.use(fileUpload())
const sgMail = require('@sendgrid/mail')
const http = require("http");
const SG_API_KEY = process.env.SENDGRID_API_KEY
const CLOUD_CONVERT_API_KEY = process.env.CLOUD_CONVERT_API_KEY
const CLOUD_CONVERT_SANDBOX_KEY = process.env.CLOUD_CONVERT_SANDBOX_KEY

sgMail.setApiKey(SG_API_KEY)
const senderID = process.env.SENDER_ID

app.post('/email', (request, response) => {
    console.log(request.body)
    const data = request.body
    let body = ''
    data.urls.forEach(url => {
        body += '<a href="' + url + '"> Download File </a><br>'
    })
    const msg = {
        to: data.recipient, // Change to your recipient
        from: senderID, // Change to your verified sender
        subject: data.from + ' file successfully converted to ' + data.to,
        text: request.body.url,
        html: body,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
})

const cloudConvert = new CloudConvert(CLOUD_CONVERT_API_KEY)
app.post('/convert', async (request, response) => {
    const data = request.files
    console.log(data)
    let file_name
    let to
    let from
    for (let i in data) {
        // console.log(i)
        let file = data[i]
        let fromTo = i.split('_')
        from = fromTo[0]
        to = fromTo[1]
        file_name = file.name
        let buffer = file.data
        fs.open(file_name, 'w', function (err, fd) {
            if (err) {
                throw 'could not open file: ' + err;

            }
            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
            fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('wrote the file successfully');
                });
            });
        });
    }

    let conversionDict = {
        "operation": "convert",
        "input_format": from,
        "output_format": to,
        "engine": 'ffmpeg',
        "input": [
            "import_task"
        ]
    }
    if (from === 'mp3') {
        conversionDict['audio_bitrate'] = 128
        if (to === 'wav') {
            conversionDict['audio_codec'] = 'pcm_s16le'
        } else conversionDict['audio_codec'] = 'aac'
    } else if (from === 'wav') {
        conversionDict['audio_codec'] = 'mp3'
        conversionDict['audio_qscale'] = 0
    } else if (from === 'ogg') {
        if (to === 'mp3') {
            conversionDict['audio_codec'] = 'mp3'
            conversionDict['audio_qscale'] = 0
        } else {
            conversionDict['audio_codec'] = 'copy'
            conversionDict['audio_bitrate'] = 128
        }
    } else if (from === 'm4a') {
        conversionDict['audio_codec'] = 'mp3'
        conversionDict['audio_qscale'] = 0
    } else {
        conversionDict['video_codec'] = 'x264'
        conversionDict['crf'] = 23
        conversionDict['preset'] = 'medium'
        conversionDict['subtitles_mode'] = 'none'
        conversionDict['audio_codec'] = 'aac'
        conversionDict['audio_bitrate'] = 128
    }
    let job = await cloudConvert.jobs.create({
        "tasks": {
            "import_task": {
                "operation": "import/upload"
            },
            "conversion_task": conversionDict,
            "export_task": {
                "operation": "export/url",
                "input": [
                    "conversion_task"
                ],
                "inline": false,
                "archive_multiple_files": false
            }
        },
    });

    const uploadTask = job.tasks.filter(task => task.name === 'import_task')[0]
    const inputFile = fs.createReadStream('./' + file_name)
    await cloudConvert.tasks.upload(uploadTask, inputFile, file_name);

    job = await cloudConvert.jobs.wait(job.id)
    const exportTask = job.tasks.filter(task => task.operation === 'export/url' && task.status === 'finished')[0];
    const file = exportTask.result.files[0];
    console.log(file)

    // const writeStream = fs.createWriteStream('./out/' + file.filename);
    //
    // http.get(file.url, function(response) {
    //     response.pipe(writeStream);
    // });
    //
    // await new Promise((resolve, reject) => {
    //     writeStream.on('finish', resolve);
    //     writeStream.on('error', reject);
    // });

    response.writeHead(200, {
        'Content-Type': 'application/json'
    })
    response.end(JSON.stringify({status: 'success', url: file.url}))
})