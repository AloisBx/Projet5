import getProductTmpl from './tmpl/tmplProduct.js'

fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    let link = document.getElementById("items");
    // boucle jusqu'à plus de produit
    for(let article of value){
      const a = document.createElement("a");
      a.setAttribute("href", `./product.html?_id=${article._id}`);
      a.innerHTML = getProductTmpl(article);
      link.appendChild(a);
    }
  })
  .catch(function(err) {
    // Une erreur est survenue
  });
  