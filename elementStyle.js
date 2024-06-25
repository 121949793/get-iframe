const boxStyle = {
  position: 'fixed',
  top: '50px',
  right: '50px',
  width: '200px',
  height: '100px',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  zIndex: '10000',
  padding: '10px',
  overflowY: 'auto',
  resize: 'both',
  overflow: 'auto',
}

const btnStyle = {
  backgroundColor: '#70c0e8',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
}
const assignFun = (obj, style) => {
  for (const key in style) {
    obj[key] = style[key]
  }
  return obj
}