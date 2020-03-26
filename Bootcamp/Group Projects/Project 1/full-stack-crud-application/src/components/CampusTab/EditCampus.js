import React, { Component } from 'react'
import {connect} from 'react-redux'
import {editCampus} from '../../actions'
import {selectCampus} from '../../actions'
import {editStudent} from '../../actions'
import {emptyCampus} from '../../actions'
import {addCampus} from '../../actions'
import EditCampusStudentGrid from './EditCampusStudentGrid'
import {Redirect} from 'react-router'
import axios from 'axios'
import './EditCampus.css'; 


class EditCampus extends Component {
    constructor(props) {
        super(props)
        this.state = 
        {
            id: props.campus.id,
            name: props.campus.name,
            bio: props.campus.bio,
            address: props.campus.address,
            img: props.campus.img,
            nameIsCorrect: true,
			addressIsCorrect: true,
            redirect: false,
            selection: ''
        }
        this.props.selectCampus(this.props.campus);
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.getCampuses = this.getCampuses.bind(this);
    }

    onChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

   
    
    async getCampuses(){
        await this.props.emptyCampus();
        await axios.get('http://localhost:3001/api/campuses')
        .then(response => {
            let result = response.data;
                for (let i = 0; i < result.length; i++){
                    this.props.addCampus(result[i]);
                }
            }
        )
        .catch(err => console.log(err));
    }

    handleSelection = event =>{
        console.log(event.target.value)
        this.setState({
            selection: event.target.value
        })
    }

    onSubmitHandler = async event => {
        event.preventDefault()

        let that = this

        let correctName = true;
        if (this.state.name.length < 1){
            correctName = false;
        }
        for (let i = 0; i < this.state.name.length; i++){
            if (!(this.state.name[i].toLowerCase() != this.state.name[i].toUpperCase() || this.state.name[i] == " ")){
                correctName = false;
            }
        }

        let correctAddress = true;
        if (this.state.address.length < 1){
            correctAddress = false;
        }
        for (let i = 0; i < this.state.address.length; i++){
            if (!(this.state.address[i].toLowerCase() != this.state.address[i].toUpperCase() || this.state.address[i] == " " || this.state.address[i] == "," || (this.state.address[i] >= 0 && this.state.address[i] <= 9))){
                correctAddress = false;
            }
        }

        this.setState({
        	nameIsCorrect: correctName,
        	addressIsCorrect: correctAddress
        })

        if (correctName && correctAddress){
        	this.props.editCampus(this.state)
    	}

        let id_ = event.target.student.value;
        let student = undefined;

        for (let i = 0; i < this.props.students.length; i++) {
            if (id_ == this.props.students[i].id) {
                student = this.props.students[i];
                   console.log(student)
            }
        }

        if (student) {
            console.log(student);
            console.log(this.props.campus.id);
            student.campusId = this.props.campus.id;
            console.log(student);
            this.props.editStudent(student);
        }

        console.log(this.state.selection != '')
        if(this.state.selection != '')
        {  
            let response = {
                name: student.name,
                gpa: student.gpa,
                img: student.img,
                campus: this.state.id
            }
            
            console.log(response)
            await axios.put('http://localhost:3001/api/students/' + this.state.selection, response)
            .catch(err => console.log(err))
        }

        if (correctName && correctAddress){
           
            let response = {
                name: this.state.name,
                bio : this.state.bio,
                address : this.state.address,
                img: this.state.img
            };
            
            let url ='http://localhost:3001/api/campuses/' + this.state.id;
            const that = this;
            await axios.put(url,response)
            .then(() => that.setState({redirect: true}))
            .then(async () => await this.getCampuses())
            .catch(err => console.log(err));
        }

        
        
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/campuses"/>
            )
        }
        return (
            <div id ="editBg">
             <div className="EditCampus">
            	<form className="campus-addform" onSubmit={this.onSubmitHandler}>
				  <div className="campus-addform-element">
				    <label className="campus-addform-label">
  					  Name:
  					  <input className="campus-addform-input" name="name" type="text" placeholder="name" value={this.state.name} onChange={this.onChangeHandler}/>
  				    </label>
				  </div>
				  <div className="campus-addform-element">
				    <label className="campus-addform-label">
				  	  Bio:
					  <input className="campus-addform-input" name="bio" placeholder="Insert Description" value={this.state.bio} onChange={this.onChangeHandler} />
				    </label>
					</div>
				  <div className="campus-addform-element">
				    <label className="campus-addform-label">
					  Address:
					  <input className="campus-addform-input" name="address" type="text" placeholder="address" value={this.state.address} onChange={this.onChangeHandler}/>
				    </label>
					</div>
				  <div className="campus-addform-element">
				    <label className="campus-addform-label">
					  image:
					  <input className="campus-addform-input" name="img" type="text" placeholder="image url" value={this.state.img} onChange={this.onChangeHandler} />
				    </label>
				  </div>
                  <div id="dropDownCampus" >
                    <select className="campus-addform-button" name="student" onChange={this.handleSelection}>
                      <option>Select student...</option>
                      {this.props.students.filter(student => (student.campusId != this.props.campus.id)).map((student) => (
                        <option value={student.id}>{student.name}</option>
                      ))}
                    </select>
                    </div>
				    <button className="campus-addform-button">Save Changes</button>
				  
                </form>
                <div className="campus-addform-label color-red">
                	<div>
                		{this.state.nameIsCorrect ?
                			"" :
                			"Name must be at least one character long and must contain only letters and spaces"
                		}
                	</div>
                	<div>
                		{this.state.addressIsCorrect ?
                			"" :
                			"Address must not be empty, and can consist only of letters, numbers, and spaces"}
                	</div>
                </div>
                <div>
                    <EditCampusStudentGrid students={this.props.students.filter(student => (student.campusId == this.props.campus.id))} />
                </div>
            </div>
            </div>
        )
    }
}

const mapStateToProps = State => {
    return {students: State.students}
}

export default connect(mapStateToProps, {
    editCampus,
    addCampus,
    emptyCampus,
    selectCampus,
    editStudent
})(EditCampus)
