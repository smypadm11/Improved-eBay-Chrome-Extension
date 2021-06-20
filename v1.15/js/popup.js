//This is the clean version 
//removing chrome tabs executescript code might go back to use it if needed
//access via www.ebay.com.au dont forget .au !
//I use alert on several part to show how this could be work

var url = window.location.href;
var disabled;
chrome.extension.sendMessage({ cmd: "getOnOffState" }, function (response) {
	if (response != undefined) {
		disabled=response;
	}
});
$(document).ready(function () {
	if (disabled) {
		//home page
		if ( url.match( /^(https?|chrome):\/\/(www)\.(ebay)\.(com)\.(au)\/$/ ) )
		{
			//alert('home page works');
		
			var recentlyviewed;
			//try to find the exact text and edit on condition
			//if($('h2.hl-card-header__headline').find('a').text().includes("Your Recently Viewed Items"))
			if($('div#items_list1').find('a').text().includes("Your Recently Viewed Items"))
			{
				//var id_viewed = $('h2.hl-card-header__headline').closest('div').attr('id');
				//alert($('h2.hl-card-header__headline < div').first().closest('div').attr('id'));
				//alert($('h2.hl-card-header__headline < div').first('div').attr('id'));
				//$(".modal-header > h2").attr("id");
				//alert('have it');
				recentlyviewed = $('div#items_list1').contents();
			}
		
			try{
				$('div.hl-pushdown').detach();
				$('#mainContent').detach();
				$('#gh-hsi').detach();
				$('table.gh-tbl').find('tr').addClass('tr02');
				$('table.gh-tbl').prepend('<tr></tr>');
				$('table.gh-tbl').find('tr:empty').addClass('tr01');
				$('tr.tr01').append('<td>')
				$('tr.tr01').find('td:empty').addClass('td02');
				$('td.td02').append($('td.gh-td:first').contents());
				$('td.td02').attr('style','vertical-align:bottom');
				$('td.td02').attr('colspan','2');
				$('tr.tr01').prepend('<td>')
				$('tr.tr01').find('td:empty').addClass('td01');
				$('tr.tr01').attr('align','center');
				$('tr.tr01').attr('vertical-align','bottom');
				$('tr.tr01').attr('height','300');
				$('table.gh-tbl').append('<tr></tr>');
				$('table.gh-tbl').find('tr:empty').addClass('tr03');
				$('tr.tr03').attr('height','150');
				$('#hlGlobalFooter').before($('<div></div>').addClass('recentview'));
				$('div.recentview').append($(recentlyviewed).contents());
				$('div.recentview').addClass('hl-module hl-standard-carousel off-card hl-atf-module-js');
				$('#hlGlobalFooter').before($('<div></div>').addClass('watchproduct'));
				//$('div.watchproduct').append($(watchedproduct).contents());
				//$('div.watchproduct').addClass('hl-module hl-standard-carousel off-card hl-atf-module-js');
			}catch(err){
				console.log(err);
			}
		}

		//shop by category b directory
		//this part mostly showing ads and upselling so we might unable to delete it all just choose some
		if(url.match( /^(https?|chrome):\/\/(www)\.(ebay)\.(com)\.(au)\/(b)\/.*$/ ))
		{
			//alert('b directory page works');
		
			try{	
				//not working
				//$('section#s0-14-6-0-1[1]-0').detach();
				//$('section#s0-25_2-9-0-1[0]-0-0').remove();
				//$('div.title-banner__right-image').remove();
				//$('div.b-promobanner__info').remove();
			
				//work
				//$('section.b-module').remove();
				$('#gh-hsi').detach();
				$('section.clearfix').remove();
			}catch(err){
				console.log(err);
			}
		}

		//products page sch directory
		if ( url.match( /^(https?|chrome):\/\/(www)\.(ebay)\.(com)\.(au)\/(sch)\/.*$/ ) )
		{
			//alert('products page works');
		
			try{	
		
				$('#gh-hsi').detach();
				Array.from(document.getElementsByClassName("srp-1p srp-1p__banner srp-1p--large")).forEach(element => element.remove());
				Array.from(document.getElementsByClassName("srp-rail__right")).forEach(element => element.remove());
				Array.from(document.getElementsByClassName("s-answer-region s-answer-region-left-rail-bottom")).forEach(element => element.remove());
				Array.from(document.getElementsByClassName("scandal-placement")).forEach(element => element.remove());
				$('div#w13').detach();
				$('li#gh-ti').detach();
			
			}catch(err){
				console.log(err);
			}
		
		}

		//item page itm directory
		if ( url.match( /^(https?|chrome):\/\/(www)\.(ebay)\.(com)\.(au)\/(itm)\/.*$/ ) )
		{
			//alert('itm page works');
		
			try{	
				var price = document.getElementById("mainContent");
			
				// Create compare price button
				let btn = document.createElement("BUTTON");
				btn.innerHTML = "Compare Price";
				btn.id = "compare_price";
				btn.className = "btn btn-scnd  vi-VR-btnWdth-XL";
				btn.addEventListener("click", showImage);
				btn.setAttribute("data-target", "modal1");
				btn.setAttribute("style", "margin:5px");
			
				//Create Review button
				let reviewButton = document.createElement("BUTTON");
				reviewButton.innerHTML = "Product Review";
				reviewButton.id = "Review_summary";
				reviewButton.className = "btn btn-scnd  vi-VR-btnWdth-XL";
				reviewButton.addEventListener("click", showReview);
				reviewButton.setAttribute("style", "margin:5px");
			
				// Create priceCompareModal
				let modal = document.createElement("DIV");
				modal.id = "modal1";
				modal.className = "modal";
				let modalContent = document.createElement("DIV");
				modalContent.className = "modal-content";
				modal.appendChild(modalContent);


				if (price != null){
					price.appendChild(btn);
					price.appendChild(modal);
					price.appendChild(reviewButton);
				}
			

				function showImage() {
					console.log("Button clicked!");

					var productName = document.createElement("DIV");
					productName.innerHTML = document.getElementById("itemTitle").innerHTML.replace(/<span class="g-hdn">Details about  &nbsp;<\/span>/g, '');

					var productPrice = document.createElement("DIV");
					productPrice.innerHTML = document.getElementById("prcIsum").innerHTML;

					var compareResult = document.createElement("DIV");
	
					chrome.runtime.sendMessage({operation: "fetchGetPrice", name: productName.innerHTML}, function(response) {    
						console.log(response);
						chrome.storage.local.get(['resultGetPrice'], function(products) {
							var resultGetPrice = products.resultGetPrice;
							for (var k = 0; k < resultGetPrice.length; ++k) {
								console.log(resultGetPrice[k].name);
								console.log(resultGetPrice[k].price);
								console.log(resultGetPrice[k].seller);
								console.log(resultGetPrice[k].sim);
							}
							var table = createTable(resultGetPrice);
							compareResult.appendChild(table);
						});
					});


					modalContent.appendChild(document.createElement("HR"));
					modalContent.appendChild(productName);
					modalContent.appendChild(document.createElement("HR"));
					modalContent.appendChild(productPrice);
					modalContent.appendChild(document.createElement("HR"));
					modalContent.appendChild(compareResult);

					var elem = document.querySelector('#modal1');
					var instance = M.Modal.init(elem, {onCloseEnd:function(){
						modalContent = document.createElement("DIV");
					}});
					instance.open();
				}

				function createTable(data){
					var table = document.createElement("TABLE");
					var thead = document.createElement("THEAD");
					var tr = document.createElement("TR");
					var th1 = document.createElement("TH");
					th1.innerHTML = "<b>Name</b>";
					th1.style = "border-bottom: 1px solid #ddd";
					var th2 = document.createElement("TH");
					th2.innerHTML = "<b>Price</b>";
					th2.style = "border-bottom: 1px solid #ddd";
					var th3 = document.createElement("TH");
					th3.innerHTML = "<b>Seller</b>";
					th3.style = "border-bottom: 1px solid #ddd";

					tr.appendChild(th1);
					tr.appendChild(th2);
					tr.appendChild(th3);
					thead.appendChild(tr);
					table.appendChild(thead);

					var tbody = document.createElement("TBODY");
					for (var i = 0; i < data.length; ++i) {
						var tr = document.createElement("TR");
						tr.classname = "row100 body";
						tr.style = "height:35px"
						var td1 = document.createElement("TD");
						td1.innerHTML = data[i].name;
						td1.classname = "cell100 column1";
						td1.style = "border-bottom: 1px solid #ddd";
						var td2 = document.createElement("TD");
						td2.innerHTML = data[i].price;
						td2.classname = "cell100 column2";
						td2.style = "border-bottom: 1px solid #ddd";
						var td3 = document.createElement("TD");
						td3.innerHTML = data[i].seller;
						td3.classname = "cell100 column3";
						td3.style = "border-bottom: 1px solid #ddd";

						tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						tbody.appendChild(tr);
					}

					table.appendChild(tbody);

					return table;
				}
			
				function showReview() {
					console.log("Button clicked!");
				
					var productName = document.createElement("DIV");
					productName.innerHTML = document.getElementById("itemTitle").innerHTML.replace(/<span class="g-hdn">Details about  &nbsp;<\/span>/g, '');
					window.open("https://www.productreview.com.au/search?q=" + productName.innerHTML + "&showDiscontinued=true", "_blank");
				
				}

				//remove will show error on console have to test this out on various machine otherwise use detach() or etc
				//document.getElementById("scandal100938").remove();
				//document.getElementById("scandal100562").remove();
				//document.getElementById("scandal100567").remove();
				//document.getElementById("merch_html_100005").remove();
				//document.getElementById("merch_html_100752").remove();
				//document.getElementById("merch_html_100008").remove();
				//document.getElementById("promotionsCntr").remove();
				//document.getElementById("FootPanel").remove();
				$('#gh-hsi').detach();
				$('#scandal100938').detach();
				$('#scandal100562').detach();
				$('#scandal100567').detach();
				$('#merch_html_100005').detach();
				$('#merch_html_100752').detach();
				$('#merch_html_100008').detach();
				$('#promotionsCntr').detach();
				$('#FootPanel').detach();
			
			}catch(err){
				console.log(err);
			}
		}

		//myb directory
		if ( url.match( /^(https?|chrome):\/\/(www)\.(ebay)\.(com)\.(au)\/(myb)\/.*$/ ) )
		{
			//alert('myb directory works');
		
			try{	
		
				$('div.me-rtm').detach();
				$('div.me-rtm').detach();
				$('#gh-ti').detach();
				$('#scandal100744').detach();
				$('#scandal100699').detach();
			
			}catch(err){
				console.log(err);
			}
		}

		//myb directory only for watchlist and will work when log in as ebay user
		if ( url.match( /^(https?|chrome):\/\/(www)\.(ebay)\.(com)\.(au)\/(myb)\/(WatchList)/ ) )
		{
			//alert('myb watchlist directory works');
		
			try{	
		
				$('div.leaderboard_ad').detach();
				$('#scandal100551').detach();
				//some part below is not working
				$('#widget-platform').detach();
				$('#google_ads_iframe_/2455/ebay.au.footer_0__container__').remove();
				$('#scandal100736').remove();
			
			}catch(err){
				console.log(err);
			}
		}
	}
});

//to work with button 
//not working as prefer yet but can reload the page
document.addEventListener('DOMContentLoaded', function () {
	var checkPageButton = document.getElementById('checkPage');
	chrome.extension.sendMessage({ cmd: "getOnOffState" }, function (response) {
		if (response != undefined) {
			if (response) {
				checkPageButton.innerHTML = "Turn off";
			}
			else {
				checkPageButton.innerHTML = "Turn on";
			}
			disabled=response;
		}
	});
	checkPageButton.addEventListener('click', function () {
		chrome.extension.sendMessage({ cmd: "setOnOffState", data: { value: !disabled } });
		chrome.tabs.executeScript({
			code: 'location.reload()'
		});

	});

}, false);

