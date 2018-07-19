import React, { Component } from 'react';
function Blog(props) {
    const sidebar = (
        <ul>
            {props.posts.map((post) =>
                <li key={post.id}>
                    {post.title}
                </li>
            )}
        </ul>
    )
    const content = props.posts.map((post) =>
        <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
        </div>
    )
    return (
        <div>
            {sidebar}
            <hr />
            {content}
        </div>
    )
}
const posts = [
    {id:1,title:'hello world',content:'welcome to china'},
    {id:2,title:'installation',content:'you can study english'}
];
class Blog1 extends Component{
    render(){
        return(
            <Blog posts={posts} />
        )
    }
}
export default Blog1;
