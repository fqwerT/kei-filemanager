import { useState, useCallback } from 'react';

interface FileProps {
  name: string;
  path: string;
  type: string;
  size: number | string;
  handleDelete: (path: string) => void;
}

interface RenameProps {
  status: boolean;
  newName: null | string;
}
export const File: React.FC<FileProps> = ({
  name,
  path,
  type,
  size,
  handleDelete,
}) => {
  const [fileName, setFileName] = useState<RenameProps>({
    status: false,
    newName: null,
  });
  const ipcRenderer = (window as any).ipcRenderer;
  const changeName = useCallback((type: string, value: null | string) => {
    if (type === 'status') {
      setFileName((prev) => {
        return { ...prev, status: !prev.status };
      });
    }
    if (type === 'value') {
      setFileName((prev) => {
        console.log(prev);
        return { ...prev, newName: value };
      });
    }
  }, []);

  const renameFile = (oldPath: string, name: string | null) => {
    //@ts-ignore
    const newPath = path.replace(/\\[^\\]+$/, `\\${name}`);
    ipcRenderer.send('renameFile', { oldPath, newPath });
  };

  return (
    <section className="file">
      <p id="name">{name}</p> <p>{path}</p> <p>{size}</p>
      <p>{type}</p>
      <button onClick={() => handleDelete(path)}>delete</button>
      <button onClick={() => changeName('status', null)}>rename</button>
      {fileName.status && (
        <section>
          <input onChange={(e) => changeName('value', e.target.value)} />
          <button
            onClick={() => renameFile(path, fileName.newName)}
            disabled={!fileName.newName}
          >
            ok
          </button>
        </section>
      )}
    </section>
  );
};
