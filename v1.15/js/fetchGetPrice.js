chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.operation === "fetchGetPrice") {
            var name = encodeURIComponent(request.name.trim())
                .replace(/%20/g,"")
                .replace(/%2C/g,"");
            console.log(name);
            var url = "https://www.getprice.com.au/buy-best-"+name+".htm";
            fetch(url)
                .then(function(response) {
                    // When the page is loaded convert it to text
                    return response.text()
                })
                .then(function(html) {
                    // Initialize the DOM parser
                    var parser = new DOMParser();

                    // Parse the text
                    var doc = parser.parseFromString(html, "text/html");

                    // Process the DOM object
                    var items = doc.getElementById('browser_items');
                    var ul = items.getElementsByTagName('ul')[0];
                    var items = ul.getElementsByTagName('li');
                    var products = new Array();

                    var iter_max = items.length > 6 ? 6 : items.length;
                    for (var i = 0; i < iter_max; ++i) {
                        var div = items[i].getElementsByTagName('div')[0];
                        if (div.className == "list-item-nc li-product"){
                            var title = div.getElementsByClassName('title')[0].innerHTML;
                            var price  = div.getElementsByClassName(('price_range'))[0]
                                .querySelector("span[itemprop='offers']")
                                .querySelectorAll('span')[1]
                                .innerHTML;
                            var sim = similarity(title, name);
                            var seller = div.getElementsByClassName('action')[0]
                                .getElementsByTagName("img")[0]
                                .getAttribute("alt");

                            var product = {
                                name: title,
                                price: price,
                                seller: seller,
                                sim: sim
                            };
                            products.push(product);
                        }else {
                            var title = div.getElementsByTagName('strong')[0].innerHTML;
                            var sim = similarity(title, name);
                            var productList = div.getElementsByClassName('offers_vert product_item_list')[0];
                            for (var j = 0; j < productList.childElementCount; ++j) {
                                var price = productList.getElementsByClassName('product_item mini')[j]
                                    .getElementsByClassName('product_price')[0]
                                    .querySelector('span')
                                    .innerHTML;
                                var seller = productList.getElementsByClassName('product_item mini')[j]
                                    .getElementsByClassName('product_shop')[0]
                                    .getElementsByTagName("img")[0]
                                    .getAttribute("alt");
                                var product = {
                                    name: title,
                                    price: price,
                                    seller: seller,
                                    sim: sim
                                };
                                products.push(product);
                            }
                        }

                    }

                    products.sort(compareSimilarity);
                    chrome.storage.local.set({resultGetPrice: products}, function() {});
                    return products;
                })
                .then(price => sendResponse(price))
                .catch(function(err) {
                    console.log('Failed to fetch page: ', err);
                });
            // sendResponse({resultFromGetPrice: ""});
            return true;
        }
    });

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function compareSimilarity( a, b ) {
    if ( a.sim < b.sim ){
        return 1;
    }
    if ( a.sim > b.sim ){
        return -1;
    }
    return 0;
}