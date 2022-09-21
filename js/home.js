import { data } from "./script.js";

export let cart = [];
export let countProducts = [];

export function callCartFunctions() {
    const body = document.body;
    const cartBlock = body.querySelector('.cart-block');
    const cartPanel = body.querySelector('.cart-panel');
    const blackput = body.querySelector('.blackput');
    const cartProduct = body.querySelectorAll('.cart-product');

    if (JSON.parse(localStorage.getItem('cartProducts')) !== null) {
        cart = JSON.parse(localStorage.getItem('cartProducts'));
    }

    function checkLocalCountProducts() {
        if (localStorage.getItem('countProducts') !== null) {
            countProducts = JSON.parse(localStorage.getItem('countProducts'));
        }
    }

    function closeCart() {
        const closeCartBtn = body.querySelector('.fa-xmark');

        function hideCart() {
            cartBlock.classList.remove('show');
            setTimeout(() => blackput.classList.add('hide'), 500);
            body.classList.remove('block-scroll');
        }

        closeCartBtn.addEventListener('click', () => {
            hideCart();
        });

        document.addEventListener('click', (e) => {
            const blackput = body.querySelector('.blackput');

            if (e.target === blackput) {
                hideCart();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' && !cartPanel.classList.contains('hide')) {
                hideCart();
            }
        });

        if (!cart.length) {
            body.querySelector('.amount').classList.add('hide');
        }

        checkAddedProductsToCart();
        showAmountProdutsInCart();
    }

    function checkoutCart() {
        const checkoutBtn = body.querySelector('.btn-checkout');
        const btnAdd = body.querySelectorAll('.add-to-cart');
        const btnAdded = body.querySelectorAll('.added-to-cart');
        const cartProductsWrap = body.querySelector('.cart-products-wrap');

        checkoutBtn.addEventListener('click', () => {
            localStorage.clear();
            cart = [];
            generateCart();
            totalCost();
            body.querySelector('.amount').classList.add('hide');

            btnAdd.forEach((item, index) => {
                item.classList.remove('hide');
                btnAdded[index].classList.add('hide');
            });

            const outMessage = 'Thank you for your order, we will contact you soon';
            cartProductsWrap.innerHTML = outMessage;

            setTimeout(() => {
                cartProductsWrap.innerHTML = '';
            }, 5000);
        });
    }

    function openCart() {
        const openCartBtn = body.querySelector('.cart-wrapper-icon');

        openCartBtn.addEventListener('click', () => {
            cartBlock.classList.add('show');
            blackput.classList.remove('hide');
            body.classList.add('block-scroll');

            closeCart();
            generateCart();
            cartProductsCount();
            getCountByLocal();
            removeCartProduct();
            compareLocalData();
            checkoutCart();
            totalCost();
        });
    }

    function cartProductsCount() {
        const productsCount = body.querySelectorAll('.product-count');
        const productCountPLus = body.querySelectorAll('.fa-angle-up');
        const productCountMinus = body.querySelectorAll('.fa-angle-down');

        checkLocalCountProducts();

        productCountPLus.forEach((item, index) => {
            item.addEventListener('click', function () {
                if (cartProduct) {
                    const idCard = this.closest('.cart-product').getAttribute('id');
                    const result = checkCartProducts('countProducts', idCard);

                    productsCount[index].textContent = ++productsCount[index].textContent;
                    cart.forEach(item => {
                        if (result) {
                            countProducts.push({
                                id: +item.id,
                                count: +productsCount[index].textContent
                            });
                            localStorage.setItem('countProducts', JSON.stringify(countProducts));
                        } else {
                            countProducts[index].count = +productsCount[index].textContent;
                            localStorage.setItem('countProducts', JSON.stringify(countProducts));
                        }
                    });
                    totalCost();
                }
            });
        });

        productCountMinus.forEach((item, index) => {
            item.addEventListener('click', function () {
                if (cartProduct) {
                    const idCard = this.closest('.cart-product').getAttribute('id');
                    const result = checkCartProducts('countProducts', idCard);

                    if (productsCount[index].textContent > 1) {
                        productsCount[index].textContent = --productsCount[index].textContent;
                        cart.forEach(item => {
                            if (result) {
                                countProducts.push({
                                    id: +item.id,
                                    count: +productsCount[index].textContent
                                });
                                localStorage.setItem('countProducts', JSON.stringify(countProducts));
                            } else {
                                countProducts[index].count = +productsCount[index].textContent;
                                localStorage.setItem('countProducts', JSON.stringify(countProducts));
                            }
                        });
                    }
                    totalCost();
                }
            });
        });
    }

    function getCountByLocal() {
        const productsCount = body.querySelectorAll('.product-count');
        const localItems = JSON.parse(localStorage.getItem('cartProducts'));
        const countProducts = JSON.parse(localStorage.getItem('countProducts'));
        let count;

        if (countProducts && localItems) {
            for (let i = 0; i < localItems.length; i++) {
                for (let j = 0; j < countProducts.length; j++) {
                    if (+localItems[i].id === +countProducts[j].id) {
                        count = countProducts[j].count;
                        productsCount[i].innerHTML = count;
                    }
                }
            }
        }
    }

    function compareLocalData() {
        const count = body.querySelectorAll('.product-count');

        countProducts = [];

        count && count.forEach((item, index) => {
            const productId = item.closest('.cart-product').getAttribute('id');
            countProducts.push({
                id: +productId,
                count: +count[index].innerHTML
            });
        });
        localStorage.setItem('countProducts', JSON.stringify(countProducts));
    }

    if (cart.length) {
        showAmountProdutsInCart();
    }

    function resetCartProducts() {
        generateCart();
        cartProductsCount();
        totalCost();
        removeCartProduct();
    }

    function removeCartProduct() {
        const removeCartProsuctBtn = body.querySelectorAll('.remove-product');

        removeCartProsuctBtn.forEach(item => {
            item.addEventListener('click', (e) => {
                if (cartProduct) {
                    const idCartProduct = e.target.closest('.cart-product').getAttribute('id');

                    cart = cart.filter(item => +item.id !== +idCartProduct);
                    localStorage.setItem('cartProducts', JSON.stringify(cart));
                    countProducts = countProducts.filter(item => item.id !== +idCartProduct);
                    localStorage.setItem('countProducts', JSON.stringify(countProducts));

                    resetCartProducts();
                    getCountByLocal();
                    showAmountProdutsInCart();

                    if (!cart.length) {
                        body.querySelector('.amount').classList.add('hide');
                    }
                    checkAddedProductsToCart(idCartProduct);
                }
            });
        });
    }

    function totalCost() {
        const totalCostWrap = body.querySelector('.total-cost');
        const localItems = JSON.parse(localStorage.getItem('cartProducts'));
        const countProducts = JSON.parse(localStorage.getItem('countProducts'));
        
        let total = 0;

        if (localItems) {
            cart && cart.forEach((item, index) => {
                total += +item.price * +countProducts[index].count;
            });
            totalCostWrap.innerHTML = `&#36;${total}`;
        } else {
            totalCostWrap.innerHTML = '&#36;0';
        }
    }

    openCart();
    checkLocalCountProducts();
}

export function addToCart() {
    const addToCartBtn = document.querySelectorAll('.add-to-cart');

    addToCartBtn.forEach(item => {
        item.addEventListener('click', (e) => {
            const cardId = e.target.closest('.product-card').getAttribute('id');
            const cartHasProductCard = checkCartProducts('cartProducts', cardId);

            data.forEach(item => {
                if (item.id === +cardId) {
                    if (cartHasProductCard) {
                        cart.push(item);
                        localStorage.setItem('cartProducts', JSON.stringify(cart));
                        showAmountProdutsInCart();
                        checkAddedProductsToCart();
                    }
                }
            });
        });
    });
}

export function checkAddedProductsToCart(idCartProduct) {
    const btnAdd = document.querySelectorAll('.add-to-cart');
    const btnAdded = document.querySelectorAll('.added-to-cart');
    const localItems = JSON.parse(localStorage.getItem('cartProducts'));

    btnAdd.forEach((item, index) => {
        let id = item.closest('.product-card').getAttribute('id');
        if (idCartProduct) {
            if (+id === +idCartProduct) {
                item.classList.remove('hide');
                btnAdded[index].classList.add('hide');
            }
        } else {
            localItems && localItems.forEach(localItem => {
                if (+id === +localItem.id) {
                    item.classList.add('hide');
                    btnAdded[index].classList.remove('hide');
                }
            });
        }
    });
}

export function showAmountProdutsInCart() {
    const localItems = JSON.parse(localStorage.getItem('cartProducts'));
    const amountWrap = document.querySelector('.amount');

    if (localItems) {
        amountWrap.classList.remove('hide');
        amountWrap.innerHTML = localItems.length;
    }
}

export function generateCart() {
    const cartProducts = document.querySelectorAll('.cart-product');
    const localItems = JSON.parse(localStorage.getItem('cartProducts'));

    cartProducts.forEach(item => {
        item.remove();
    });

    if (localItems) {
        localItems.forEach(item => {
            new CartCard(item, '.cart-products-wrap').renderCartCard();
            showAmountProdutsInCart();
        });
    }
}

export function checkCartProducts(key, idProductCard) {
    const localItems = JSON.parse(localStorage.getItem(key));
    let result = true;

    if (localItems) {
        for (let i = 0; i < localItems.length; i++) {
            if (+localItems[i].id === +idProductCard) {
                result = false;
                break;
            }
        }
        return result;
    } else {
        return result;
    }
}

export class MenuCard {
    constructor(item, parent) {
        this.src = item.image;
        this.alt = item.name;
        this.name = item.name;
        this.price = item.price;
        this.id = item.id;
        this.parent = document.querySelector(parent);
    }

    render() {
        const out = `
            <div class="product-card" id="${this.id}">
                <div class="card-img-wrap">
                    <img src="${this.src}" alt="${this.alt}">
                    <div class='card-img-inner'></div>
                    <button class="add-to-cart">Add to cart</button>
                    <button class="added-to-cart hide">Added to cart</button>
                </div>
                <span class="product-title">${this.name}</span>
                <span class="product-cost">&#36;${this.price}</span>
            </div>
        `;
        this.parent.insertAdjacentHTML('beforeend', out);
    }
}

export class CartCard extends MenuCard {
    renderCartCard() {
        const out = `
            <div class="cart-product" id="${this.id}">
                <div class="cart-image"=>
                    <img src="${this.src}" alt="${this.alt}">
                </div>
                <div class="cart-product-info">
                    <div class="cart-product-descr">
                        <div class="product-descr">
                            <span class="product-name">${this.name}</span>
                            <span class="product-cost">&#36;${this.price}</span>
                        </div>
                        <span class="remove-product">remove</span>
                    </div>
                    <div class="counter-wrap">
                        <i class="fa-sharp fa-solid fa-angle-up"></i>
                        <span class="product-count">1</span>
                        <i class="fa-sharp fa-solid fa-angle-down"></i>
                    </div>
                </div>
            </div>
        `;
        this.parent.insertAdjacentHTML('beforeend', out);
    }
}
