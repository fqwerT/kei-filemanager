//import img from "../assets/img/img.svg";
//@ts-nocheck
import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { convert } from './utils';
import { File } from '../file/file';
export const Reader = () => {
  const [pickedFiles, setPickedFiles] = useState<null | any[]>('');

  const ipcRenderer = (window as any).ipcRenderer;

  const handleDelete = (path: any) => {
    // ipcRenderer.send('file:upload', { value: '123' });
    ipcRenderer.send('deleteFile', path);
  };

  const adaptedData = useMemo(() => {
    return convert(pickedFiles);
  }, [pickedFiles]);

  const onDrop = useCallback((acceptedFiles: any) => {
    setPickedFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // const deleteFile = (filePath) => {
  //   ipcRenderer.send("deleteFile", filePath);
  // };

  // const addFile = (filePath, data) => {
  //   ipcRenderer.send("addFile", { filePath, data });
  // };

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      {adaptedData &&
        adaptedData.map((item, index) => (
          <File
            key={index}
            name={item.name}
            path={item.path}
            type={item.type}
            size={item.size}
            handleDelete={handleDelete}
          />
        ))}
    </>
  );
};
