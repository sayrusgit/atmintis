import { join } from 'path';
import fs from 'fs/promises';

export const removeFile = async (fileName: string, path: string = undefined) => {
  try {
    let pathToFile = join(__dirname, '..', '..', 'public', fileName);

    if (path) pathToFile = join(__dirname, '..', '..', 'public', path, fileName);

    return fs
      .unlink(pathToFile)
      .then(() => true)
      .catch(() => false);
  } catch (err) {
    console.error(err);
  }
};
