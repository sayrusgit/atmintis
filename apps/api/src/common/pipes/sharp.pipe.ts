import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'node:process';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return;

    const pathToSave = process.env.BUILD === 'prod' ? '/home/public/images' : 'public/images';

    const filename = 'img-' + uuidv4() + '.webp';

    try {
      await sharp(image.buffer).webp({ quality: 80 }).toFile(path.join(pathToSave, filename));

      return filename;
    } catch (err) {
      console.log(err);
    }
  }
}
