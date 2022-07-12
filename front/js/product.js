// recuperation des params de URLSearch
const params = new URLSearchParams(document.location.search);
// recupération de l'id dans les params
const id = params.get("_id");
// console.log(id);

fetch("http://localhost:3000/api/products")
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then((APIproduct) => {
        products(APIproduct);
    })
    .catch(function (err) {
        // Une erreur est survenue
    });

let clientInfo = {};
clientInfo._id = id;

function products(APIproduct) {
    let img = document.querySelector("article div.item__img");
    let title = document.getElementById("title");
    let price = document.getElementById("price");
    let description = document.getElementById("description");
    let optcolors = document.getElementById("colors");

    for (let chosenProduct of APIproduct) {
        if (id === chosenProduct._id) {
            img.innerHTML = `<img src="${chosenProduct.imageUrl}" alt="${chosenProduct.altTxt}">`;
            title.textContent = chosenProduct.name;
            price.textContent = chosenProduct.price;
            description.textContent = chosenProduct.description;

            clientInfo.price = chosenProduct.price;
            console.log(clientInfo);

            for (let color of chosenProduct.colors) {
                optcolors.innerHTML += `<option value="${color}">${color}</option>`;
            }
        }
    }
}

// choix de la couleur
let chosenColor = document.getElementById("colors");
chosenColor.addEventListener("input", (colorEvent) => {
    let productColor;
    productColor = colorEvent.target.value;
    clientInfo.color = productColor;
    document.getElementById("addToCart").style.color = "white";

    // console.log(clientInfo)
});

// choix de la quantité
let finalQuantity;
let chosenQuantity = document.querySelector('input[id="quantity"]');
chosenQuantity.addEventListener("input", (quantityEvent) => {
    finalQuantity = quantityEvent.target.value;
    clientInfo.quantity = finalQuantity;

    // console.log(clientInfo)
});

// tous les tableaux nessessaire
let init = [];
let local = [];
let pushProducts = [];
let tmp = [];

// panier du client
function clientCart() {
    local = JSON.parse(localStorage.getItem("userCart"));
    if (local === null) {
        init.push(clientInfo);
        return (localStorage.userCart = JSON.stringify(init));
    } else {
        for (let i of local) {
            if (i._id === id && i.color === clientInfo.color) {
                alert("Attention : produit déjà dans le panier.");
                let total = parseInt(i.quantity) + parseInt(finalQuantity);
                i.quantity = JSON.stringify(total);
                return (localStorage.userCart = JSON.stringify(local));
            }
        }
        pushProducts = [];
        tmp.push(clientInfo);
        pushProducts = local.concat(tmp);
        tmp = [];
        return (localStorage.userCart = JSON.stringify(pushProducts));
    }
}

let validationButton = document.getElementById("addToCart");
validationButton.addEventListener("click", () => {
    if (clientInfo.quantity < 0 || clientInfo.quantity > 100 || clientInfo.quantity === undefined) {
        alert("Erreur : veuillez choisir une quantité entre 1 et 100. Merci.");
    } else {
        if (clientInfo.color === "" || clientInfo.color === undefined) {
            alert("Erreur : veuillez choisir une couleur valide. Merci.");
        } else {
            clientCart();
            document.getElementById("addToCart").textContent = "Produit ajouté !";
        }
    }
});

