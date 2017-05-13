$("#form :input").blur(function() {
  $("#form").submit();
});

function deleteCartItem(prod) {

	const data = {
		id: prod
	}

	$.ajax({
		url: "/user/update/cart",
		type: "DELETE",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(result) {
			$("#success-cart-list").removeClass("hidden");
			$("#saved-cart-list").load(location.href + " #saved-cart-list");
			$("#cart-size").load(location.href + " #cart-size");
			
			if (result.cartSize != 0) {
				$("#total-cost").load(location.href + " #total-cost");
				$("#tax-cost").load(location.href + " #tax-cost");
				$("#net-cost").load(location.href + " #net-cost");
			} else {
				$("#summary").css("display", "none");
			}

			setTimeout(() => {
				$("#success-cart-list").addClass("hidden");
			},6000);
		},
		contentType: "application/json"
	});
}