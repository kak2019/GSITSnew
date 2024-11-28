import { DefaultPalette } from "@fluentui/react";

// Define color palette
export const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  backgroundTitle: '#AAD6FA',
  backgroundForm: '#E1EFFC',
  text: '#2c3e50',
};

// Define font sizes
export const fontSizes = {
  small: '12px',
  medium: '16px',
  large: '20px',
  xLarge: '24px',
};

// Define spacing
export const spacing = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xLarge: '32px',
};

// Define other common styles
export const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
};

export const boxShadow = {
  light: '0 1px 3px rgba(0, 0, 0, 0.12)',
  medium: '0 3px 6px rgba(0, 0, 0, 0.16)',
  heavy: '0 10px 20px rgba(0, 0, 0, 0.19)',
};

export const detaillist = {
  detaillistheader: {
    margin: 0, // 去除标题栏的外边距
    padding: 0, // 去除标题栏的内边距
    backgroundColor: "#D6D7D6", // 设置标题栏为灰色
    border: `1px solid ${"#AFAFAF"}`, // 增加下边框
    cursor: "default",
  },

  detaillistheaderrow: {
    color: DefaultPalette.neutralPrimary, // 字体颜色
    fontWeight: "bold", // 加粗字体
    cursor: "default", // 禁用鼠标指针变化
    backgroundColor: "#D6D7D6", // 标题栏背景色
    ':hover': {
      backgroundColor: "#D6D7D6", // 保持悬浮时背景色不变
    },
    ':active': {
      backgroundColor: "#D6D7D6", // 移除按压时的颜色加深效果
    },
    ':focus': {
      outline: "none", // 移除聚焦时的边框
    },
  },
  header: {
    marginTop: 0,
    padding: 0,
    borderTop: `1px solid ${DefaultPalette.neutralLight}`,
    borderBottom: `1px solid ${DefaultPalette.neutralLight}`,
    borderRadius: "4px", // 圆角边框
  }
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
  padding: "10px 1.5%",
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)", // 五等分
  gridTemplateRows: "auto auto auto", // 固定为 3 行
  columnGap: "calc((100% - 2 * 1.5%) * 0.055)", // 搜索框间距占剩余空间的5.5%
  rowGap: "20px", // 行间距

  //gap: "5.5%",
  //columnGap: "repeat(5, 1fr)/4", // 控制每列的间距
}

// Export the theme
const theme = {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  boxShadow,
  detaillist,
  paginated,
  searchbar
};

export default theme;