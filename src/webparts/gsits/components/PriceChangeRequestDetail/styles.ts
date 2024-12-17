import { IDetailsListStyles } from "@fluentui/react";

export const buttonStyles = {
  root: {
    backgroundColor: "#99CCFF", // 设置按钮背景色，类似浅蓝色
    color: "black", // 设置文字颜色为黑色
    height: "36px", // 设置按钮高度
    border: "none", // 去掉边框
    borderRadius: "4px", // 设置按钮的圆角
  },
  rootHovered: {
    backgroundColor: "#0F6CBD", // 设置悬停时的背景色，更深的蓝色
    color: "white",
  },
  rootPressed: {
    backgroundColor: "#0F6CBD",
  },
};
export const addButtonStyles = {
  root: {
    backgroundColor: "#99CCFF", // 设置按钮背景色，类似浅蓝色
    height: "25px",
    borderRadius: "5px",
    minHeight: "25px",
    borderColor: "white",
    color: "black",
  },
  textContainer: { height: "100%" },
  label: { lineHeight: "25px" },
  rootHovered: {
    backgroundColor: "#0F6CBD", // 设置悬停时的背景色，更深的蓝色
    color: "white",
  },
  rootPressed: {
    backgroundColor: "#0F6CBD",
  },
};
export const inputCommentsStyles = {
  root: { width: "100%" },
  fieldGroup: {
    height: "25px",
  },
  field: {
    height: "100%",
    fontSize: "13px",
  },
};
export const commentHistoryStyles = {
  root: { width: "inherit" },
  field: {
    resize: "vertical",
    fontSize: "12px",
  },
};
export const detailsListStyles: IDetailsListStyles = {
  root: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  headerWrapper: {
    backgroundColor: "#AFAFAF",
    selectors: {
      ".ms-DetailsHeader": {
        backgroundColor: "#BDBDBD",
        fontWeight: 600,
      },
    },
  },
  contentWrapper: {},
  focusZone: {},
};
