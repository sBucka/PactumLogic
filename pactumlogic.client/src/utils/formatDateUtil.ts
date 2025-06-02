export const formatDateUtil = (date: string, locale: string = "sk-SK") => {
  return new Date(date).toLocaleDateString(locale);
};
