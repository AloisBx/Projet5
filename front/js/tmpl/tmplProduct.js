 const getProductTmpl = (article) => {
    return `
    <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3 class="product-title">${article.name}</h3>
        <p class="product-description">${article.description}</p>
    </article>
    `
}

export default getProductTmpl;