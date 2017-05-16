//
$(document).ready(function() {

	// click on user product-cart form button
    $("#btn-user-product-cart").on('click', function() {
		
		const prodId = $("#product-id").val();
		const form = $("#form-user-product-cart");

		const formData = {
			id: prodId
		}

		$.ajax({
			url: "/user/update/cart/",
			type: "POST",
			dataType: "json",
			data: JSON.stringify(formData),
			success: function(data) {
				$("#error-product-cart").addClass("hidden")						
				$("#success-product-cart").removeClass("hidden");
			},
			contentType: "application/json"
		});
    });
});