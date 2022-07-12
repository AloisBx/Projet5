import getCartTmpl from './tmpl/tmplCart.js';

fetch("http://localhost:3000/api/products")
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then((APIproduct) => {
        //appel de la fonction products
        cartDisplay(APIproduct);
    })
    .catch((err) => {
        // Une erreur est survenue
    });


function cartDisplay(i) {
    let panier = JSON.parse(localStorage.getItem("userCart"));
    if (panier && panier.length > 0) {
        for (let j of panier) {
            for (let g = 0, k = i.length; g < k; g++) {
                if (j._id === i[g]._id) {
                    j.name = i[g].name;
                    j.price = i[g].price;
                    j.image = i[g].imageUrl;
                    j.description = i[g].description;
                    j.alt = i[g].altTxt;
                }
            }
        }
        // fontion d'affichage ici avec le template
        // console.log("Panier 1: ",panier);
        let section = document.getElementById("cart__items");
        for (let index of panier) {
            const article = document.createElement("article");
            setAttributes(article, {
                "class": "cart__item", "data-id": `${index._id}`,
                "data-couleur": `${index.color}`, "data-quantité": `${index.quantity}`
            });
            article.innerHTML = getCartTmpl(index);
            section.appendChild(article);
        }
        priceQuantityProducts();
        // console.log("Panier 99: ",panier);
    } else {
        document.getElementById("totalQuantity").innerHTML = "0";
        document.getElementById("totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML = "Vous n'avez aucun article dans votre panier";
    }
    console.log(" 1: ");
    quantityAdjuster();
    supprProduct();
    console.log(" 99: ");

}
// fonction pour rentrer plusieurs attributs
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function priceQuantityProducts() {
    let quantityProducts = 0;
    let price = 0;
    let panier = JSON.parse(localStorage.getItem("userCart"));
    for (let product of panier) {
        quantityProducts += JSON.parse(product.quantity);
        price += JSON.parse(product.quantity) * JSON.parse(product.price);;
    }
    document.getElementById("totalQuantity").textContent = quantityProducts;
    document.getElementById("totalPrice").textContent = price;
}

//fonction qui modifie les quantités du panier de manière dynamique
function quantityAdjuster() {
    const cart = document.querySelectorAll(".cart__item");
    cart.forEach((cart) => {
        cart.addEventListener("change", (event) => {
            let panier = JSON.parse(localStorage.getItem("userCart"));
            // console.log("Panier 1:", panier);
            for (let product of panier) {
                // console.log("Panier 2:", event.target.value, product.color, cart.dataset.couleur);
                if (product._id === cart.dataset.id && cart.dataset.couleur === product.color) {
                    product.quantity = event.target.value;
                    localStorage.userCart = JSON.stringify(panier);
                    priceQuantityProducts();
                }
            }
        });
    });
}

// fonction qui supprime un produit du panier et met le panier à jour + reload pour l'affichage
function supprProduct() {
    // QUESTION : Element.closest() ??
    const deleteItem = document.querySelectorAll(".cart__item .deleteItem");
    deleteItem.forEach((deleteItem) => {
        deleteItem.addEventListener("click", () => {
            let panier = JSON.parse(localStorage.getItem("userCart"));
            for (let i = 0; i < panier.length; i++) {
                if (panier[i]._id === deleteItem.dataset.id && panier[i].color === deleteItem.dataset.couleur) {
                    let panierFinal = JSON.parse(localStorage.getItem("userCart"));
                    panierFinal.splice(i, 1);
                    if (panierFinal && panierFinal.length == 0) {
                        document.getElementById("totalQuantity").innerHTML = "0";
                        document.getElementById("totalPrice").innerHTML = "0";
                        document.querySelector("h1").innerHTML = "Vous n'avez aucun article dans votre panier";
                    }
                    localStorage.userCart = JSON.stringify(panierFinal);
                    return location.reload();
                }
            }
        });
    });

}