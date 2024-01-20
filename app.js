const loader = document.getElementById("loader");
const resultElement = document.getElementById('avatar-detail');
resultElement.innerHTML = `<p> <strong> Search GitHub Id to Display The Content </strong> </p>`;
const pagecontainer = document.getElementById("page-container");
// let selectedPerPage;
let currentPage = 1;

function getUserData() {
  const username = document.getElementById('username').value;
  const perPage = document.getElementById('select-opt').value;
  console.log(perPage)
  loader.style.display = "block";

  if (username === "") {
    resultElement.innerHTML = `<p> <strong> Search GitHub Id to Display The Content </strong> </p>`;
    return;
  }
  resultElement.innerHTML = "";
  
  fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(data => {
      loader.style.display = "none";
      displayUserData(data,perPage);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      console.log('Error fetching user data. Please check the username and try again.');
    });
}

function displayUserData(userData,perPage) {
  const imgElement = document.getElementById('avatar');

  resultElement.innerHTML = `
  <p ><strong>Name :</strong>    ${userData.name}</p>
  <p ><strong>Username :</strong>    ${userData.login || 'No User Found'}</p>
  <p class="loc"><strong><i class="bi bi-geo-alt-fill"></i></strong>    ${userData.location || 'Not available'}</p>
  <p class="repo-count"><strong>Public Repositories:</strong>    ${userData.public_repos || '?'}</p>
  <p><strong><i class="bi bi-people-fill"></i> </strong>  ${userData.followers || '?'} <span class="followers">Followers</span>. ${userData.following || '?'} <span class="followers"> Following</span></p>
    `;
  imgElement.innerHTML = `
    <img src="${userData.avatar_url}" alt="">
  `;
  repodetail(userData.login,perPage)
}

function repodetail(username,perPage) {
  loader.style.display = "block";
  const reposContainer = document.getElementById("repos-container");
  reposContainer.innerHTML = "";
  
  fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}`)
    .then(response => response.json())
    .then(repos => {
      loader.style.display = "none";
      reposContainer.innerHTML = "";

     //let topic = prompt("Enter Topic To filter Repository")
       const totalPages = Math.ceil(repos.length/10);
     // repos = repos.slice((currentPage - 1) * perPage, currentPage * perPage);

      repos.forEach(repo => {
        const lang = repo.language ? repo.language.toLowerCase() : "Not specified";

       // if (lang === topic.toLowerCase()) {
          const repoElement = document.createElement("div");
          repoElement.classList.add("repo");

          repoElement.innerHTML = `
          <div class="repo-container">
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available"}</p>
            <p class="topic"> ${lang.toUpperCase()}</p>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"><p class="repo-link"> Visit Repository  <i class="bi bi-link-45deg"></i></p></a>
          </div>
          `;
          reposContainer.appendChild(repoElement);
          pagecontainer.innerHTML = `Page ${currentPage} of ${totalPages}`
        //}
      });
     // addPageBtn(totalPages);
    })
    .catch(error => {
      loader.style.display = "none";
      console.error("Error fetching GitHub repositories:", error);
      reposContainer.innerHTML = "<p>Error fetching repositories. Please try again later.</p>";
    });
}

// function addPageBtn(totalPages){
//   pagecontainer.innerHTML = "";
//   for(let i =1 ;i<=totalPages;i++){
//     const button = document.createElement("button");
//     button.innerText = i;
//     button.addEventListener("click",()=>{
//       currentPage = i;
//       loadRepos(userData.login);
//     });
//     pagecontainer.appendChild(button);
//   }
// }

// function loadRepos(username) {
//   repodetail(username, selectedPerPage);
// }