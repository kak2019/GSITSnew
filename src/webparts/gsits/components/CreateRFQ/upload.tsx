/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { IconButton, Stack, mergeStyleSets } from '@fluentui/react';

interface FileUploadComponentProps {
  title: string;
  initalNum?: number;
  uploadTitle?: string;
  subtitle?: string;
  onFileSelect?: (files: File[]) => void; // 添加回调函数
}
const useStyles = mergeStyleSets({
  uploadArea: {
    border: '1px dashed #0078d4',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f3f9fc',
  },
  fileList: {
    marginTop: '10px',
    position: 'relative',
    height: '140px',
    overflow: 'hidden',
    overflowY: 'auto',
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e1dfdd',
    padding: '5px 10px',
    alignItems: 'center',
    height: '35px',
    boxSizing: 'border-box'
  },
  oddItem: {
    backgroundColor: '#fff',
  },
  evenItem: {
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontWeight: 'bold',
  },
  placeholder: {
    height: '120px',
    position: 'absolute',
    zIndex: 0,
    width: '100%'
  },
  front: {
    zIndex: 1
  }
});

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
                                                                   title,
                                                                   initalNum = 0, // 初始文件数量为0
                                                                   uploadTitle,
                                                                   subtitle, onFileSelect,
                                                                 }) => {
  // 初始化为一个空数组，不包含任何文件
  const [files, setFiles] = React.useState<File[]>([]);
  const classes = useStyles;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFiles = Array.from(event.target.files || []);
    const updatedFiles = [...files, ...newFiles];
    if (updatedFiles.length>10){
      alert("You can only upload up to 10 files."); // 提示用户
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // 调用回调函数，将文件传递给父组件
    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };


  const removeFile = (index: number): void => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    const updatedFiles = files.filter((_, i) => i !== index);
    // 调用回调函数，将更新后的文件列表传递给父组件
    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  return (
      <div>
        <span className={classes.title}>{title}</span>
        <div className={classes.uploadArea}>
          <input
              type="file"
              multiple
              style={{ display: 'none' }}
              id="file-input"
              onChange={handleFileUpload}
          />

          <label htmlFor="file-input" style={{ fontSize: '12px', width: '100%',height: '100%',display: 'flex',alignItems: 'center', cursor: 'pointer' }}>
            <IconButton iconProps={{ iconName: 'AttachIcon' }} style={{ width: '20px', height: '20px' }} />
            <div style={{display: 'inline-block'}}>
          <span role="img" aria-label="paperclip" style={{ fontWeight: 'bold', fontSize: '16px' ,marginRight:10}}>
            {uploadTitle ?? 'Click to Upload'}
          </span>
              {/* <br /> */}
              ({subtitle ?? 'File number limit: 10; Single file size limit: 10MB'})
            </div>
          </label>
        </div>

        <Stack className={classes.fileList}>
          <div className={classes.placeholder}>
            <div className={classes.fileItem + ' ' + classes.oddItem}/>
            <div className={classes.fileItem + ' ' + classes.evenItem}/>
            <div className={classes.fileItem + ' ' + classes.oddItem}/>
            <div className={classes.fileItem + ' ' + classes.evenItem}/>
          </div>
          {files.map((file, index) => (
              <div key={index} className={`${classes.fileItem} ${classes.front} ${index % 2 === 0 ? classes.evenItem : classes.oddItem}`}>
                {file.name}
                <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    onClick={() => removeFile(index)}
                />
              </div>
          ))}
        </Stack>
      </div>
  );
};

export default FileUploadComponent;
