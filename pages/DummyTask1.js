import axios from 'axios'
import React from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, CloseCircleTwoTone, CheckCircleOutlined, FireTwoTone } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Modal, Toggle, Cascader, ButtonToolbar, Button, Loader, Placeholder, DatePicker } from 'rsuite';
import Divider from '@mui/material/Divider';

const { Meta } = Card;

const Prioity = [{ value: "high", label: "high" },
{ value: "medium", label: "medium" },
{ value: "low", label: "low" },
]

const schema = {

    color: "",
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

    const [assigedTask, setAssignedTask] = React.useState([{ _id: "", ...schema }])

    const [completedTask, setCompletedTask] = React.useState([{ _id: "", ...schema }])

    const [state, setState] = React.useState(schema )

    const [error, setError] = React.useState()

    const [personal, setPersonal] = React.useState(true)

    const [teamAdminId, setTeamAdminId] = React.useState("")

    const [Btnstate, setBtnstate] = React.useState("create")

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        GetCalendarEvents().then((res) => {
            console.log(res)
            setAssignedTask(res[0])
            setCompletedTask(res[1])
            setTeamAdminId(res[2])
            setPersonal(res[3])
        }).catch(err => setError(err.message))
    }, [])

    const showModal = (ele) => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        try {
            if (Btnstate === "create") {
                setState(prev => {
                    return {
                        ...prev,
                        userId: teamAdminId
                    }
                })
                console.log(state)
                const res = await SendData({ "TaskList": state })
                console.log(res)
            }
            if(Btnstate === "update") {
                const info = {
                    Tid: state._id,
                    data: {
                        "TaskList.$.taskName": state.taskName,
                        "TaskList.$.priority": state.priority,
                        "TaskList.$.SubmissionDate": state.SubmissionDate,
                        "TaskList.$.dateOfCreation": state.dateOfCreation,
                    }
                }
                const mj = await UpdateTask("63ac28cbf8f9aa38a853831b", info)
                console.log(mj)
            }
            
            for (const key in state) {
                state[key] = "";
            }
            setState(state)
            setBtnstate("create")
        } catch (error) {
            console.log(error)
        }
    };

    const handleCancel = () => { 
        setIsModalOpen(false);
        setBtnstate("create")
        for (const key in state) {
            state[key] = "";
        }
        setState(state)
     }

    async function HandleUpdateData(ele) {
        try {
            console.log(ele)
            setState(ele)
            setBtnstate("update")
            setIsModalOpen(true);
        } catch (error) {
            console.log(error)
        }
    }

    if (error) { return (<p>{error}</p>) }

    return (
        <div className='container'>

            <div className="container p-2">
                <button onClick={showModal}>Create Task</button>
                <Modal title="Create Task" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <div className="container" style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}>

                            <h2>Create Task</h2>

                            <TextField
                                label="TaskNAme"
                                value={state.taskName}
                                onChange={(e) => setState(prev => { return { ...prev, taskName: e.target.value } })}
                            />
                            {/* to set creation date */}
                            <DateTimePicker
                                label="Start Date"
                                value={state.dateOfCreation}
                                onChange={(e) => setState(prev => { return { ...prev, dateOfCreation: e._d } })}
                                renderInput={(params) => <TextField {...params} />}
                            />

                            {/* to set submisson date */}
                            <DateTimePicker
                                label="Submission Date"
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

                            <div className="d-flex container" style={{
                                gap: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                display: "flex"
                            }}>
                                <Button type="primary" onClick={handleCancel}>
                                    close <CloseCircleTwoTone />
                                </Button>
                                {
                                    Btnstate === "create" ?
                                        <Button type="primary" onClick={handleOk}>
                                            Create
                                        </Button> :
                                        <Button type="primary" onClick={handleOk}>
                                            Update
                                        </Button>
                                }

                            </div>


                        </div>
                    </LocalizationProvider>
                </Modal>
            </div>

            <div className="container" style={{
                width: "200vw",
                background: "red",
            }}>
                assigned Tasks
                <DisplayTask Tasks={assigedTask} HandleUpdateData={HandleUpdateData} msg={"assigned"} />

            </div>
            <br />
            <div className="container" style={{
                width: "200vw",
                background: "red",
            }}>
                Comppleted Tasks
                <DisplayTask Tasks={completedTask} HandleUpdateData={HandleUpdateData} msg={"completed"} />
            </div>


        </div >
    )
}

export default DummyTask1

export function DisplayTask({ Tasks, HandleUpdateData, msg }) {
    console.log(msg)
    return (
        <>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 p-2 my-2">

                {
                    Tasks.map((ele) => {
                        return (
                            <div className="col ">
                                <Card
                                    style={{
                                        width: 300,
                                        background: "pink"
                                    }}

                                    actions={[
                                        <DeleteOutlined key="DeleteOutlined" onClick={() => DeleteItem("63ac28cbf8f9aa38a853831b", { "Parentkey": ele._id }, "639e9934d84d032b0879a0c9", ele.userId)} />,
                                        <EditOutlined key="edit" onClick={() => HandleUpdateData(ele)} />,
                                        <CheckCircleOutlined key="CheckCircleOutlined" onClick={() => {
                                            UpdateTask("63ac28cbf8f9aa38a853831b", {
                                                Tid: ele._id,
                                                data: {
                                                    "TaskList.$.Status": "completed",
                                                    "TaskList.$.dateOfActualSubmission": new Date()
                                                }
                                            }).then(res => console.log(res)).catch(err => console.log(err))
                                        }} />,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src="https://static.thenounproject.com/png/4038155-200.png" />}
                                        title={ele.taskName}
                                    />
                                    <div className="row">
                                        <span>priority</span>
                                        <FireTwoTone style={{ width: 5 }} twoToneColor={ele.color} />
                                    </div>
                                    <div className="d-flex p-1 m-1 container">

                                        <DisplayDays
                                            SubmissionDate={ele.SubmissionDate}
                                            dateOfActualSubmission={ele.dateOfActualSubmission}
                                            Status={ele.Status}
                                        />
                                    </div>
                                </Card>

                            </div>)
                    })

                }
            </div>
        </>
    )
}

export function DisplayDays({ SubmissionDate, dateOfActualSubmission, Status }) {
    return (
        <div className="row">
            {

                (Status === "assigned") ? (
                    <>
                        <span>remaining Days</span>
                        <p>{
                            Math.round((new Date(SubmissionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 1
                        }</p>
                    </>
                )
                    : (
                        <>
                            <span>Compltede on</span>
                            <p>{
                                new Date(dateOfActualSubmission).getDate()}/{new Date(dateOfActualSubmission).getMonth() + 1}/{new Date(dateOfActualSubmission).getFullYear()
                                }</p>
                        </>

                    )}
        </div>
    )


}

//api  call to get all the data of project  mainly tasklist
export async function GetCalendarEvents(id) {
    const _id = "63ac28cbf8f9aa38a853831b"
    const Tasks = await (await axios.get(`http://localhost:4000/projects/Tasks/${_id}`)).data
    let assigedTask = [], completedTask = [];
    Tasks.TaskList.map(a => {
        a.Status === "assigned" ? assigedTask.push(a) : completedTask.push(a)
    });
    console.log(assigedTask, completedTask)
    return [assigedTask, completedTask, Tasks.teamAdminId, Tasks.personal]
}

export async function SendData(d) {
    try {
        const Pid = "345637"
        const res = await axios.put(`http://localhost:4000/projects/arrAdd/${Pid}`, d)
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


export async function DeleteItem(id, d, Uid, Utid) {
    try {
        if (Uid === Utid) {
            const data = await axios.put(`http://localhost:4000/projects/projDelete/${id}`, d)
            alert("Deleted Successfully")
            return data
        } else {
            alert("You are not allowed")
            return "You are not allowed"
        }

    } catch (error) {
        return error
    }
}

export async function UpdateTask(Pid, d) {
    try {
        const m = await (await axios.put(`http://localhost:4000/projects/arrayUpdateAll/${Pid}`, d)).data

        return m

    } catch (error) {
        return error
    }

}