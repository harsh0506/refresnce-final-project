import axios from 'axios'
import React from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined, FireTwoTone } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Modal, Toggle, Cascader, ButtonToolbar, Button, Loader, Placeholder, DatePicker } from 'rsuite';


const { Meta } = Card;

const Prioity = [{ value: "high", label: "high" },
{ value: "medium", label: "medium" },
{ value: "low", label: "low" },
]

const Colors = {
    "high": "red",
    "medium": "orange",
    "loe": "yellow"
}

const schema = {
    _id:"",
    color:"",
    dateOfActualSubmission: "",
    taskName: "",
    priority: "",
    userId: "",
    userName: "",
    SubmissionDate: "",
    progress: "0",
    dateOfCreation: "",
    taskId: ""
}

function DummyTask1() {

    const [Tasks, setTasks] = React.useState([{_id:"",...schema}])

    const [state, setState] = React.useState(schema)

    const [error, setError] = React.useState()

    const [personal, setPersonal] = React.useState(true)

    const [teamAdminId, setTeamAdminId] = React.useState("")

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = (ele) => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        HandleSubmit(state._id)
    };
    const handleCancel = () => {
        console.log(state)
        setIsModalOpen(false);
    };

    React.useEffect(() => {
        GetCalendarEvents().then((res) => {
            setTasks(res[0])
            setTeamAdminId(res[1])
            setPersonal(res[2])
        }).catch(err => setError(err.message))
    }, [])

    async function HandleSubmit( ) {
        try {
            if(state._id !== "" ){
                const info = {
                    Tid:state._id,
                    data : {
                        "TaskList.$.taskName":state.taskName,
                        "TaskList.$.priority":state.priority,
                        "TaskList.$.SubmissionDate":state.SubmissionDate,
                        "TaskList.$.dateOfCreation":state.dateOfCreation,
                    }
                }
                const mj = await UpdateTask("63ac28cbf8f9aa38a853831b" , info)
                console.log(mj)
            }
            else{

            
            setState(prev => {
                return {
                    ...prev, 
                    userId: teamAdminId
                }
            })
            const res = await SendData({ "TaskList": state })
            console.log(res)
        }
        } catch (error) {
            console.log(error)
        }
    }
    
// yet to be implemented 
    async function HandleUpdateData(ele){
        try {
            console.log(ele)
            setState(ele)
            setIsModalOpen(true);
        } catch (error) {
            console.log(error)
        }
    }

    if (error) { return (<p>{error}</p>) }

    return (
        <div className='container'>

            <div className="container">
                <button onClick={showModal}>Create event</button>
                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                    <LocalizationProvider dateAdapter={AdapterMoment}>

                        <TextField
                            label="TaskNAme"
                            value={state.taskName}
                            onChange={(e) => setState(prev => { return { ...prev, taskName: e.target.value } })}
                        />
                        {/* to set creation date */}
                        <DateTimePicker
                            label="Date&Time picker"
                            value={state.dateOfCreation}
                            onChange={(e) => setState(prev => { return { ...prev, dateOfCreation: e._d } })}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        {/* to set submisson date */}
                        <DateTimePicker
                            label="Date&Time picker"
                            value={state.SubmissionDate}
                            onChange={(e) => setState(prev => { return { ...prev, SubmissionDate: e._d } })}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        {/* add priotiry drop down */}
                        <Cascader
                            placeholder="priority"
                            data={Prioity}
                            onSelect={(e) => setState({ ...state, priority: e.value })}
                            style={{ width: 224, color: "black" }} />

                        <Button type="primary" onClick={handleCancel}>
                            x
                        </Button> 
                        <Button type="primary" onClick={handleOk}>
                            Submit
                        </Button>
                        

                    </LocalizationProvider>
                </Modal>
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

                {
                    Tasks[0].taskName === "" ? <p>No task and Create some</p> : Tasks.map((ele) => {
                        return (<div className="col ">
                            <Card
                                style={{
                                    width: 300,
                                    background: "pink"
                                }}

                                actions={[
                                    <SettingOutlined key="setting" onClick={() => DeleteItem("63ac28cbf8f9aa38a853831b", {"Parentkey": ele._id}, "639e9934d84d032b0879a0c9" , ele.userId)} />,
                                    <EditOutlined key="edit" onClick={() => HandleUpdateData(ele)}/>,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                    title={ele.taskName}
                                    description="This is the description"
                                />
                                <div className="row">
                                    <span>priority</span>
                                    <FireTwoTone style={{ width: 5 }} twoToneColor={ele.color} />
                                </div>
                                <div className="d-flex p-1 m-1 container">
                                    {/*Remaining days
                                            the text color must change as per remianing days value i.e if small number then it can be red as date of submission is close and if number is big then it can be green to show we still time
                                            it is yet to implemet
                                            */}
                                    <div className="row">
                                        <span>remaining Days</span>
                                        <p>{
                                            Math.round((new Date(ele.SubmissionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 1
                                        }</p>
                                    </div>
                                </div>
                            </Card>
                        </div>)
                    })
                }</div>
        </div>
    )
}

export default DummyTask1

//api  call to get all the data of project  mainly tasklist
export async function GetCalendarEvents(id) {
    const _id = "63ac28cbf8f9aa38a853831b"
    const Tasks = await (await axios.get(`http://localhost:4000/projects/Tasks/${_id}`)).data
    return [Tasks.TaskList, Tasks.teamAdminId, Tasks.personal]
}

export async function SendData(d) {
    try {
        const Pid = "345637"
        const res = await (await axios.put(`http://localhost:4000/projects/arrAdd/${Pid}`, d)).data[0].TaskList
        return res
    } catch (error) {
        return error
    }
}
/* 
The person who has been assigned the task can delete the that task, 
for achieving that the code must check if the user id of the current task is equal to the user id of the assigned user
if same they can delete the task else error will be thrown.
*/


export async function DeleteItem(id, d, Uid, Utid){
    try {
        if(Uid === Utid){
            const data = await axios.put(`http://localhost:4000/projects/projDelete/${id}`, d)
            alert("Deleted Successfully")
            return data
        } else{
            alert("You are not allowed")
            return "You are not allowed"
        }
        
    } catch (error) {
        return error
    }
}

export async function UpdateTask(Pid, data){
    try {
        let Pid = "63ac28cbf8f9aa38a853831b"
        const m = await (await axios.put(`http://localhost:4000/projects/arrayUpdateAll/${Pid}`, data)).data

        return m

    } catch (error) {
        return error
    }

}