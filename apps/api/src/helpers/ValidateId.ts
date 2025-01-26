import mongoose from "mongoose";
import {BadRequestException} from "@nestjs/common";

export const validateId = (id: string) => {
  const isCorrect = mongoose.isValidObjectId(id);
  if (!isCorrect) throw new BadRequestException('Id is not valid');

  return true;
}