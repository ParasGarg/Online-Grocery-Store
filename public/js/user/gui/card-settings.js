//
$(document).ready(function() {

	// click on user login form button
    $("#btn-add-card").on('click', function() {
		var numRegex = "/^\d+$/";
		var alphRegex = /^[A-Za-z]+$/;

		const cardName = $("#card-name").val();
		const cardNumber = $("#card-number").val();
		const cardType = $("#card-type").val();
		const expiryMonth = $("#card-month").val();
		const expiryYear = $("#card-year").val();
		//const cardIssuer = $("#card-brand").val();
		const cvv = $("#card-cvv").val();
		const form = $("#form-add-card");

		if (cardName.length > 0 && cardNumber.length > 0 && expiryMonth.length > 0 && expiryYear.length > 0 && cvv.length > 0
				&& cardType.length > 0 /*&& cardIssuer.length > 0*/) {

			if (cardNumber.length == 16) {
				if ((expiryMonth >= 1  && expiryMonth <= 12) && (expiryYear >= 2017 && expiryYear <= 2051)) {
					if((expiryYear == 2017 && expiryMonth > 4) || (expiryYear > 2017)) {
						if ((cvv >= 1 && cvv <= 9999) && (cvv.length >= 3 && cvv.length <=4)) {

							const formData = {
								number: cardNumber,
								username: cardName,
								type: cardType,
								//issuer: cardIssuer,
								exp: `${expiryMonth}/${expiryYear}`,
								cvv: cvv
							}

							$.ajax({
								url: "/user/update/card",
								type: "POST",
								dataType: "json",
								data: JSON.stringify(formData),
								success: function() {
									$("#error-add-card").addClass("hidden")						
									$("#success-add-card").removeClass("hidden");
								},
								error: function (xhr, ajaxOptions, thrownError) {
									if (xhr.status === 200) {	// receiving 200 status code
										$("#error-add-card").addClass("hidden")						
										$("#success-add-card").removeClass("hidden");
										$("#saved-card-list").load(location.href + " #saved-card-list");
										$("#card-name").val("");
										$("#card-number").val("");
										$("#card-type").val("Card Type");
										$("#card-month").val("");
										$("#card-year").val("");
										//$("#card-brand").val("Card Brand");
										$("#card-cvv").val("");
									} else if (xhr.status === 400) {	// receiving 400 status code
										$("#success-add-card").addClass("hidden");
										$("#error-add-card").removeClass("hidden");
										$("#error-add-card-message").html("This card is already saved");
									}
								},
								contentType: "application/json"
							});

						} else {
							$("#success-add-card").addClass("hidden");
							$("#error-add-card").removeClass("hidden");
							$("#error-add-card-message").html("Invalid CVV");
						}
					} else {
						$("#success-add-card").addClass("hidden");
						$("#error-add-card").removeClass("hidden");
						$("#error-add-card-message").html("Card expiry date has been passed");
					}
				} else {
					$("#success-add-card").addClass("hidden");
					$("#error-add-card").removeClass("hidden");
					$("#error-add-card-message").html("Invalid expiry date");
				}
			} else {
				$("#success-add-card").addClass("hidden");
				$("#error-add-card").removeClass("hidden");
				$("#error-add-card-message").html("Invalid card number");
			}
		} else {
			$("#success-add-card").addClass("hidden");
			$("#error-add-card").removeClass("hidden");
			$("#error-add-card-message").html("The fields cannot be blank");
		}

		setTimeout(() => {
			$("#error-add-card").addClass("hidden");
			$("#success-add-card").addClass("hidden");
		},6000);
    });

	// click on add card form button
    $("#btn-error-close").on('click', function() {
		$("#error-add-card").addClass("hidden");
	});
});

function deleteCard(cardNumber) {

	var data = {
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

