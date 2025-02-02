import { join } from 'path';
import fs from 'fs/promises';
import process from 'node:process';

export const removeFile = async (fileName: string, path: string = undefined) => {
  try {
    const srcStatic =
      process.env.BUILD === 'prod' ? join('/home/public') : join(__dirname, '..', '..', 'public');

    let pathToFile = join(srcStatic, fileName);
    if (path) pathToFile = join(srcStatic, path, fileName);

    return fs
      .unlink(pathToFile)
      .then(() => true)
      .catch(() => false);
  } catch (err) {
    console.error(err);
  }
};
