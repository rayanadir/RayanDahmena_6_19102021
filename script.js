fetch('photographers.json').then(res => {
        return res.json();
    }).then(data => {
            //console.log(data.photographers);
            //console.log(data.media);
            const photographers = data.photographers;
            document.getElementById("photographers").innerHTML = `
          ${photographers.map((photographer)=>`
          <article class="photographers__photographer">
          <a href="/photographer-page/photographer-page.html?id=${photographer.id}">
          <img class="photographers__img" src="${photographer.portrait}" alt="${photographer.name}">
          </a>

          <h2 class="photographers__name">
               ${photographer.name}
          </h2>
          <p class="photographers__localisation">
               ${photographer.city},${photographer.country}
          </p>
          <p class="photographers__description">
               ${photographer.tagline}
          </p>
          <p class="photographers__price">
               ${photographer.price}€ / jour
          </p>
          <div class="photographers__tags">
          ${photographer.tags.map((tag)=>`<li class="photographers__tag"> #${tag}</li>`).join('')} 
          </div>
          </article>
          `).join('')}
     `
})