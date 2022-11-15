import {
    MenuCard,
    callCartFunctions,
    addToCart,
    checkAddedProductsToCart,
    checkCartProducts,
} from './home.js';
import { data } from './script.js';

window.addEventListener('load', () => {
    const body = document.body;
    const products = body.querySelector('.products');
    const listWrapper = body.querySelector('.company-list');
    const searchInput = body.querySelector('.search');
    const inputRange = body.querySelector('.styled-range');

    let companyArr = new Set();

    function generateCardProduct(arr) {
        removeProductCard();
        arr.forEach((item) => {
            new MenuCard(item, '.products .card-wrapper').render();
        });
        checkAddedProductsToCart();
    }

    function removeProductCard() {
        const productsCard = products.querySelectorAll('.product-card');

        productsCard &&
            productsCard.forEach((item) => {
                item.remove();
            });
    }

    listWrapper &&
        listWrapper.addEventListener('click', (e) => {
            const listLinks = products.querySelectorAll('.company-link');

            if (e.target.classList.contains('company-link')) {
                searchInput.value = '';
                if (e.target.innerHTML === 'All') {
                    removeProductCard();

                    data.forEach((item) => {
                        if (item.price <= inputRange.value) {
                            new MenuCard(
                                item,
                                '.products .card-wrapper'
                            ).render();
                            addToCart();
                            checkAddedProductsToCart();
                        }
                    });
                } else {
                    removeProductCard();

                    data.forEach((item) => {
                        if (
                            item.company
                                .toLowerCase()
                                .includes(e.target.innerHTML.toLowerCase()) &&
                            item.price <= inputRange.value
                        ) {
                            new MenuCard(
                                item,
                                '.products .card-wrapper'
                            ).render();
                            addToCart();
                            checkAddedProductsToCart();
                        }
                    });
                }

                listLinks.forEach((item) => {
                    item.classList.remove('active');

                    if (e.target === item) {
                        e.target.classList.add('active');
                    }
                });
            }
        });

    function generateListOfCompany() {
        data.forEach((item) => {
            companyArr.add(item.company);
        });

        companyArr.forEach((item) => {
            const out = `
                <li class="company-link">${item}</li>
            `;
            listWrapper.insertAdjacentHTML('beforeend', out);
        });
    }

    function getRangeValue() {
        const rangeValue = body.querySelector('.range-value');
        let maxPriceValue = 0;
        let minPriceValue = 0;

        data.forEach((item) => {
            if (maxPriceValue < item.price) {
                maxPriceValue = item.price;
                if (!minPriceValue) {
                    minPriceValue = item.price;
                }
            }
            if (item.price < minPriceValue) {
                minPriceValue = item.price;
            }
        });

        inputRange.setAttribute('min', minPriceValue);
        inputRange.setAttribute('max', maxPriceValue);
        rangeValue.innerHTML = `Value: &#36;${maxPriceValue}`;
        inputRange.value = maxPriceValue;

        inputRange.addEventListener('input', function () {
            rangeValue.innerHTML = `Value: &#36;${inputRange.value}`;
            filterByRangeValueChanges();
            addToCart();
        });
    }

    function filterByRangeValueChanges() {
        removeProductCard();
        const checkLink = findActiveCompany();

        data.forEach((item) => {
            if (checkLink === 'All') {
                if (item.price <= inputRange.value) {
                    new MenuCard(item, '.products .card-wrapper').render();
                    addToCart();
                    checkAddedProductsToCart();
                }
            } else {
                if (
                    item.company
                        .toLowerCase()
                        .includes(findActiveCompany().toLowerCase()) &&
                    item.price <= inputRange.value
                ) {
                    new MenuCard(item, '.products .card-wrapper').render();
                    addToCart();
                    checkAddedProductsToCart();
                }
            }
        });
    }

    function generateCardByWords(data, arr, word) {
        if (arr.length <= 1) {
            if (data.name.toLowerCase().includes(word[0].toLowerCase())) {
                new MenuCard(data, '.products .card-wrapper').render();
                addToCart();
                checkAddedProductsToCart();
            }
        } else {
            if (
                data.name.toLowerCase().includes(word[0].toLowerCase()) &&
                data.name.toLowerCase().includes(word[1].toLowerCase())
            ) {
                new MenuCard(data, '.products .card-wrapper').render();
                addToCart();
                checkAddedProductsToCart();
            }
        }
    }

    function outBySearch() {
        searchInput.addEventListener('input', () => {
            let searchStr = searchInput.value;
            let secondtArr = searchStr.replace(/\s+/g, ' ').split(' ');

            removeProductCard();

            data.forEach((item) => {
                if (findActiveCompany() === 'All') {
                    generateCardByWords(item, secondtArr, secondtArr);
                } else {
                    if (
                        item.name
                            .toLowerCase()
                            .includes(secondtArr[0].toLowerCase()) &&
                        item.company
                            .toLowerCase()
                            .includes(findActiveCompany().toLowerCase())
                    ) {
                        generateCardByWords(item, secondtArr, secondtArr);
                    }
                }
                checkAddedProductsToCart();
            });

            if (searchInput.value === '') {
                if (findActiveCompany() === 'All') {
                    removeProductCard();
                    generateCardProduct(data);
                    addToCart();
                } else {
                    removeProductCard();

                    data.forEach((item) => {
                        if (
                            item.company
                                .toLowerCase()
                                .includes(findActiveCompany().toLowerCase())
                        ) {
                            new MenuCard(
                                item,
                                '.products .card-wrapper'
                            ).render();
                        }
                    });
                    addToCart();
                }
                filterByRangeValueChanges();
                checkAddedProductsToCart();
            }
        });
    }

    function findActiveCompany() {
        const listLinks = products.querySelectorAll('.company-link');
        let companyName;

        listLinks.forEach((item) => {
            if (item.classList.contains('active')) {
                companyName = item.innerHTML;
            }
        });

        return companyName;
    }

    getRangeValue();
    outBySearch();
    generateListOfCompany();
    callCartFunctions();
    generateCardProduct(data);
    addToCart();
    checkCartProducts();
});
