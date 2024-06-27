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
  fontWeight: '300',
  fontSize: '13px',
  fontFamily: '"Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
  textDecoration: 'none',
  textAlign: 'center',
  lineHeight: '27px',
  height: '27px',
  padding: '0 10px',
  margin: '0',
  display: 'inline-block',
  appearance: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box',
  backgroundColor: '#1B9AF7',
  color: '#FFF',
  borderRadius: '4px',
  margin: '4px 7px 0 0'
}
const assignFun = (obj, style) => {
  for (const key in style) {
    obj[key] = style[key]
  }
  return obj
}