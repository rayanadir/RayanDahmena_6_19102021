var tagsArray = [];

function selectTag(event) {
    const tag = event.path[0].innerHTML.substring(1);
    if (tagsArray.indexOf(tag) == -1) {
        tagsArray.push(tag);
    } else {
        tagsArray.splice(tagsArray.indexOf(tag), 1);
    }
    console.log(tagsArray)
    return tagsArray;
}



fetch('photographers.json').then(res => {
        return res.json();
    }).then(data => {

            const photographers = data.photographers;
            const tags = [...new Set(data.photographers.map((photographer) => photographer.tags).flat())];

            tags.forEach((tag) => {
                const li = document.createElement('li');
                li.addEventListener('click', event => {
                    let classValue = event.target.classList.value;
                    if (classValue.indexOf('filtered') === -1) {
                        event.target.classList.add('filtered');
                    } else {
                        event.target.classList.remove('filtered');
                    }
                    selectTag(event);
                    filterPhotographers(photographers);
                })
                li.innerHTML = "#" + tag;
                li.classList.add('header__tag');
                document.getElementById('nav').appendChild(li);
            })
            filterPhotographers(photographers);

            document.getElementById("photographers").innerHTML = `
                      ${photographers.map((photographer) =>
                            photographerTemplate=`
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
                      ${photographer.tags.map((tag) => `<li class="photographers__tag"> #${tag}</li>`).join('')} 
                      </div>
                      </article>
                      `
                           
                           ).join('')}
                 `
})

function filterPhotographers(photographers) {
    photographers.forEach((photographer) => {
        let isFounded = tagsArray.every(ai => photographer.tags.includes(ai));
        if (isFounded) {
            console.log(photographer);
        }
    })
}