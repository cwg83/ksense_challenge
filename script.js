// Get response data from API url
async function getApiResponse(path) {
    // base API url
    const baseUrl = 'https://jsonplaceholder.typicode.com';
    // Store the response
    const response = await fetch(baseUrl + path);

    // Store data from response as JSON
    const data = await response.json();

    return data;
}

// Create users table and insert data
async function showUsers() {
    // Get API data from /users url
    const usersData = await getApiResponse('/users');

    // Create #users table headers html
    let usersHTML =
        `<tr>
        	<caption class="table-caption">Users</caption>
          <th>User ID</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
         </tr>`;

    // Loop through usersData and insert rows into usersHTML
    for (const r of usersData) {
    		const id = escapeHtml(r.id);
        const name = escapeHtml(r.name);
        const username = escapeHtml(r.username);
        const email = escapeHtml(r.email);
        usersHTML += 
        `<tr> 
          <td>${id}</td>
          <td class="name">${name}</td>
          <td>${username}</td> 
          <td>${email}</td>
          <td><button class="posts-btn" id=${r.id}>Show Posts</button></td>
        </tr>`;
    }

    // Insert final html into #users table
    document.getElementById("users").innerHTML = usersHTML;
}

function showPosts(postsData, id, name) {

    // Create #posts table headers html
    let postsHTML =
        `<tr>
        	<caption class="table-caption" id="posts-title">Posts by ${name}</caption>
          <th>User ID</th>
          <th>Title</th>
          <th>Body</th>
         </tr>`;

    // Loop to access all rows 
    for (const r of postsData) {
    		const userId = escapeHtml(r.userId);
        const title = escapeHtml(r.title);
        const body = escapeHtml(r.body);
        if (userId == id) {
            postsHTML +=
            `<tr>
              <td>${userId}</td>
              <td>${title}</td>
              <td>${body}</td>
          	</tr>`;
        }
    }
    // Setting innerHTML as tab variable
    document.getElementById("posts").innerHTML = postsHTML;
}

// Unsafe character map
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

// Sanitize html characters from string
function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

$(document).ready(function() {
    showUsers();
    // Make Show Posts buttons clickable
    $(document).on('click', '.posts-btn', async function() {
    		const button = $(this) 
    		// If users posts are already displayed
        if (button.hasClass('btn-clicked')) {
        		// Hide their posts and change button color and text
            $('#posts').hide();
            button.removeClass('btn-clicked');
            button.html('Show Posts');
        // Otherwise remove btn-clicked class from all buttons and show users posts
        } else {
            $('.posts-btn').removeClass('btn-clicked');
            $('.posts-btn').html('Show Posts');
            button.addClass('btn-clicked');
            button.html("Hide Posts");
            const id = button.attr('id');
            const name = button.parent().prevAll('.name').html();
            // Get API data from /posts URL
            const posts = await getApiResponse('/posts');
            // Show the users posts
            showPosts(posts, id, name);
            $('posts-title').empty();
            $('#posts').show();
        }
    });
});
