import React, { useRef } from 'react'

interface FileUploadProps {
  setFile: Function
  accept: string
  id: string
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile, accept, children, id }) => {
  const ref = useRef<HTMLInputElement>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div onClick={() => ref.current !== null && ref.current.click()}>
      <input
        id={id}
        type='file'
        accept={accept}
        style={{ display: 'none' }}
        ref={ref}
        onChange={onChange}
      />
      {children}
    </div>
  )
}

export default FileUpload
