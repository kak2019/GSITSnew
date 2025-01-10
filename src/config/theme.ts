import {
  DefaultPalette,
  IDetailsListStyles,
  ITextFieldStyles,
} from "@fluentui/react";

// Define color palette
export const colors = {
  primary: "#3498db",
  secondary: "#2ecc71",
  accent: "#e74c3c",
  backgroundTitle: "#AAD6FA",
  backgroundForm: "#E1EFFC",
  text: "#2c3e50",
};

// Define font sizes
export const fontSizes = {
  small: "12px",
  medium: "16px",
  large: "20px",
  xLarge: "24px",
};

// Define spacing
export const spacing = {
  small: "8px",
  medium: "16px",
  large: "24px",
  xLarge: "32px",
};

// Define other common styles
export const borderRadius = {
  small: "4px",
  medium: "8px",
  large: "12px",
};

export const boxShadow = {
  light: "0 1px 3px rgba(0, 0, 0, 0.12)",
  medium: "0 3px 6px rgba(0, 0, 0, 0.16)",
  heavy: "0 10px 20px rgba(0, 0, 0, 0.19)",
};

export const detaillist = {
  root: {
    width: "100%", // 确保宽度自适应容器
  },
  contentWrapper: {
    minHeight: "300px", // 确保内容区域有最小高度
  },
  headerWrapper: {
    selectors: {
      ".ms-DetailsHeader": {
        margin: 0,
        padding: 0,
        backgroundColor: "#D6D7D6", // 设置默认背景色
        border: "1px solid #AFAFAF",
        cursor: "default",
      },
      ".ms-DetailsHeader-cell": {
        backgroundColor: "#D6D7D6", // 设置列标题默认背景色
        selectors: {
          ":hover": {
            backgroundColor: "#D6D7D6", // 保持悬浮时背景色不变
          },
          ":active": {
            backgroundColor: "#D6D7D6", // 保持点击时背景色不变
          },
        },
      },
      ".ms-DetailsHeader-cellName": {
        color: DefaultPalette.neutralPrimary,
        whiteSpace: "wrap",
        wordWrap: "break-word",
        cursor: "default",
        backgroundColor: "#D6D7D6",
        selectors: {
          ":hover": {
            backgroundColor: "#D6D7D6", // 保持悬浮时背景色不变
          },
          ":active": {
            backgroundColor: "#D6D7D6", // 保持按压时背景色不变
          },
          ":focus": {
            outline: "none", // 移除聚焦时的边框
          },
        },
      },
    },
  },
};

export const paginated = {
  paginatedbackground: {
    marginTop: 0,
    justifyContent: "flex-end",
    backgroundColor: "#D6D7D6",
  },
  paginatedicon: {
    root: {
      backgroundColor: "#D6D7D6", // 设置按钮背景色为灰色
      color: "#000", // 设置图标颜色为黑色
      borderRadius: "4px", // 圆角
      boder: "1px solid #AFAFAF",
    },
    icon: {
      color: "#000", // 图标颜色为黑色
    },
    rootHovered: {
      backgroundColor: "#D6D7D6", // 设置按钮背景色为灰色
      color: "#000", // 悬浮时图标颜色
      boder: "1px solid #AFAFAF",
    },
    rootDisabled: {
      backgroundColor: "#D6D7D6", // 设置按钮背景色为灰色
      color: "#808080", // 禁用时图标颜色
    },
  },
};

export const searchbar = {
  background: "#CCEEFF",
  paddingTop: 0,
  padding: "10px 1.5%",
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)", // 五等分
  gridTemplateRows: "auto auto auto", // 固定为 3 行
  columnGap: "calc((100% - 2 * 1.5%) * 0.055)", // 搜索框间距占剩余空间的5.5%
  rowGap: "20px", // 行间距

  //gap: "5.5%",
  //columnGap: "repeat(5, 1fr)/4", // 控制每列的间距
};

export const searchbarforPriceChange = {
  background: "#CCEEFF",
  paddingTop: 0,
  padding: "8px 1.5%",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)", // 五等分
  //gridTemplateRows: "auto auto auto", // 固定为 3 行
  columnGap: "calc((100% - 2 * 1.5%) * 0.085)", // 搜索框间距占剩余空间的5.5%
  rowGap: "5px", // 行间距

  //gap: "5.5%",
  //columnGap: "repeat(5, 1fr)/4", // 控制每列的间距
};
export const DropDownfieldStyles = {
  root: {
    width: "100%", // 让搜索框宽度占满父容器
    // maxWidth: "300px", // 可选：最大宽度限制
    // marginBottom: "10px",
  },
  // fieldGroup: {
  //   height: "28px", // 控制输入框外框高度（让高度变矮）
  //   borderRadius: "4px", // 圆角边框
  // },
  title: {
    height: "30px",
    fontSize: "12px",
  },
  label: {
    fontSize: "12px", // 标签字体大小变小
  },
};
export const TextfieldStyles = {
  root: {
    width: "100%", // 让搜索框宽度占满父容器
  },
  // fieldGroup: {
  //   height: "28px", // 控制输入框外框高度（让高度变矮）
  //   borderRadius: "4px", // 圆角边框
  // },
  field: {
    height: "30px",
    fontSize: "12px",
  },
  label: {
    fontSize: "12px", // 标签字体大小变小
  },
};

export const datePickerStyles = {
  root: {
    width: "100%",
    // maxWidth: "300px",
    // marginBottom: "10px",
  },
  Field: {
    height: "28px", // 控制输入框高度
    fontSize: "12px",
  },

  callout: {
    fontSize: "12px", // 日期选择器的字体大小
  },
};

export const searchsection = {
  root: {
    backgroundColor: "white",
    padding: "0px 0px",
    cursor: "pointer",

    marginTop: "0px",
    marginBottom: "0px",
    selectors: {
      "& > :not(:first-child)": {
        marginTop: "10px", // 修改 margin-top 为 10px
      },
    },
  },
};

export const buttonStyles = {
  root: {
    backgroundColor: "#99CCFF", // 设置按钮背景色，类似浅蓝色
    color: "black", // 设置文字颜色为黑色
    width: "100px", // 设置按钮宽度
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

export const priceBreakdownStyles = {
  textField: {
    fieldGroup: {
      height: "25px",
    },
    errorMessage: { paddingTop: "0px" },
    field: {
      height: "100%",
      fontSize: "13px",
    },
    root: { width: "15vi" },
  },
  textFieldShort: {
    fieldGroup: {
      height: "25px",
    },
    errorMessage: { paddingTop: "0px" },
    field: {
      height: "100%",
      fontSize: "13px",
    },
    root: { width: "11vi" },
  },
  textFieldComment: {
    fieldGroup: {
      height: "25px",
    },
    field: {
      height: "100%",
      fontSize: "13px",
    },
    root: { width: "100%" },
  },
  textFieldMultiline: {
    field: {
      resize: "vertical",
      overflow: "auto",
      fontSize: "12px",
    },
    root: { width: "inherit" },
  } as ITextFieldStyles,
  dropdown: {
    title: {
      height: "25px",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
    },
    caretDownWrapper: {
      height: "25px",
      display: "flex",
      alignItems: "center",
    },
    errorMessage: { paddingTop: "0px" },
    root: {
      width: "15vi",
    },
  },
  buttonDefault: {
    root: {
      height: "30px",
      borderRadius: "5px",
      minHeight: "30px",
    },
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  },
  buttonPrimary: {
    root: {
      height: "30px",
      width: "120px",
      borderRadius: "5px",
      minHeight: "30px",
    },
    rootHovered: {},
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  },
  buttonPrimarySmall: {
    root: {
      height: "25px",
      borderRadius: "5px",
      minHeight: "25px",
    },
    textContainer: { height: "100%" },
    label: { lineHeight: "25px" },
  },
  buttonDialogBox: {
    root: {
      height: "30px",
      borderRadius: "5px",
      minHeight: "30px",
      paddingLeft: "20px",
    },
    rootHovered: {},
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  },
  icon: {
    root: {
      paddingLeft: "5px",
      fontSize: "10px",
      paddingTop: "4px",
      verticalAlign: "Top",
    },
  },
  detailsList: {
    root: {
      width: "95%",
      border: "1px solid #ccc",
      overflow: "visible",
    },
    headerWrapper: {},
    contentWrapper: {},
    focusZone: {},
  } as IDetailsListStyles,
  detailsListDialogBox: {
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
  } as IDetailsListStyles,
};
export const priceChangePriceBreakdownStyles = {
  textField: {
    fieldGroup: {
      height: "22px",
    },
    errorMessage: { paddingTop: "0px" },
    field: {
      height: "100%",
      fontSize: "11px",
    },
    root: { width: "12vi" },
  },
  textFieldComment: {
    fieldGroup: {
      height: "22px",
    },
    field: {
      height: "100%",
      fontSize: "11px",
    },
    root: { width: "100%" },
  },
  textFieldMultiline: {
    field: {
      resize: "vertical",
      overflow: "auto",
      fontSize: "12px",
    },
    root: { width: "inherit" },
  } as ITextFieldStyles,
  dropdown: {
    title: {
      height: "25px",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
    },
    caretDownWrapper: {
      height: "25px",
      display: "flex",
      alignItems: "center",
    },
    errorMessage: { paddingTop: "0px" },
    root: {
      width: "12vi",
    },
  },
  buttonDefault: {
    root: {
      height: "30px",
      borderRadius: "5px",
      minHeight: "30px",
    },
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  },
  buttonPrimary: {
    root: {
      height: "30px",
      width: "120px",
      borderRadius: "5px",
      minHeight: "30px",
    },
    rootHovered: {},
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  },
  buttonPrimarySmall: {
    root: {
      height: "25px",
      borderRadius: "5px",
      minHeight: "25px",
    },
    textContainer: { height: "100%" },
    label: { lineHeight: "25px" },
  },
  buttonDialogBox: {
    root: {
      height: "30px",
      borderRadius: "5px",
      minHeight: "30px",
      paddingLeft: "20px",
    },
    rootHovered: {},
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  },
  icon: {
    root: {
      paddingLeft: "5px",
      fontSize: "10px",
      paddingTop: "4px",
      verticalAlign: "Top",
    },
  },
  detailsList: {
    root: {
      width: "95%",
      border: "1px solid #ccc",
      overflow: "visible",
    },
    headerWrapper: {},
    contentWrapper: {},
    focusZone: {},
  } as IDetailsListStyles,
  detailsListDialogBox: {
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
  } as IDetailsListStyles,
};
// Export the theme
const theme = {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  boxShadow,
  detaillist,
  paginated,
  searchbar,
  searchsection,
  searchbarforPriceChange,
  buttonStyles,
  DropDownfieldStyles,
  datePickerStyles,
  TextfieldStyles,
};

export default theme;
