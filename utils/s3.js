import AWS from 'aws-sdk';

let s3 = null;
if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && process.env.S3_BUCKET) {
    s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        region: process.env.S3_REGION || undefined,
        endpoint: process.env.S3_ENDPOINT || undefined,
        s3ForcePathStyle: !!process.env.S3_ENDPOINT
    });
}

export function getSignedUrl(key) {
    if (!s3) {
        // fallback placeholder (frontend can show a "Download will be available after payment" page)
        return `${process.env.FRONTEND_URL || ''}/placeholder-download/${key}`;
    }
    const params = { Bucket: process.env.S3_BUCKET, Key: key, Expires: parseInt(process.env.DOWNLOAD_TTL_HOURS || '24', 10) * 3600 };
    return s3.getSignedUrl('getObject', params);
}
