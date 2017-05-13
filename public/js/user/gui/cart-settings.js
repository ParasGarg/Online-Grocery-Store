function deleteCartItem(prod) {

	const data = {
		id: prod
	}

	$.ajax({
		url: "/user/update/cart",
		type: "DELETE",
		dataType: "json",
		data: JSON.stringify(data),
		success: function() {
			alert(1);
			$("#success-cart-list").removeClass("hidden");
			$("#saved-cart-list").load(location.href + " #saved-cart-list");
			setTimeout(() => {
				$("#success-cart-list").addClass("hidden");
			},6000);
		},
		contentType: "application/json"
	});
}

