const loader = document.getElementById("loader");
const resultElement = document.getElementById('avatar-detail');

// const topic = prompt("Enter the programming you would like to search for in the GitHub profile");
loader.style.display = "block";

resultElement.innerHTML = `<p> <strong> Search GitHub Id to Display The Content </strong> </p>`;

function getUserData() {
  const username = document.getElementById('username').value;
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
      displayUserData(data);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      console.log('Error fetching user data. Please check the username and try again.');
    });
}

function displayUserData(userData) {
  const imgElement = document.getElementById('avatar');
  resultElement.innerHTML = `
  <p ><strong>Name :</strong>    ${userData.name}</p>
  <p ><strong>Username :</strong>    ${userData.login}</p>
  <p class="loc"><strong><i class="bi bi-geo-alt-fill"></i></strong>    ${userData.location || 'Not available'}</p>
  <p class="repo-count"><strong>Public Repositories:</strong>    ${userData.public_repos}</p>
  <p><strong><i class="bi bi-people-fill"></i> </strong>  ${userData.followers} <span class="followers">Followers</span>. ${userData.following} <span class="followers"> Following</span></p>
    `;
  imgElement.innerHTML = `
    <img src="${userData.avatar_url}" alt="">
  `;
  document.getElementById('username').value = "";
  repodetail(userData.login)
}

function repodetail(username) {

  loader.style.display = "block";
  // const username = prompt("enter username")
  const reposContainer = document.getElementById("repos-container");

  
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(repos => {
      loader.style.display = "none";
      console.log(repos)
      reposContainer.innerHTML = "";

      repos.forEach(repo => {
        console.log(repo.language)
        const lang = repo.language ? repo.language.toLowerCase() : "Not specified";


       // if (lang === topic.toLowerCase()) {
          const repoElement = document.createElement("div");
          repoElement.classList.add("repo");

          repoElement.innerHTML = `
          <div class="repo-container">
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available"}</p>
            <p class="topic"> ${lang}</p>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"><p class="repo-link"> Visit Repository  <i class="bi bi-link-45deg"></i></p></a>
          </div>
          `;

          reposContainer.appendChild(repoElement);
        //}
      });
    })
    .catch(error => {
      loader.style.display = "none";
      console.error("Error fetching GitHub repositories:", error);
      reposContainer.innerHTML = "<p>Error fetching repositories. Please try again later.</p>";
    });
}
