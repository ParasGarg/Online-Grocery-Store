//
$(document).ready(function() {

	// click on add card form button
    $("#btn-error-close").on('click', function() {
		$("#error-add-card").addClass("hidden");
	});
});

function deleteCard(cardNumber) {

	data = {
		cardNumber: cardNumber
	}

	$.ajax({
		url: "/user/update/card",
		type: "DELETE",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(result) {
			$("#success-card-list").removeClass("hidden");
			$("#saved-card-list").load(location.href + " #saved-card-list");
			setTimeout(() => {
				$("#error-add-card").addClass("hidden");
				$("#success-add-card").addClass("hidden");
			},6000);
		},
		contentType: "application/json"
	});
}

