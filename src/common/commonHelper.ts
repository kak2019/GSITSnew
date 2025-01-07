import { IUDGSCommentModel } from "../model-v2/udgs-comment-model";

export const deepCopy = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};
export const getDecimalPlace = (InputNumber: string): number => {
  if (InputNumber.includes(".")) {
    return InputNumber.split(".")[1].length;
  }
  return 0;
};
export const parseDateFormat = (dateValue: Date): string => {
  const currentDate = new Date(dateValue);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};
export const parseNumberFixedDigit = (
  value: unknown,
  digit: number
): string => {
  if (value) {
    return Number(value).toFixed(digit);
  }
  return "";
};
export const parseNumberOptional = (data: string | undefined): number => {
  if (data) {
    return Number(data);
  }
  return Number.NaN;
};
export const escapeXmlChars = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};
export const isDoubleByte = (char: string): boolean => {
  const charCode = char.charCodeAt(0);
  return charCode > 255;
};
export const getLastCommentBy = (comments: string): string => {
  if (!comments) {
    return "";
  }
  const commentHistory: IUDGSCommentModel[] = JSON.parse(comments);
  if (commentHistory.length === 0) {
    return "";
  }
  commentHistory.sort((a, b) => {
    return (
      new Date(b.CommentDate).getTime() - new Date(a.CommentDate).getTime()
    );
  });
  // const options: Intl.DateTimeFormatOptions = {
  //   timeZone: "Asia/Tokyo",
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // };
  // const formattedDateString = new Intl.DateTimeFormat("js-JP", options).format(
  //   new Date(commentHistory[0].CommentDate)
  // );
  return `${parseDateFormat(new Date(commentHistory[0].CommentDate))} ${
    commentHistory[0].CommentBy
  }`;
};
