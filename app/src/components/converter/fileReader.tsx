//import img from "../assets/img/img.svg";
//@ts-nocheck
import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { convert } from './utils';
import { File } from '../file/file';
import './style.css';
export const Reader = () => {
  const [pickedFiles, setPickedFiles] = useState<null | any[]>('');
  const [newFile, setNewFile] = useState<any>({
    name: null,
    value: null,
    content: null,
    status: false,
  });
  const [modal, setModal] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const ipcRenderer = (window as any).ipcRenderer;

  const handleDelete = (path: any) => {
    ipcRenderer.send('deleteFile', path);
  };

  const adaptedData = useMemo(() => {
    return convert(pickedFiles);
  }, [pickedFiles]);

  const onDrop = useCallback((acceptedFiles: any) => {
    setPickedFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCreateFile = (value, type) => {
    if (type === 'content') {
      setNewFile((prev) => {
        const updatedFile = {
          ...prev,
          content: value,
        };
        return updatedFile;
      });
    }

    if (type === 'name') {
      setNewFile((prev) => {
        const updatedFile = {
          ...prev,
          name: value,
        };
        return updatedFile;
      });
    }
  };

  const addFile = (data) => {
    const { name, content } = newFile;
    if ((name, content)) {
      const newPath = pickedFiles[0]?.path.replace(
        /\\[^\\]+$/,
        `\\${newFile.name}.txt`
      );

      ipcRenderer.send('addFile', { path: newPath, content: newFile.content });
    }
  };

  const showContent = useCallback((item: any) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      setContent({ content: fileContent, name: item.name });
    };

    reader.readAsText(item);
    setModal(!modal);
  }, []);

  return (
    <div className="fslayout">
      {' '}
      {modal && (
        <div className="modal">
          <article className="modal__window">
            <div className="modal__header">
              <h1>{content.name}</h1>
              <button onClick={() => setModal(false)}>close</button>
            </div>

            <p>{content.content}</p>
          </article>
        </div>
      )}
      <div {...getRootProps()} className="dragndrop">
        <div className="dragndrop__header">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>
      <div className="files">
        {adaptedData &&
          adaptedData.map((item, index) => (
            <File
              key={index}
              item={item}
              handleDelete={handleDelete}
              show={showContent}
            />
          ))}
      </div>
      {pickedFiles && (
        <div className="addingfile">
          <p className="addingfile__heading">Adding File</p>
          <p className="addingfile__attention">
            Future File Format When Created:txt
          </p>
          <section className="addingfile__controlls">
            <label htmlFor="name" className="addingfile__label">
              filename:
            </label>
            <textarea
              id="name"
              onChange={(e) => handleCreateFile(e.target.value, 'name')}
              className="addingfile__input"
            />
            <label htmlFor="content" className="addingfile__label">
              content:
            </label>
            <textarea
              id="content"
              className="addingfile__input"
              onChange={(e) => handleCreateFile(e.target.value, 'content')}
            />
          </section>
          <div className="addingfile__result">
            <p>result: name - {newFile.name}.txt </p>
            <button onClick={() => addFile()}>create</button>
          </div>
        </div>
      )}
    </div>
  );
};
