import React from 'react'
import { Modal, Cascader, ButtonToolbar, Button, Loader, Placeholder, DatePicker } from 'rsuite';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function ModalTodo({
    open,
    onClose,
    onEntered,data,Prioity
}) {

  const[state , setState] = React.useState({
    
  })
  
    return (
    
      <>
        <Modal
          open={open}
          onClose={onClose}
          onEntered={onEntered}
          style={{zIndex:1000000}}
        >
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextField id="outlined-basic" placeholder='todo ' label="Outlined" variant="outlined" />
            <TextField id="outlined-basic" placeholder='description' label="Outlined" variant="outlined" />
            <Cascader data={data}
              onSelect={(e) => console.log(e)}
              style={{ width: 224 , zIndex:1 , position:"absolute" }} />
              <Cascader data={Prioity}
              onSelect={(e) => console.log(e)}
              style={{ width: 224 }} />
               <DatePicker format="yyyy-MM-dd HH:mm:ss" />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose} appearance="primary">
              Ok
            </Button>
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        </>
      
    );
  }
  
  export default ModalTodo