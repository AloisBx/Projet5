const getCartTmpl = (index) => {
    return `
            <div class="cart__item__img">
                <img src="${index.image}" alt="${index.alt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                    <h2>${index.name}</h2>
                    <span>couleur : ${index.color}</span>
                    <p data-prix="${index.price}">${index.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${index.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem" data-id="${index._id}" data-couleur="${index.color}">Supprimer</p>
                    </div>
                </div>
            </div>
        `
}

export default getCartTmpl;