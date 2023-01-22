import React from 'react'
import { Modal, Cascader, ButtonToolbar, Button, Loader, Placeholder, DatePicker } from 'rsuite';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ModalTodo from './Modal';


const data = [{ value: "harsh", label: "harsh" },
{ value: "raju", label: "raju" },
{ value: "pax", label: "pax" },
]
const Prioity = [{ value: "high", label: "high" },
{ value: "medium", label: "medium" },
{ value: "low", label: "low" },
]

function Todolist() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEntered = () => {
    setTimeout(() => setRows(80), 2000);
  };

  return (

    <>
    <div className="container" style={{zIndex:1000000}}>
    <Button onClick={handleOpen}>Open</Button>
      <ModalTodo
        open={open}
        onClose={handleClose}
        onEntered={handleEntered}
        data={data}
        Prioity={Prioity}
        
      />
    </div>
        
    </>

  );
}

export default Todolist