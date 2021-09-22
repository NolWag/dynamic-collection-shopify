'use strict'

document.addEventListener("DOMContentLoaded", function(event) { 
    
    const collectionNav = document.getElementById('collection-nav')
    const collectionSelect = document.getElementById('collection-select')
    const collectionGridContainer = document.getElementById('main-collection-product-grid')
    const collectionTitle = document.getElementById('collection__title')

    // Desktop event initialization 
    collectionNav.addEventListener("click", function(e) {
        const id = e.target.id;

        if(id.startsWith('_')) {
            // Remove .active-nav-item from all elements
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active-nav-item'))
            // Add .active-nav-item to clicked nav item
            e.target.classList.add('active-nav-item')

            let collectionName = e.target.id.substring(1)
            setTimeout(function() {
                getCollection(collectionName)
                getCollectionDescription(collectionName)
            },400)
        }
    })
    
    // Mobile event initialization 
    collectionSelect.addEventListener("change", function() {
        getCollection(collectionSelect.value)
        getCollectionDescription(collectionSelect.value)
    })

    function ClearDOM(element) {
        // Removes existing collection items from DOM
        const ul = document.querySelectorAll(element)
        // Loop over all existing .grid__item elements an remove from DOM
        for (let i = 0; i < ul.length; i++) {
            ul[i].remove()
        }
    }

    function getCollectionDescription(collectionName) {
        // Make AJAX request for collection
        var http = new XMLHttpRequest();    
        var url = '/collections.json';
        var params = '';
        http.open('GET', url, true);

        console.log(collectionName)

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                // Parse returned data from string
                const Collections = JSON.parse(http.responseText)
                // Filter array
                const getCollectionByTitle = title => Collections.collections.filter((v, i) => v.title === title).reduce(p => p)
                // Find collection name
                const collectionAll = getCollectionByTitle(collectionName)
                // Append to DOM
                const collectionDescription = document.getElementById('collection__description')
                collectionDescription.innerHTML = collectionAll.description
            }
        }
        http.send();
    }

    function doesExist(product_data) {
        if(!product_data) {
            console.log('in here')
            return "data"
        }
    }

    function getCollection(collectionName) {
    // Change URL
    window.history.pushState("object or string", "Title", collectionName)
    // Change collection Title 
    collectionTitle.innerText = collectionName
    // Make AJAX request for collection
    var http = new XMLHttpRequest();    
    var url = '/collections/' + collectionName + '/products.json';
    var params = '';
    http.open('GET', url, true);

    let collectionProducts = {}


    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            // Parse returned data from string
            collectionProducts = JSON.parse(http.responseText)
            // Removes existing collection items from DOM
            ClearDOM('.grid__item')
            console.log(collectionProducts.products)
            // Length of products in collection
            const collectionLength = collectionProducts.products.length;
            // Loop that creates appends new element into DOM
            console.log(collectionLength, 'collection length')
            for (let i = 0; i <= collectionLength; i++) {
                
                let handle = collectionProducts.products[i].handle
                let title = collectionProducts.products[i].title
                let image = collectionProducts.products[i].images[0].src
                let price = collectionProducts.products[i].variants[0].price
                
                console.log(handle, "handle")
                //console.log(Product.images[0].src, "image")
                
                // if(Product.images[0].src == null) {
                //     console.log('yes')
                // } 
                //console.log(image, 'image')
                //console.log(handle, title, image, price)

                // Template literal of appended element
                let ele =  `
                    <div class="card-wrapper">
                        <a href="/products/${ handle }" class="full-unstyled-link">
                            <span class="visually-hidden">${ title }</span>
                        <div class="card card--product card--outline">
                            <div class="card__inner">
                                <div>
                                    <div class="media media--transparent media--square media--hover-effect">
                                        <img class="motion-reduce" style="width: 100%;display:block;" src="${ image || '' }" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-information">
                            <div class="card-information__wrapper">
                                <span class="card-information__text h5">${ title }</span>
                                <div>
                                    <span class="price-item price-item--regular">$ ${ price } USD</span>
                                </div>
                            </div>
                        </div>
                        </a>
                    </div>
                `
                // Create new element to append above template to
                let newcontent = document.createElement('li')
                newcontent.className = "grid__item"
                newcontent.innerHTML = ele;
                console.log(ele, "template")
                collectionGridContainer.appendChild(newcontent)
            }
        }
    }     
    http.send();
    }
})
