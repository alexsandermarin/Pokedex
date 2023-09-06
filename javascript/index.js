
const getTypeColor = type => {
    const normal = '#BCBCAC'; //
    return{
        normal,
        fire : '#FF421C', //
        grass : '#78CD54', //
        electric : '#FFCD30', //
        ice : '#78DEFF', //
        water : '#2F9AFF', //
        ground : '#DEBC54', //
        rock : '#BCAC66', //
        fairy : '#FFACFF', //
        poison : '#AB549A', //
        bug : '#ABBC1C', //
        ghost : '#6666BC', //
        dragon : '#7866EF', //
        psychic : '#FF549A', //
        fighting : '#BC5442', //
        flying : '#669AFF', //
        steel: '#ABACBC' //
    }[type] || normal
}
const getStatsName = type => {
    const hp = 'HP';
    return{
        hp,
        attack : 'ATK',
        defense : 'DEF',
        "special-attack" : 'SpD',
        "special-defense" : 'SpA',
        speed : 'SPD'
    }[type] || hp
}

const getPokemons = async responseResults => {

        const promises = responseResults.map(result => fetch(result.url))
 
        const responses = await Promise.allSettled(promises)
        
        const fulfilled = responses.filter(response => response.status === 'fulfilled')
 
        const pokePromises = fulfilled.map(url => url.value.json())

        console.log(fulfilled)

        return await Promise.all(pokePromises)
}

const pokemonsProps = async responseResults => {
    const pokemons = await getPokemons(responseResults)

    return{
        id : pokemons.map(filfilled => filfilled.id),
        name : pokemons.map(fulfilled => fulfilled.name),
        stats : pokemons.map(fulfilled => fulfilled.stats),
        weight : pokemons.map(fulfilled => fulfilled.weight),
        height : pokemons.map(fulfilled => fulfilled.height),
        species: pokemons.map(filfilled => filfilled.species.url),
        types : pokemons.map(fulfilled => fulfilled.types.map(info => info.type.name)),
        abilitys : pokemons.map(fulfilled => fulfilled.abilities.map(info => info.ability.name)),
        imgsStatic : pokemons.map(fulfilled => fulfilled.sprites.versions['generation-v']['black-white']['front_default']),
        imgAnimated : pokemons.map(fulfilled => fulfilled.sprites.versions['generation-v']['black-white'].animated['front_default'])
    }
}
const listPokemon = async responseResults => {
    
    const props = await pokemonsProps(responseResults)
    return props.id.map((id , i) => ({id, name:props.name[i],species:props.species[i], types: props.types[i] , ability: props.abilitys[i] , imgStatic: props.imgsStatic[i] , imgAnimated: props.imgAnimated[i], stats: props.stats[i], weight: props.weight[i] , height: props.height[i] }))
}

const renderListPainel = async (responseResults , inputV , stats) => {
    const pokemonList = await listPokemon(responseResults);

    console.log(pokemonList)

    if(stats) handleClick(pokemonList , 0);

    const existingPokeListener = document.querySelectorAll(".area-pokemon-div");

    if (existingPokeListener) existingPokeListener.forEach(listener => listener.remove())

    if(inputV === undefined) inputV = '';

    const char = inputV.toLowerCase();

    const filter = pokemonList.filter(poke => poke.name.includes(char))

    if(filter.length === 0) console.log("vazio")

    const containerList = document.getElementById("pokemon-container")
    
    filter.forEach((obj) => {
        const divElement = document.createElement("div")

        
        divElement.classList.add("area-pokemon-div")
        divElement.onclick = () => handleClick(pokemonList , pokemonList.indexOf(obj))
        //adiciona o elemento na div principal
        containerList.appendChild(divElement)

        const imgStatic = document.createElement("img");
        imgStatic.src = obj.imgStatic;
        imgStatic.alt = `imagem pokemon ${obj.name}`
        divElement.appendChild(imgStatic);

        const p = document.createElement("p");
        p.textContent = "N° " + obj.id;
        divElement.appendChild(p);

        const h1 = document.createElement("h1");
        h1.textContent = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
        divElement.appendChild(h1);

        const divTypes = document.createElement("div");
        divTypes.classList.add("types-pokemon");
        divElement.appendChild(divTypes);

        

        obj.types.forEach((data) => {
            const span = document.createElement("span");
            span.style.backgroundColor = getTypeColor(data);
            span.textContent = data;
            divTypes.appendChild(span);
        })

    })

}

const handleClick  = async (data , i) => {

    const divContainerPainel = document.getElementById("pokemon-painel");

    const existingPainel = document.querySelector(".painel-pokemon-full");

    if (existingPainel) existingPainel.remove();

    const divPainel = document.createElement("div");
    divPainel.classList.add("painel-pokemon-full");
    divContainerPainel.appendChild(divPainel);

    const responseSinopse = await fetch(data[i].species)
    const responseJson = await responseSinopse.json();
    const flavorText = responseJson.flavor_text_entries[28].flavor_text


    const img = document.createElement("img");
    const p = document.createElement("p");
    const h1 = document.createElement("h1");
    const divSinopse = document.createElement("div")
    const h2Ability = document.createElement("h2");
    const divTypes = document.createElement("div");
    const divHw = document.createElement("div");
    const divAbilitys = document.createElement("div");
    const h2Stats = document.createElement("h2");
    const divStats = document.createElement("div")


        img.src = data[i].imgAnimated;
        img.alt = `imagem pokemon ${data[i].name}`
        divPainel.appendChild(img);

        p.textContent = "N° " + data[i].id;
        divPainel.appendChild(p);

        h1.textContent = data[i].name.charAt(0).toUpperCase() + data[i].name.slice(1);
        divPainel.appendChild(h1);

        data[i].types.forEach(ia => {
            const span = document.createElement("span");
            span.style.backgroundColor = getTypeColor(ia);
            span.textContent = ia;
            divPainel.appendChild(divTypes);
            divTypes.classList.add("types-pokemon");
            divTypes.appendChild(span);
        });

        divSinopse.classList.add('sinopse-pokemon')

        const h2Sinopse = document.createElement("h2")
        h2Sinopse.textContent = "Pokedex Entry"
        divSinopse.appendChild(h2Sinopse)

        const spanSinopse = document.createElement("span")
        spanSinopse.textContent = flavorText
        divSinopse.appendChild(spanSinopse)

        divPainel.appendChild(divSinopse)

        const divInternalH = document.createElement("div");
        divHw.appendChild(divInternalH);

        const h2 = document.createElement("h2");
        h2.textContent = "Height";
        divInternalH.appendChild(h2);

        const span = document.createElement("span");
        span.textContent = data[i].height / 10 + "M";
        divInternalH.appendChild(span);
        
        const divInternalW = document.createElement("div");
        divHw.appendChild(divInternalW);

        const h2W = document.createElement("h2");
        h2W.textContent = "Weight";
        divInternalW.appendChild(h2W);

        const spanW = document.createElement("span");
        spanW.textContent = data[i].weight / 10 + "Kg";
        divInternalW.appendChild(spanW);

        divHw.classList.add("hw-area");
        divPainel.appendChild(divHw);

        h2Ability.textContent = "Abilities";
        divPainel.appendChild(h2Ability)

        divAbilitys.classList.add('hw-area');

        data[i].ability.forEach(ia => {
            const divInternal = document.createElement("div")
            const span = document.createElement("span")

            span.textContent = ia

            divInternal.appendChild(span)
            divAbilitys.appendChild(divInternal)
        })

        divPainel.appendChild(divAbilitys)

        h2Stats.textContent = "Stats";
        divPainel.appendChild(h2Stats)

        let total = 0;
        
        data[i].stats.forEach(ia => {
            const divContainer = document.createElement("div")
            const h2Name = document.createElement('h2')
            const h2Stat = document.createElement('h2')

            h2Name.textContent = getStatsName(ia.stat.name)
            divContainer.appendChild(h2Name)

            h2Stat.textContent = ia.base_stat
            divContainer.appendChild(h2Stat)
            
            total += ia.base_stat

            divStats.appendChild(divContainer)
        })

        const divTotal = document.createElement('div');
        const h2TotalName = document.createElement('h2');
        const h2totalStats = document.createElement('h2');

        h2TotalName.textContent = "TOTAL";
        divTotal.appendChild(h2TotalName)

        h2totalStats.textContent = total;
        divTotal.appendChild(h2totalStats)

        divStats.appendChild(divTotal);

        divStats.classList.add("status-area")
        divPainel.appendChild(divStats)
        
}
const PageLoaded = async (stats) => {
    //url base da api PokeApi
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=24&offset=0'
    try {
        
        const response = await fetch(url)

    if(!response.ok) {
            throw Error('Nao foi possivel obter as informacoes')
        }

        const {results: responseResults} = await response.json()

        await renderListPainel(responseResults , '', stats);

        addEventListener("input" , function() {
            var valorInput = document.getElementById("pokemon-data-input").value;
        
            renderListPainel(responseResults , valorInput)
        })

    } catch (error) {
        console.log('algo deu errado', error);
    }
    
    
}

const status = true;

PageLoaded(status);

const checkbox = document.getElementById('myCheckbox') ;

checkbox.addEventListener('change', function() {

    const rootStyles = document.documentElement.style;

    if (this.checked) {
        const icon = document.querySelector('.bx-moon');
        const containerIcons = document.getElementById("container-icon")

        icon.remove();

        const iconLi = document.createElement("i");
        iconLi.classList.add("bx")
        iconLi.classList.add("bx-sun")

        containerIcons.appendChild(iconLi);

        rootStyles.setProperty('--background-primary', '#28343b')
        rootStyles.setProperty('--background-secondary', '#34434D')
        rootStyles.setProperty('--background-total', '#88AAEA')
        rootStyles.setProperty('--text-color-primary', '#EFF1F7')
        rootStyles.setProperty('--text-color-secondary', '#5D6971')
        rootStyles.setProperty('--opacity-span', '0.6')
    } else {
        const icon = document.querySelector('.bx-sun');
        const containerIcons = document.getElementById("container-icon")

        icon.remove();

        const iconLi = document.createElement("i");
        iconLi.classList.add("bx");
        iconLi.classList.add("bx-moon");
        
        containerIcons.appendChild(iconLi)

        rootStyles.removeProperty('--background-primary')
        rootStyles.removeProperty('--background-secondary')
        rootStyles.removeProperty('--background-total')
        rootStyles.removeProperty('--text-color-primary')
        rootStyles.removeProperty('--text-color-secondary')
        rootStyles.removeProperty('--opacity-span')
    }
});


const adjFont = data => {
    const root = document.documentElement;
    
    const currentSize15 = parseFloat(getComputedStyle(root).getPropertyValue('--font-15'));
    const currentSize25 = parseFloat(getComputedStyle(root).getPropertyValue('--font-25'));
    const currentSize18 = parseFloat(getComputedStyle(root).getPropertyValue('--font-18'));
    const currentSize20 = parseFloat(getComputedStyle(root).getPropertyValue('--font-20'));
    const currentSize40 = parseFloat(getComputedStyle(root).getPropertyValue('--font-40'));

    let newSize15 , newSize25 , newSize18;

    if(data){
        newSize15 = currentSize15 * 1.2;
        newSize25 = currentSize25 * 1.2;
        newSize18 = currentSize18 * 1.2;
        newSize20 = currentSize20 * 1.2;
        newSize40 = currentSize40 * 1.2;
    }else{
        newSize15 = currentSize15 * 0.8;
        newSize25 = currentSize25 * 0.8;
        newSize18 = currentSize18 * 0.8;
        newSize20 = currentSize20 * 0.8;
        newSize40 = currentSize40 * 0.8;
    }

    if (newSize15 >= 12 && newSize15 <= 32) {
        root.style.setProperty('--font-15', newSize15 + 'px');
        root.style.setProperty('--font-25', newSize25 + 'px');
        root.style.setProperty('--font-18', newSize18 + 'px');
        root.style.setProperty('--font-20', newSize20 + 'px');
        root.style.setProperty('--font-40', newSize40 + 'px');
        update((newSize15 / 16 * 100).toFixed(0));
    }
}

const update = data =>{
    const displayDiv = document.getElementById('display-por');
    displayDiv.textContent = data + '%';
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 191) {
      document.getElementById('pokemon-data-input').focus();
      event.preventDefault();
    }
    return
  });
