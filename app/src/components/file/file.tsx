import { useState, useCallback } from 'react';
import './style.css';
interface FileProps {
  item: {
    name: string;
    path: string;
    type: string;
    size: number | string;
  };
  handleDelete: (path: string) => void;
  show: any;
}

interface RenameProps {
  status: boolean;
  newName: null | string;
}
export const File: React.FC<FileProps> = ({ item, handleDelete, show }) => {
  const { name, path, type, size } = item;
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
    <section className="file" onClick={() => show(item)}>
      <div>
        <p>
          name: {name} path: {path} size: {size} type: {type}
        </p>
        <div>
          <button onClick={() => handleDelete(path)}>delete</button>
          <button onClick={() => changeName('status', null)}>rename</button>
        </div>
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
      </div>
    </section>
  );
};
