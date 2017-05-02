//
$(document).ready(function() {

	// click on user wallet form button
    $("#btn-user-wallet").on('click', function() {
		const regex = /^[A-Za-z]+$/; 
		const amount = $("#amount").val();
		const form = $("#form-user-wallet");

		if (amount.length > 0) {
			if (!regex.test(amount)) {

				const formData = {
					wallet: amount
				}

				$.ajax({
					url: "/user/update",
					type: "POST",
					dataType: "json",
					data: JSON.stringify(formData),
					success: function(data) {
						$("#error-wallet").addClass("hidden");
						$("#success-wallet").removeClass("hidden");
						$("#wallet-amount").html(`<i class="fa fa-dollar"></i> ` + data);
						$("#amount").val("");
					},
					contentType: "application/json"
				});
			} else {
				$("#success-wallet").addClass("hidden");
				$("#error-wallet").removeClass("hidden");
				$("#amount").val("");
				$("#error-wallet-message").html("Only numeric value is allowed");
			}
		} else {
			$("#success-wallet").addClass("hidden");
			$("#error-wallet").removeClass("hidden");
			$("#error-wallet-message").html("The fields cannot be blank");
		}

		setTimeout(() => {
			$("#error-wallet").addClass("hidden");
			$("#success-wallet").addClass("hidden");
		},3000);
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

	// click on user login form button
    $("#btn-error-close").on('click', function() {
		$("#error-wallet").addClass("hidden");
	});
});