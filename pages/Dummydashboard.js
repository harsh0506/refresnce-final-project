import React from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined, FireTwoTone } from '@ant-design/icons';
import { Button, Card, Avatar } from 'antd';
import { Modal, Toggle, Cascader, ButtonToolbar, Loader, Placeholder, DatePicker } from 'rsuite';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryLabel, VictoryPie } from 'victory';
import axios from 'axios';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from "@mui/material";

const localizer = momentLocalizer(moment)

const Prioity = [{ value: "high", label: "high" },
{ value: "medium", label: "medium" },
{ value: "low", label: "low" },
]

const a = [2, 3, 4]

const { Meta } = Card;

const Event = {
    event_id: "",
    title: "",
    description: "",
    color: "blue",
    start: "",
    end: "",
    date: ""
}

const Task = {
    dateOfActualSubmission: "",
    taskName: "",
    priority: "",
    userId: "",
    userName: "",
    SubmissionDate: "",
    progress: "0",
    dateOfCreation: "",
    taskId: "",
    Status: "",
}

const data_1_2 = { x: "", y: "" }

const Schema = {
    remainingDays: "",
    color: "",
    No_of_Completed_events: "", calendar: [Event], OnGoingEvents: [Event], PieChartData: { "completed": "", "assigned": "" },
    data1: [data_1_2], data2: [data_1_2],
    HighPrioityTask: [Task], TaskCloseToSubmission: [Task], priority: "", projectName: "", projectId: "", _id: "",
    PredictionData: "", SubmissionDate: ""
}


function Dummydashboard() {

    const [state, setState] = React.useState(Schema)

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        updateData('63ac28cbf8f9aa38a853831b', {
            projectName: state.projectName,
            priority: state.priority,
            SubmissionDate: state.SubmissionDate
        }).then(res => console.log({...res,OnGoingEvents:[Event]})).catch(err => console.log(err))
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    React.useEffect(() => {
        getData().then(res => setState(res)).catch(err => console.log(err))
    }, [])

    return (
        <>
            <div className="conatiner" style={{ background: "pink" }}>

                <div className="containe">
                    <Button onClick={showModal}>Update</Button>
                    <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                        <LocalizationProvider dateAdapter={AdapterMoment}>

                            <TextField
                                label="ProjectNAme"
                                value={state.projectName}
                                onChange={(e) => setState(prev => { return { ...prev, projectName: e.target.value } })}
                            />

                            {/* to set submisson date */}
                            <DateTimePicker
                                label="submission Date"
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

                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"
                }}>
                    {/* Remaining Days */}
                    <div className="col">
                        <Card style={{ maxWidth: 250, height: 200, alignItems: "center", justifyContent: "center", display: "flex", textAlign: "center" }} >
                            <div className="col">
                                <span style={{ fontSize: 20 }}>reamining Days</span>
                                <h3 style={{ fontSize: 100 }}>{
                                state.remainingDays
                                }</h3>
                            </div>
                        </Card>
                    </div>

                    {/* Priority */}
                    <div className="col">
                        <Card style={{ maxWidth: 250, gap: 5, height: 200, alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", textAlign: "center" }} >
                            <div className="col "  >
                                <p style={{ fontSize: 20 }}>Priority</p>
                                <FireTwoTone style={{ width: 305 }} twoToneColor={state.color} />
                            </div>
                        </Card>
                    </div>

                    {/* Completed Task */}
                    <div className="conatiner col">
                        <Card style={{ maxWidth: 250, gap: 5, height: 200, alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", textAlign: "center" }} >
                            <div className="col "  >
                                <p style={{ fontSize: 20 }}>Completed Task</p>
                                <h3 style={{ fontSize: 100 }}>{String(state.No_of_Completed_events.completed)}</h3>
                                {state.No_of_Completed_events.completed === 0 ? <p>no events completed</p> : null}
                            </div>
                        </Card>
                    </div>
                </div>

            </div>


            <div className="container">
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"
                }}>
                    <div className="container" style={{ maxWidth: 400 }}>
                        <Calendar
                            localizer={localizer}
                            events={state.calendar}
                            //startAccessor="start"
                            //endAccessor="end"
                            style={{ height: 400 }} />
                    </div>
                    <div className="row">
                        <p>OnGoing event</p>
                        <div style={{ overflowY: "scroll", maxHeight: 300 }} class="">
                            {
                                state.OnGoingEvents[0].title === "" ? <p>No Ongoing events , Go to Calendar tab</p> : state.OnGoingEvents.map((ele) => {
                                    return (<>
                                        <div className="col" onClick={() => null}>
                                            <Card
                                                style={{
                                                    width: 300,
                                                    backgroundColor: "Pink",
                                                    margin: 10
                                                }}
                                            >
                                                <Meta
                                                    title={ele.title}
                                                />
                                                <br />
                                                <FireTwoTone twoToneColor="#eb2f96" />
                                            </Card>
                                        </div>
                                    </>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"
                }}>
                    <div className="col" style={{ width: 300, height: 300 }} >
                        {/* pie chart  */}
                        <VictoryPie

                            animate={{
                                duration: 2000
                            }}
                            style={{ width: 300, height: 300 }}

                            data={[
                                { x: "Cats", y: 35 },
                                { x: "Dogs", y: 40 },
                            ]}
                        />
                    </div>
                    <div className="container">
                        <p>High priority events</p>
                        <div style={{ overflowY: "scroll", maxHeight: 300 }} class="">

                            {
                                state.HighPrioityTask[0].taskName !== "" ? state.HighPrioityTask.map((ele) => (<CardComp
                                    taskName={ele.taskName}
                                    priority={ele.priority}
                                    SubmissionDate={ele.SubmissionDate}
                                />))
                                    : state.TaskCloseToSubmission[0].taskName !== "" ?
                                        state.TaskCloseToSubmission.map((ele) => (<CardComp
                                            taskName={ele.taskName}
                                            priority={ele.priority}
                                            SubmissionDate={ele.SubmissionDate}
                                        />)) :
                                        (<CardComp
                                            taskName="No tasks"
                                            priority={""}
                                            SubmissionDate=""
                                        />)
                            }
                            
                        </div>
                    </div>

                    <div className="row" style={{ width: 500, height: 500 }}>
                        <TwoLinechartTaskDate state={state} />
                    </div>
                </div>

            </div>

            <div className="container">
                <Card style={{
                    width: 300,
                    height: 500,
                    backgroundColor: "Pink",
                }}>

                    <div className="d-flex " style={{
                        alignItems: "center", justifyContent: "center", flexDirection: "column"
                    }}>
                        <h3>Our Team</h3>
                        {
                            a.map((ele) => {
                                return (<>
                                    <Meta
                                        style={{ padding: 10, margin: 5, textAlign: "center", width: 200 }}
                                        avatar={<Avatar src="https://images.prismic.io/ddhomepage/9643a4bb-cc11-468e-8441-36e67308a6aa_people-main-image.jpg?auto=compress,format&rect=0,0,570,684&w=570&h=684&fit=clip&cs=srgb" />}
                                        title="UserName "
                                        description="emai@email.com"
                                    />
                                </>)
                            })
                        }

                    </div>
                </Card>
            </div>
        </>
    )
}

export default Dummydashboard

export function CardComp({ taskName, priority, SubmissionDate }) {
    return (
        <div className="col" onClick={() => null}>
            <Card
                style={{
                    width: 300,
                    backgroundColor: "Pink",
                }}
            >
                <Meta
                    title={taskName}
                />
                <p>{Math.round((new Date(SubmissionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 1
                }</p>
                <br />
                <FireTwoTone twoToneColor="#eb2f96" />
            </Card>
        </div>
    )
}

async function getData(id) {
    try {
        return await (await axios.get("http://localhost:4000/projects/DashBoard/63ac28cbf8f9aa38a853831b")).data
    } catch (error) {
        return error
    }
}

export async function updateData(id, data) {
    try {
        return await axios.put(`http://localhost:4000/projects/${id}`, data)
    } catch (error) {
        return error
    }
}

export function TwoLinechartTaskDate({ state }) {
    return (
        <VictoryChart>
            <VictoryAxis
                dependentAxis
                tickFormat={(x) => new Date(x).toDateString().slice(4)}
                label="Submitted Date"
            />
            <VictoryAxis
                style={{ padding: 5 }}
                tickFormat={(x) => new Date(x).toDateString().slice(4)}
                label="Actual Submission Date"
            />
            <VictoryLabel
                text="Task Submission Dates"
                x={225}
                y={30}
                textAnchor="middle"
            />
            <VictoryLine
                data={state.data1}
                style={{ data: { stroke: "red" } }}
                label="Actual Submission Date"
            />
            <VictoryLine
                data={state.data2}
                style={{ data: { stroke: "blue" } }}
                label="Submitted Date"
            />
        </VictoryChart>
    );
}

let events = [
    {
        'title': 'All Day Event very long title',
        'allDay': true,
        'start': new Date(2015, 3, 0),
        'end': new Date(2015, 3, 1)
    },
    {
        'title': 'Long Event',
        'start': new Date(2015, 3, 7),
        'end': new Date(2015, 3, 10)
    },

    {
        'title': 'DTS STARTS',
        'start': new Date(2016, 2, 13, 0, 0, 0),
        'end': new Date(2016, 2, 20, 0, 0, 0)
    },

    {
        'title': 'DTS ENDS',
        'start': new Date(2016, 10, 6, 0, 0, 0),
        'end': new Date(2016, 10, 13, 0, 0, 0)
    },

    {
        'title': 'Some Event',
        'start': new Date(2015, 3, 9, 0, 0, 0),
        'end': new Date(2015, 3, 9, 0, 0, 0)
    },
    {
        'title': 'Conference',
        'start': new Date(2015, 3, 11),
        'end': new Date(2015, 3, 13),
        desc: 'Big conference for important people'
    },
    {
        'title': 'Meeting',
        'start': new Date(2015, 3, 12, 10, 30, 0, 0),
        'end': new Date(2015, 3, 12, 12, 30, 0, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting'
    },
    {
        'title': 'Lunch',
        'start': new Date(2015, 3, 12, 12, 0, 0, 0),
        'end': new Date(2015, 3, 12, 13, 0, 0, 0),
        desc: 'Power lunch'
    },
    {
        'title': 'Meeting',
        'start': new Date(2015, 3, 12, 14, 0, 0, 0),
        'end': new Date(2015, 3, 12, 15, 0, 0, 0)
    },
    {
        'title': 'Happy Hour',
        'start': new Date(2015, 3, 12, 17, 0, 0, 0),
        'end': new Date(2015, 3, 12, 17, 30, 0, 0),
        desc: 'Most important meal of the day'
    },
    {
        'title': 'Dinner',
        'start': new Date(2015, 3, 12, 20, 0, 0, 0),
        'end': new Date(2015, 3, 12, 21, 0, 0, 0)
    },
    {
        'title': 'Birthday Party',
        'start': new Date(2015, 3, 13, 7, 0, 0),
        'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        'title': 'Birthday Party 2',
        'start': new Date(2015, 3, 13, 7, 0, 0),
        'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        'title': 'Birthday Party 3',
        'start': new Date(2015, 3, 13, 7, 0, 0),
        'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        'title': 'Late Night Event',
        'start': new Date(2015, 3, 17, 19, 30, 0),
        'end': new Date(2015, 3, 18, 2, 0, 0)
    },
    {
        'title': 'Multi-day Event',
        'start': new Date(2015, 3, 20, 19, 30, 0),
        'end': new Date(2015, 3, 22, 2, 0, 0)
    }
]
