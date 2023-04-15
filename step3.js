const fs = require('fs');
const process = require('process');
const axios = require('axios');

function returnOutput(txt, out) {
    if (out) {
        fs.writeFile(out, txt, 'utf8', (err) => {
            if (err) {
                console.error(`Could not write to ${out} due to ${err}`)
                process.exit(1)
            } 
        })
    } else {
        console.log(txt)
    }
}

function cat(path, out) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error in ${path}: ${err}`)
            process.exit(1)
        } else {
            returnOutput(data, out)
        }
    })
}

async function webCat(url, out) {
    try {
        let res = await axios.get(url)
        returnOutput(res.data, out)
    } 
    catch(err) {
        console.error(`Error when fetching ${url}: ${err}`)
        process.exit(1)
    }
}

let path;
let out;

if (process.argv[2] === '--out') {
    out = process.argv[3]
    path = process.argv[4]
} else {
    path = process.argv[2]
}

if (path.slice(0, 4) === 'http') {
    webCat(path, out)
} else {
    cat(path, out)
}