// subsctiption form validation
$(document).ready(function() {

	// click on user login form button
    $("#btn-subscribe").on('click', function() {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
		const email = $("#subscribe-email").val();
		const form = $("#form-subscribe");

		if (email.length) {
			if (regex.test(email)) {

				const formData = {
					email: email
				}

				$.ajax({
					url: "/support/subscription/subscribe",
					type: "POST",
					dataType: "json",
					data: JSON.stringify(formData),
					success: function(data) {
						$("#error-subscribe").addClass("hidden")						
						window.location.href = `/support/subscription/status/${data.email}`;
					},
					contentType: "application/json"
				});

			} else {
				$("#success-subscribe").addClass("hidden");
				$("#error-subscribe").removeClass("hidden");
				$("#error-subscribe-message").html("Invalid email id format");
			}
		} else {
			$("#success-subscribe").addClass("hidden");
			$("#error-subscribe").removeClass("hidden");
			$("#error-subscribe-message").html("The field cannot be blank");
		}
    });
});