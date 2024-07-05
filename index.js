// Import required modules
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Array to store blog posts
let posts = [];
let nextId = 1; // Counter for generating unique IDs

// Set the view engine to EJS and views directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');  //make when render no need to type.ejs
app.set('views', path.join(__dirname, 'views'));

// Route to render the home page
app.get('/', (req, res) => {
  res.render('index', { posts: posts });
});

// Route to handle creating a new post
app.post('/create-post', (req, res) => { 
  // Request Body Parsing
  const { title, content } = req.body; // Extracts 'title' and 'content' from the request body

  const newPost = { 
    id: nextId++,  // Generates a unique ID for the new post
    title: title,  // Assigns the 'title' from the request body
    content: content // Assigns the 'content' from the request body
   };
    // Store the Post
  posts.push(newPost); // Adds the new post object to the 'posts' array
  res.redirect('/');
});

// Route to render the edit page for a post //สร้างเป็น url edit-post /1 /2 /3  ตามแต่ละโพสที่สร้าง
app.get('/edit-post/:id', (req, res) => { //จุดจบตามแต่ละโพสที่มี unique id ต่างกันไป

   // Extract Post ID from URL Parameter
  const postId = parseInt(req.params.id);  // req.params contains route parameters (in the path portion of the URL)

  // req.params.id gets the ID from the URL and parseInt() converts it to an integer

  // Find Post by ID
  const post = posts.find(p => p.id === postId);
  // Searches the 'posts' array to find a post object with an 'id' property matching 'postId'


  if (!post) {
    return res.status(404).send('Post not found');
  }
    // Render Edit Page with Post Data
  res.render('edit', { post: post });
  // If a matching post is found, render the 'edit' view template with the post data
  // The 'edit' view will use the 'post' data to pre-fill form fields or display post content for editing
});

// Route to handle updating a post
app.post('/update-post/:id', (req, res) => {
    // Route handles POST requests to '/update-post/:id'

  const postId = parseInt(req.params.id);
    // Extracts the 'id' parameter from the URL and converts it to an integer

  const { title, content } = req.body;
    // Destructures the 'title' and 'content' properties from the request body (form data)

  const postIndex = posts.findIndex(p => p.id === postId);
// Finds the index of the post in the 'posts' array with an 'id' matching 'postId'
  // findIndex() returns the index of the first element that satisfies the provide

  if (postIndex !== -1) {
    // Checks if a post with the given ID was found (index is not -1)


    posts[postIndex].title = title;
    posts[postIndex].content = content;
    // Updates the title and content of the found post


    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

// Route to handle deleting a post
app.post('/delete-post/:id', (req, res) => {
    // Route handles POST requests to '/delete-post/:id'

  const postId = parseInt(req.params.id);
    // Extracts the 'id' parameter from the URL and converts it to an integer

  
  const postIndex = posts.findIndex(p => p.id === postId);
// Finds the index of the post in the 'posts' array with an 'id' matching 'postId'
  // findIndex() returns the index of the first element that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.


  if (postIndex !== -1) {
    // Checks if a post with the given ID was found (index is not -1)


    posts.splice(postIndex, 1); // Remove the post from the array
// If found, removes the post from the 'posts' array using the splice() method
    // splice(index, 1) removes one element at the specified index

    res.redirect('/'); // Redirect back to the home page
  } else {
    res.status(404).send('Post not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
