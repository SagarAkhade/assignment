import './App.css';
import { Button, Table } from 'react-bootstrap'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';

function App() {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  const [data, setData] = useState([]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [counter, setCounter] = useState(101);
  const [toggle, setToggle] = useState(true);
  const [isEdited, setIsEdited] = useState(null);

  const url = 'https://jsonplaceholder.typicode.com/posts';
  useEffect(() => {
    async function getData() {
      const responce = await fetch(url);
      if (!responce.ok) {
        throw new Error("Something went wrong");
      }
      const data = await responce.json();
      return data;
    }
    getData().then((data) => {
      setData(data)
    }).catch((error) => error);
  }, [])

  // Adding Posts to data
  function addPost() {
    if (!title && !body) {
      alert("Please Enter valid data");
    }
    else if (title && body && !toggle) {
      setData(
        data.map((element) => {
          if (element.id === isEdited) {
            return { ...element, title: title, body: body }
          }
          return element;
        })
      )

      setTitle('');
      setBody('');
      setToggle(true);
      setIsEdited(null);
    }
    else {
      const addUser = { id: counter, title: title, body: body };
      setData([...data, addUser]);
      setCounter(counter + 1);

      setTitle('');
      setBody('');
    }

  }

  // Delete Post
  function deletePost(id) {
    const updatedPosts = data.filter((element) => {
      return (id !== element.id);
    });
    setData(updatedPosts);
  }

  // Edit Post
  function editPost(id) {
    const isEditedPost = data.find((element) => {
      return (id === element.id);
    })

    console.log(isEditedPost);
    setTitle(isEditedPost.title);
    setBody(isEditedPost.body);
    setIsEdited(id);
    setToggle(false);
  }

  return (
    <div className="App">
      <div className='navbar' >

        <h2 className='heading'>PostHub</h2>
        <div>
          {
            isAuthenticated ?
              <Button variant="danger" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</Button> :
              <Button variant="primary" onClick={() => loginWithRedirect()}>Log In</Button>
          }
        </div>
      </div>
      <div style={{ alignSelf: 'center' }}>
        {
          isAuthenticated ?
            <p className='user'>Welcome {user.name}</p> :
            <p className='user'>Welcome Guest</p>
        }
      </div>


      {
        isAuthenticated ?
          <>
            <div className='createUser'>
              <h3 className='subheading'>Create post</h3>
              <div>
                <span>Title</span> <br />
                <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Please Enter Title...' />
                <br />
              </div>

              <div>
                <span>Description</span> <br />
                <textarea type='text' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Please Enter Description...' />
                <br />
              </div>

              <div>
                <Button style={{ width: '40%' }} variant="success" onClick={() => addPost()}>Add Data</Button>
              </div>

              <div>
                <h6>Note: Create and Edit post in given box</h6>
              </div>

            </div>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item, i) => {
                    return (
                      <tr key={i + 1}>
                        <td>{i + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.body}</td>

                        <td>
                          <div className='action' >
                            <div className='eachbtn'>
                              <Button variant="primary" onClick={() => editPost(item.id)}>Edit</Button>
                            </div>

                            <div className='eachbtn'>
                              <Button variant="danger" onClick={() => deletePost(item.id)}>Delete</Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </> :
          <>
            <Table striped bordered hover >
              <thead>
                <tr>
                  <th> No.</th>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.body}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </>
      }
    </div>
  );
}

export default App;
