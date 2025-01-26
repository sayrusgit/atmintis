import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Error } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const IMAGE_INTERCEPTOR_OPTIONS: MulterOptions = {
  fileFilter(
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp'
    ) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Invalid file type'), false);
    }
  },
  storage: memoryStorage(),
};

// export const IMAGE_INTERCEPTOR_OPTIONS: MulterOptions = {
//   fileFilter(
//     req: any,
//     file: Express.Multer.File,
//     callback: (error: Error | null, acceptFile: boolean) => void,
//   ) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       callback(null, true);
//     } else {
//       callback(new BadRequestException('Invalid file type'), false);
//     }
//   },
//   storage: diskStorage({
//     destination: './public',
//     filename(
//       req: Request,
//       file: Express.Multer.File,
//       callback: (error: Error | null, filename: string) => void,
//     ) {
//       const fileType = file.mimetype.split('/').at(-1);
//
//       callback(null, `pp-${uuidv4()}.${fileType}`);
//     },
//   }),
// };
