import React from 'react'
import './App.css';

// const getAsyncStories = () => {
//    return  (new Promise(resolve => 
//     setTimeout(
//       () => resolve({ data: {stories: initialStories }}),2000)
//     ));
// }

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {

  if(action.type === 'STORIES_FETCH_INIT'){
    return {
      ...state,
      isLoading: true,
      isError: false,
    };
  }
  else if(action.type === 'STORIES_FETCH_SUCCESS'){
    return{
      ...state,
      isLoading: false,
      isError: false,
      data: action.payload,
    }
  }
  else if(action.type === 'STORIES_FETCH_FAILURE'){
    return {
      ...state,
      isLoading: false,
      isError: true,
    }
  }
  else if(action.type === 'REMOVE_STORY'){
    return {
      ...state,
      data: state.data.filter( 
        story =>action.payload.objectID !== story.objectID 
      )
    }
  }
  else{
    throw new Error();
  }
}
// const initialStories = [
//   {
//    title: 'React',
//    url: 'https://reactjs.org/',
//    author: 'Jordan Walke',
//    num_comments: 3,
//    points: 4,```````````````````````````````````````````````````````
//    objectID: 0,
//  },
//  {
//    title: 'Redux',
//    url: 'https://redux.js.org/',
//    author: 'Dan Abramov, Andrew Clark',
//    num_comments: 2,
//    points: 5,
//    objectID: 1,
//  },
// ];

const usePersisState = (key, initialState) => {
  const[value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(()=> {
    localStorage.setItem(key, value);
  },[value, key]);

  return [value, setValue];
};
 
const App = () => {

  const [searchTerm, setSearchTerm] = usePersisState('search', 'React');

  //const[stories, setStories] = React.useState([]);

  const[stories, dispatchStories] = React.useReducer(
    storiesReducer,{data:[], isLoading: false, isError: false});

  // const[isLoading, setIsLoading] = React.useState(false);

  // const[isError, setIsError] = React.useState(false);

    const[url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  React.useEffect(() => {

    if(!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT'});

    fetch(url)
    .then(response => response.json())

    .then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    })

    .catch(() => dispatchStories({
      type: 'STORIES_FETCH_FAILURE',
    }));
  }, [url]);

  const handleRemovedStories = item => {
    // const newStories = stories.filter(story =>{
    //   return item.objectID !== story.objectID
    // });
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  // const [searchTerm, setSearchTerm] = usePstate(
  //   'search',
  //   'React'
  // );

const handleSearchSubmit = event => {
  setUrl(`${API_ENDPOINT}${searchTerm}`);
  event.preventDefault();
};

  

 

  return (
    <div className='container'>
      <h1 className='headline-primary'> Hello React</h1>
        <div className= 'search-form'>
          <InputWithLabel
            id="search"
            
            value={searchTerm}
            onInputChange={handleSearch}>
            <strong>Search</strong>
          </InputWithLabel>
            
            <button className = 'button button_large' type = 'button'
            disabled = {!searchTerm}
            onClick = {handleSearchSubmit}
            >
            Submit 
            </button>
          </div>
        
      <hr />
      {stories.isError && <p>Something went wrong ..</p>}
      {stories.isLoading ? (
        <p>Loading ...</p> 
      ) : (
        <List items = {stories.data} onRemoveItem = {handleRemovedStories} />
      )}
     
     
      </div>
        
  );
}
const InputWithLabel = ({
  id,
  children,
  value,
  type = 'text',
  onInputChange,
  isFocused
}) => (
  <>
    <label className='label' htmlFor={id}>{children}</label>
    &nbsp;
    <input className='input'
      id={id}
      type={type}
      value={value}
      autoFocus = {isFocused}
      onChange={onInputChange}
    />
  </>
);


const List = ({items, onRemoveItem}) =>{
  return(
    <div>
        {items.map(function(item) {
          return (<div className="item" key={item.objectID}>
            <span style={{width:'40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{width:'30%'}}>{item.author}</span>
            <span style={{width:'10%'}}>{item.num_comments}</span>
            <span style={{width:'10%'}}>{item.points}</span>
            <span style={{width:'10%'}}>
              <button className="button button_small" type="button" onClick={() => { 
                
                onRemoveItem(item)
              }}
              >
                Dismiss
              </button>
            </span>
            </div>   
          );
        })}
    </div>
  );
}

export default App;
