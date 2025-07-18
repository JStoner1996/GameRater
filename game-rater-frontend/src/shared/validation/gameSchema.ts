import * as yup from "yup";

export const gameSchema = yup.object({
  title: yup.string().required(),
  gameplay: yup.number().required().min(0).max(10),
  story: yup.number().required().min(0).max(10),
  characters: yup.number().required().min(0).max(10),
  fun: yup.number().required().min(0).max(10),
  artGraphics: yup.number().required().min(0).max(10),
  personal: yup.number().required().min(0).max(10),
  yearCompleted: yup
    .number()
    .required()
    .min(1980)
    .max(new Date().getFullYear()),
});
