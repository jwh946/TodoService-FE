import logo from './logo.svg';
import React from 'react';
import Hello from './Hello';
import Todo from './Todo';
import AddTodo from './AddTodo';
import {Paper, List, Container}from "@mui/material";
import './App.css';

class App extends React.Component{

    constructor(props){     // 매개변수 props 생성자
        super(props);       // 매개변수 props 초기화
        this.state = {      // item에 item.id, item.title, item.done 매개변수 이름과 값 할당
            items :[
                {id:0, title:"Todo 1 ", done:true},
                {id:1, title:"Todo 2 ", done:false},
            ]
        };
    }

    // add 함수 추가
    add = (item) => {
        const thisItems = this.state.items;
        item.id = "ID-"+ thisItems.length;  // key값을 위한 id 생성
        item.done = false;
        thisItems.push(item);
        this.setState({items: thisItems});  // update state
        console.log("items:", this.state.items);
    }

    // delete 함수 추가
    delete =(item)=> {
        const thisItems = this.state.items;
        const newItems = thisItems.filter(e => e.id !== item.id);
        this.setState({items: newItems},()=> {
            console.log("Update Items:", this.state.items);    // 디버깅 콜백
        });
    }

    render(){
        // 자바스크립트가 제공하는 map 함수로 배열을 반복하여 <Todo /> 컴포넌트를 여러 개 생성
        var todoItems = this.state.items.length > 0 &&(
            <Paper style={{margin:16}}>
                <List>
                    {this.state.items.map((item, idx) => (
                        <Todo item={item} key={item.id} delete={this.delete}/>
                    ))}
                </List>
            </Paper>
        );

        // add 함수 연결
        return(
            <div className="App">
                <Container maxWidth="md">
                    <AddTodo add={this.add}/>
                    <div className="TodoList">{todoItems}</div>
                </Container>
            </div>
        );
    }
}

export default App;
