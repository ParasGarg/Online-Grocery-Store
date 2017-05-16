//
$(document).ready(function() {

	// click on form button
    $("#btn-add-cash").on('click', function() {
		var numRegex = "/^\d+$/;"
		var alphRegex = /^[A-Za-z]+$/;

		const cardName = $("#card-name").val();
		const cardNumber = $("#card-number").val();
		const cardType = $("#card-type").val();
		const expiryMonth = $("#card-month").val();
		const expiryYear = $("#card-year").val();
		const cardIssuer = $("#card-brand").val();
		const cvv = $("#card-cvv").val();

		if (cardName.length > 0 && cardNumber.length > 0 && expiryMonth.length > 0 && expiryYear.length > 0 && cvv.length > 0
				&& cardType.length > 0 /*&& cardIssuer.length > 0*/) {

			if (cardNumber.length == 16) {
				if ((expiryMonth >= 1  && expiryMonth <= 12) && (expiryYear >= 2017 && expiryYear <= 2051)) {
					if((expiryYear == 2017 && expiryMonth > 4) || (expiryYear > 2017)) {
						if ((cvv >= 1 && cvv <= 9999) && (cvv.length >= 3 && cvv.length <=4)) {
							$("#form-payment-detail").submit();
						} else {
							$("#success-add-cash").addClass("hidden");
							$("#error-add-cash").removeClass("hidden");
							$("#error-add-cash-message").html("Invalid CVV");
						}
					} else {
						$("#success-add-cash").addClass("hidden");
						$("#error-add-cash").removeClass("hidden");
						$("#error-add-cash-message").html("Card expiry date has been passed");
					}
				} else {
					$("#success-add-cash").addClass("hidden");
					$("#error-add-cash").removeClass("hidden");
					$("#error-add-cash-message").html("Invalid expiry date");
				}
			} else {
				$("#success-add-cash").addClass("hidden");
				$("#error-add-cash").removeClass("hidden");
				$("#error-add-cash-message").html("Invalid card number");
			}
		} else {
			$("#success-add-cash").addClass("hidden");
			$("#error-add-cash").removeClass("hidden");
			$("#error-add-cash-message").html("The fields cannot be blank");
		}

		setTimeout(() => {
			$("#error-add-cash").addClass("hidden");
			$("#success-add-cash").addClass("hidden");
		},6000);
    });

	// click on add card form button
    $("#btn-error-close").on('click', function() {
		$("#error-add-cash").addClass("hidden");
	});
});