import dataInfo from "./data.json" assert { type: "json" };
import {MenuCard, callCartFunctions, generateCart, addToCart, checkAddedProductsToCart, checkCartProducts} from "./home.js";

export const data = dataInfo;

window.addEventListener("load", () => {
    const cardWrapper = document.querySelector('.card-wrapper');
    
    if (cardWrapper) {
        for (let i = 0; i < 3; i++) {
            new MenuCard(data[i], '.card-wrapper').render();
        }
    }

    generateCart();
    callCartFunctions();
    addToCart();
    checkCartProducts();
    checkAddedProductsToCart();
});
