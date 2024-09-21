import { Injectable } from '@nestjs/common';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_S3_REGION,
    });
  }

  async uploadFile(file) {
    if (!file) {
      return '';
    }

    if (!file?.originalname) {
      throw new Error('File name is required.');
    }

    const randomImageName = (bytes = 32) =>
      crypto.randomBytes(bytes).toString('hex');

    const res = randomImageName();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKE_NAME,
        Key: res,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      }),
    );

    return res;
  }

  async deleteImage(fileName: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKE_NAME,
        Key: fileName,
      }),
    );
  }
}
