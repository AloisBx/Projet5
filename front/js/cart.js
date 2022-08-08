import getCartTmpl from "./tmpl/tmplCart.js";

let products = [];
const productsRes = await fetch("http://localhost:3000/api/products");
products = productsRes.ok ? await productsRes.json() : [];
cartDisplay(products);

// eviter le reload avec une fonction affichage propre
function cartDisplay(product) {
    let panier = JSON.parse(localStorage.getItem("userCart"));
    if (panier && panier.length > 0) {
        for (let j of panier) {
            for (let g = 0; g < product.length; g++) {
                if (j._id === product[g]._id) {
                    j.name = product[g].name;
                    j.price = product[g].price;
                    j.image = product[g].imageUrl;
                    j.description = product[g].description;
                    j.alt = product[g].altTxt;
                }
            }
        }
        // affichage ici avec le template
        // console.log("Panier 1: ",panier);
        affichage(panier);
        priceQuantityProducts();
        // console.log("Panier 99: ",panier);
    } else {
        document.getElementById("cart__items").innerHTML = "";
        document.getElementById("totalQuantity").innerHTML = "0";
        document.getElementById("totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML = "Vous n'avez aucun article dans votre panier";
    }
    // console.log(" 1: ");
    quantityAdjuster();
    supprProduct();
    // console.log(" 99: ");
}
// fonction pour rentrer plusieurs attributs
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
function affichage(panier) {
    let section = document.getElementById("cart__items");
    section.innerHTML = "";
    for (let index of panier) {
        const article = document.createElement("article");
        setAttributes(article, {
            class: "cart__item",
            "data-id": `${index._id}`,
            "data-couleur": `${index.color}`,
            "data-quantité": `${index.quantity}`,
        });
        article.innerHTML = getCartTmpl(index);
        section.appendChild(article);
    }
}

function priceQuantityProducts() {
    let quantityProducts = 0;
    let price = 0;
    let panier = JSON.parse(localStorage.getItem("userCart"));
    for (let product of panier) {
        quantityProducts += JSON.parse(product.quantity);
        price += JSON.parse(product.quantity) * JSON.parse(product.price);
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
                if (
                    product._id === cart.dataset.id &&
                    cart.dataset.couleur === product.color
                ) {
                    product.quantity = event.target.value;
                    localStorage.userCart = JSON.stringify(panier);
                    priceQuantityProducts();
                }
            }
        });
    });
}

// fonction qui supprime un produit du panier et met le panier à jour
function supprProduct() {
    const deleteItem = document.querySelectorAll(".cart__item .deleteItem");
    deleteItem.forEach((deleteItem) => {
        deleteItem.addEventListener("click", () => {
            let panier = JSON.parse(localStorage.getItem("userCart"));
            panier = panier.filter(
                (el) =>
                    el._id !== deleteItem.dataset.id &&
                    el.color !== deleteItem.dataset.couleur
            );
            localStorage.userCart = JSON.stringify(panier);
            cartDisplay(products);
        });
    });
}

//partie formulaire

// regex pour les lettres
let regLetters = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// regex pour les lettres et les chiffres
let regLettersNumbers = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
// regex pour les emails
let regValidMail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regValidMailOrder =
    /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;

var infoClient = {};
localStorage.infoClient = JSON.stringify(infoClient);

var prenom = document.getElementById("firstName");
prenom.classList.add("regex_texte");

var nom = document.getElementById("lastName");
nom.classList.add("regex_texte");

var ville = document.getElementById("city");
ville.classList.add("regex_texte");

var adresse = document.getElementById("address");
adresse.classList.add("regex_adresse");

var email = document.getElementById("email");
email.classList.add("regex_email");

var regexTexte = document.querySelectorAll(".regex_texte");
document.getElementById("email").setAttribute("type", "text");

regexTexte.forEach((regexTexte) =>
    regexTexte.addEventListener("input", (event) => {
        let input = event.target.value;
        let regNormal = input.search(regLetters);
        if (regNormal === 0) {
            infoClient.firstName = prenom.value;
            infoClient.lastName = nom.value;
            infoClient.city = ville.value;
        }
        if (
            infoClient.firstName !== "" &&
            infoClient.lastName !== "" &&
            infoClient.city !== "" &&
            regNormal === 0
        ) {
            infoClient.resLetters = 1;
        } else {
            infoClient.resLetters = 0;
        }
        localStorage.infoClient = JSON.stringify(infoClient);
        orderChecker();
        console.log("infoClient.firstName : " + infoClient.firstName);
    })
);
testAnswer(regLetters, "#firstNameErrorMsg", prenom);
testAnswer(regLetters, "#lastNameErrorMsg", nom);
testAnswer(regLetters, "#cityErrorMsg", ville);

let resAdresse = document.querySelector(".regex_adresse");
resAdresse.addEventListener("input", (event) => {
    let input = event.target.value;
    let regAdresse = input.search(regLettersNumbers);
    if (regAdresse == 0) {
        infoClient.address = adresse.value;
    }
    if (infoClient.address !== "" && regAdresse === 0) {
        infoClient.resAdresse = 1;
    } else {
        infoClient.resAdresse = 0;
    }
    localStorage.infoClient = JSON.stringify(infoClient);
    orderChecker();
});
testAnswer(regLettersNumbers, "#addressErrorMsg", adresse);

let resEmail = document.querySelector(".regex_email");
resEmail.addEventListener("input", (input) => {
    let res = input.target.value;
    let regValid = res.search(regValidMail);
    let regMatch = res.match(regValidMailOrder);
    if (regValid === 0 && regMatch !== null) {
        infoClient.email = email.value;
        infoClient.resEmail = 1;
    } else {
        infoClient.resEmail = 0;
    }
    localStorage.infoClient = JSON.stringify(infoClient);
    orderChecker();
});

email.addEventListener("input", (input) => {
    let res = input.target.value;
    let regMatch = res.match(regValidMailOrder);
    let regValid = res.search(regValidMail);
    if (res === "" && regMatch === null) {
        document.getElementById("emailErrorMsg").innerHTML =
            "Champ vide, veuillez renseigner votre email.";
        document.getElementById("emailErrorMsg").style.color = "white";
    } else if (regValid !== 0) {
        document.getElementById("emailErrorMsg").innerHTML = "Caractères invalide.";
        document.getElementById("emailErrorMsg").style.color = "white";
    } else if (res != "" && regMatch == null) {
        document.getElementById("emailErrorMsg").innerHTML =
            "Erreur, veuillez ressaisir votre email.";
        document.getElementById("emailErrorMsg").style.color = "white";
    } else {
        document.getElementById("emailErrorMsg").innerHTML = "Email correct.";
        document.getElementById("emailErrorMsg").style.color = "white";
    }
});

function testAnswer(regex, balise, listener) {
    listener.addEventListener("input", (input) => {
        let res = input.target.value;
        let index = res.search(regex);
        // console.log("index :" + index);
        if (res === "" && index != 0) {
            document.querySelector(balise).innerHTML =
                "Champ vide, veuillez le renseigner.";
            document.querySelector(balise).style.color = "white";
        } else if (res !== "" && index != 0) {
            document.querySelector(balise).innerHTML = "Données invalides.";
            document.querySelector(balise).style.color = "white";
        } else {
            document.querySelector(balise).innerHTML = "Données valides.";
            document.querySelector(balise).style.color = "white";
        }
    });
}

// order = btn commander
let order = document.getElementById("order");
function orderChecker() {
    let infoClientStorage = JSON.parse(localStorage.getItem("infoClient"));
    let sum =
        infoClientStorage.resLetters +
        infoClientStorage.resAdresse +
        infoClientStorage.resEmail;
    if (sum === 3) {
        order.removeAttribute("disabled", "disabled");
        document.getElementById("order").setAttribute("value", "Commander !");
    } else {
        order.setAttribute("disabled", "disabled");
        document
            .getElementById("order")
            .setAttribute("value", "Remplir le formulaire");
    }
}

order.addEventListener("click", (click) => {
    click.preventDefault();
    orderChecker();
    postDispatch();
});

function postDispatch() {
    let productsID = [];
    let panier = JSON.parse(localStorage.getItem("userCart"));
    if (panier && panier.length > 0) {
        for (let i of panier) {
            productsID.push(i._id);
        }
    } else {
        document
            .getElementById("order")
            .setAttribute("value", "Votre panier est vide.");
    }
    let infoClientStorage;
    infoClientStorage = JSON.parse(localStorage.getItem("infoClient"));
    let orderObj = {
        contact: {
            firstName: infoClientStorage.firstName,
            lastName: infoClientStorage.lastName,
            address: infoClientStorage.address,
            city: infoClientStorage.city,
            email: infoClientStorage.email,
        },
        products: productsID,
    };
    let sum =
        infoClientStorage.resLetters +
        infoClientStorage.resAdresse +
        infoClientStorage.resEmail;
    if (sum === 3 && productsID.length > 0) {
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderObj),
        })
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (data) {
                return (window.location.href = `/front/html/confirmation.html?order=${data.orderId}`);
            })
            .catch(function (err) {
                // Une erreur est survenue
            });
    }
}