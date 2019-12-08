import React, {Component} from 'react';
import {VictoryChart, VictoryLine} from 'victory';

import requireAuth from "../../hoc/requireAuth";
import axios from "axios";
import {connect} from "react-redux";


import "./index.css";
import "@material-ui/core";


class TempChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            chillerID:props.chillerID,
            data:[
                { x:1300, y:-40},
                { x:1330, y:-40},
                { x:1400, y:-40},
                { x:1430, y:-40},
                { x:1500, y:-40},
                { x:1530, y:-40},
                { x:1600, y:-40},
            ],
            loaded:false
        };
        console.log(props.chillerID);
    }
//,
//                     chillerid:this.state.chillerID
    componentDidMount() {
        axios.post("http://localhost:3001/api/c/recent", {},{
            headers: {
                authorization: localStorage.getItem("token"),
                chillerid:this.state.chillerID
            }
        }).then( (response) => {
                let rev = response.data.slice(0,128).reverse();
                console.log(`axios call success for chiller id`)
                console.log(rev);
                let dataArray = this.cleanData(rev);
                // console.log(dataArray);
                let cstate = this.state;
                cstate.data= dataArray;
                cstate.loaded=true;
                this.setState(cstate);

            }).catch((e)=>{
                console.log(e);
            });

    }

    cleanData(arrayInput){
        let dataArray = [];
        for(let i in arrayInput){
            let pointTime = new Date(arrayInput[i].timestamp*1000);

            if(i%2 === 0){
                console.log(pointTime);
                let datapoint = {
                    x:new Date(pointTime),
                    y:arrayInput[i].temp1
                };
                dataArray.push(datapoint);
           }
        }
        return dataArray;
    }

    isData(){
    if(this.state.data !== undefined){
    return true;
    }else{
        return false
    }
    }

    render() {
        console.log(this.state.data);
        return (
            <div className={"ShowGraphToggle"}>
                {this.state.loaded ? <div className={"graphContainer"}>
                    <div className={"UpperInfo"}>
                        <div className={'GraphINfo'}>
                            <h5>{this.props.chillerName}</h5>
                        </div>
                        <button className={"waves-effect waves-light btn"} onClick={this.props.hide}>X</button>
                    </div>
                    <VictoryChart  height={200}>
                        <VictoryLine
                            data={this.state.data}
                            style={{
                                data: { fill: "blue", opacity: 0.4, width:3 },
                                labels: { fontSize: 10, padding: -20 },
                                parent: { border: "1px solid #ccc" }
                            }}
                            fixLabelOverlap={true}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 2000 }
                            }}

                        />
                    </VictoryChart>
                </div>:<div></div>}

            </div>
        );
    }
}

function mapStateToProps(state){
    return { auth: state.auth.authenticated }
}

// export default requireAuth(TempChart);
export default requireAuth(connect(mapStateToProps, {})(TempChart));
