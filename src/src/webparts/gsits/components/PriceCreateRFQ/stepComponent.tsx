import React from 'react';
import {t} from "i18next";
// 样式对象
const styles = {
    container: {
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'left',
        // height: '10vh',
        // backgroundColor: '#f0f0f0',
    },
};
const SvgWithText :React.FC= () => {
    return (
        <div style={styles.container}>
            <svg width="478" height="67" viewBox="0 0 478 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M199.5 61.5V1.5H438.62L475.618 31.0951L438.609 61.5H199.5Z" fill="#F6F6F6" stroke="#99CCFF" strokeWidth="3" />
                <path d="M1.5 61.5V1.5H201.711L238.621 31.0951L201.7 61.5H1.5Z" fill="white" stroke="#99CCFF" strokeWidth="3" />

                {/* 添加文本 */}
                <text x="33" y="25" textAnchor="middle" className="bold-text">{t('Step 1:')}</text>
                <text x="50" y="45" textAnchor="middle" className="normal-text">{t('Select Parts')}</text>

                <text x="283" y="25" textAnchor="middle" className="bold-text">{t('Step 2:')}</text>
                <text x="300" y="45" textAnchor="middle" className="normal-text">{t('Create RFQ')}</text>
            </svg>

            <style>{`
        .bold-text {
          font-family: Arial, sans-serif;
          font-size: 16px;
          fill: #333;
          font-weight: bold;
        }
        .normal-text {
          font-family: Arial, sans-serif;
          font-size: 16px;
          fill: #333;
          font-weight: normal;
        }
      `}</style>
        </div>
    );
};



export default SvgWithText;
