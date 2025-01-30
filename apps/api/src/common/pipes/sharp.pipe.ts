import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
  async transform(image: Express.Multer.File): Promise<string> {
    const pathToSave = 'public/images';

    const filename = 'img-' + uuidv4() + '.webp';

    if (!image) return;

    try {
      await sharp(image.buffer).webp({ quality: 80 }).toFile(path.join(pathToSave, filename));

      return filename;
    } catch (err) {
      console.log(err);
    }
  }
}
