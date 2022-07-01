const ibm = require("ibm-cos-sdk")

const config = {
    endpoint: process.env.ENDPOINT,
    apiKeyId: process.env.API_KEY_ID,
    serviceInstanceId: process.env.SERVICE_INSTANCE_ID,
}

const cos = new ibm.S3(config)

async function getBucketContents(bucketName) {
    console.log(`Retrieving bucket contents from: ${bucketName}`);
    try {
        const data = await cos.listObjects(
            { Bucket: bucketName }).promise();
        if (data != null && data.Contents != null) {
            console.log(data);
            if (data.Contents.length === 0) {
                console.log("No hay elementos en el bucket");
            } else {
                for (var i = 0; i < data.Contents.length; i++) {
                    var itemKey = data.Contents[i].Key;
                    var itemSize = data.Contents[i].Size;
                    console.log(`Item: ${itemKey} (${itemSize} bytes).`);
                }
            }
        }
    } catch (e) {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    }
}

async function getBuckets() {
    console.log('Retrieving list of buckets');
    return await cos.listBuckets()
        .promise()
        .then((data) => {
            if (data.Buckets != null) {
                for (var i = 0; i < data.Buckets.length; i++) {
                    console.log(`Bucket Name: ${data.Buckets[i].Name}`);
                }
            }
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

function getItem(bucketName, itemName) {
    console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
    return cos.getObject({
        Bucket: bucketName, 
        Key: itemName
    }).promise()
    .then((data) => {
        if (data != null) {
            console.log('File Contents: ' + Buffer.from(data.Body).toString());
        }    
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

getBucketContents("codeengine-bucket-tests")