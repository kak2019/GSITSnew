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
}


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
      }
    },
  },

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
  searchbar,
  searchsection,
  
};

export default theme;