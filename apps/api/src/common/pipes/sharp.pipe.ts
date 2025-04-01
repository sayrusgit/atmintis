import { Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File> {
  async transform(image: Express.Multer.File): Promise<Buffer> {
    if (!image) return;

    try {
      return await sharp(image.buffer).webp({ quality: 80 }).toBuffer();
    } catch (err) {
      console.log(err);
    }
  }
}
