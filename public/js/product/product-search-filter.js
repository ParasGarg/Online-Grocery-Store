$(function () {
	$("#slider-range").slider({
		range: true,
		min: 0,
		max: 100,
		values: [0, 100],
		slide: function (event, ui) {
			$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
		}
	});

	$(function () {
		$(".controlgroup").controlgroup()
		$(".controlgroup-vertical").controlgroup({
			"direction": "vertical"
		});
	});

	$("#amount").val("$" + $("#slider-range").slider("values", 0) +" - $" + $("#slider-range").slider("values", 1));

});

function view(id) {
	window.location.href = `/product/id/${id}`;
}

/* slider features */
$(function() {
    $("#slider-range").on("slidestop", function(event, ui) {
    	var startPrice = $("#slider-range").slider("values", 0);
    	var endPrice = $("#slider-range").slider("values", 1);
		var searchKey = $("#searched-value").val();

		if (startPrice >=0 && endPrice <= 100) {
			if (startPrice === 0) {
				startPrice = "0";
			}

			let formData = {
				search: searchKey,
				startRange: startPrice,
				endRange: endPrice
			}

			$.ajax({
				url: "/product/search/filter",
				type: "POST",
				dataType: "json",
				data: JSON.stringify(formData),
				success: function(data) {
					if(data.empty == false) {
						let html = "";
						for (var i = 0; i < data.product.length; i++) {
							
							html += "" + 
								'<div class="panel panel-default item">' +
									'<div class="panel-heading" role="tab" id="profile-head">' +
										'<a role="button" href="/product/id/' + data.product[i]._id + '" data-parent="#accordion" aria-expanded="true" aria-controls="profile-panel">' +
											'<h2 class="panel-title head">' +
												data.product[i].title +
											'</h2>' +
										'</a>' +
									'</div>'+
									'<div id="profile-panel" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="profile-head">' +
										'<div class="panel-body">' +
											'<div class="col-md-12">' +
												'<div class="row">' +
													'<img src="'+ data.product[i].images[0] + '" alt="' + data.product[i].title +'" />' +
												'</div>' +
												'<div class="row detail">' +
													'<div class="col-md-6 price">' +
														'<i class="fa fa-dollar"></i>' + data.product[i].price +
													'</div>' +
													'<div class="col-md-6">' +
														'<input type="submit" class="btn btn-default" onclick="window.location.href = ' + "'/product/id/" + data.product[i]._id + "'" + '" value="View Details"/>' +
													'</div>' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>';
						}
						
						$("#products-list").html(html);
						
					} else {
						$("#products-list").html("<br/><br/><br/><br/><p>Your search did not match any products.<p>");
					}
				},
				contentType: "application/json"
			});

		} else {
			alert("Incorrect price range");
		}
    });
});

function viewDetails(id) {
	window.location.href = `/product/category/${id}`	
}

/* radio button features */
function categorySearch(category) {
	window.location.href = `/product/category/${category}`
}
