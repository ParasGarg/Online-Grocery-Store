//
$(document).ready(function() {

	// click on user wallet form button
    $("#btn-user-quick-add").on('click', function() {

		const regex = /^[A-Za-z]+$/;
		const amtRegex = /^\d+(\.\d{1,2})?$/;
		const amtZeroRegex = /^[1-9][0-9]*$/;
		const amount = $("#amount").val();
		const card = $("#pay-card").val();
		const form = $("#form-user-wallet");

		if (amount.length > 0 && card != null) {
			if (amount > 0 && amount < 1001) {
				if (!regex.test(amount) && amtRegex.test(amount) && amtZeroRegex.test(amount)) {
						const formData = {
							amount: amount,
							action: "Credit",
							description: "Added cash in wallet",
							cardUsed: card
						}

						$.ajax({
							url: "/user/update/wallet",
							type: "PUT",
							dataType: "json",
							data: JSON.stringify(formData),
							success: function(data) {
								if (data.success == false) {
									$("#success-wallet").addClass("hidden");
									$("#error-wallet").removeClass("hidden");
									$("#amount").val("");
									$("#error-wallet-message").html("Total wallet limit exceed. Maximum $10000 are allowed.");
								} else {
									$("#error-wallet").addClass("hidden");
									$("#success-wallet").removeClass("hidden");
									$("#wallet-amount").html(`<i class="fa fa-dollar"></i> ` + data.amount);
									$("#wallet-transaction-panel").load(location.href + " #wallet-transaction-panel");
									$("#amount").val("");
									$("#pay-card").val("Select card to pay");
								}
							},
							error: function (xhr, ajaxOptions, thrownError) {
								alert(thrownError);
							},
							contentType: "application/json"
						});
				} else {
					$("#success-wallet").addClass("hidden");
					$("#error-wallet").removeClass("hidden");
					$("#amount").val("");
					$("#error-wallet-message").html("Invalid Amount");
				}
			} else {
				$("#success-wallet").addClass("hidden");
				$("#error-wallet").removeClass("hidden");
				$("#error-wallet-message").html("Amount should be in between $1 and $1000");
			}
		} else {
			$("#success-wallet").addClass("hidden");
			$("#error-wallet").removeClass("hidden");
			$("#error-wallet-message").html("Fields cannot be blank for Quick Add");
		}

		setTimeout(() => {
			$("#error-wallet").addClass("hidden");
			$("#success-wallet").addClass("hidden");
		},3000);
    });

	// click on user wallet form button
    $("#btn-user-add").on('click', function() {
		const regex = /^[A-Za-z]+$/;
		const amtRegex = /^\d+(\.\d{1,2})?$/;
		const amount = $("#amount").val();

		if (amount.length > 0) {
			if (amount > 0) {
				if (!regex.test(amount) && amtRegex.test(amount)) {

					$("#form-user-wallet").submit();
					
				} else {
					$("#success-wallet").addClass("hidden");
					$("#error-wallet").removeClass("hidden");
					$("#amount").val("");
					$("#error-wallet-message").html("Invalid Amount");
				}
			} else {
				$("#success-wallet").addClass("hidden");
				$("#error-wallet").removeClass("hidden");
				$("#error-wallet-message").html("Invalid Amount");
			}
		} else {
			$("#success-wallet").addClass("hidden");
			$("#error-wallet").removeClass("hidden");
			$("#error-wallet-message").html("Please enter Amount to add");
		}
    });

	// click on user wallet form button
    $("#amount").on('keypress', function(e) {
		// allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
	});

	// on selecting dropdown
	$("#pay-card").on('change', function() {
		var addCard = $("#pay-card option:selected").val();

        if (addCard === "redirect") {
            location = "/user/dashboard/payments#add-card-head"
        }   

    });

	// click on user login form button
    $("#btn-error-close").on('click', function() {
		$("#error-wallet").addClass("hidden");
	});
});