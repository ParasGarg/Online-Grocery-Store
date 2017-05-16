//
$(document).ready(function() {

	// click on contact us form button
    $("#btn-send").on('click', function() {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
		const name = $("#contact-name").val();
		const email = $("#contact-email").val();
		const contact = $("#contact-mobile").val();
		const desp = $("#contact-description").val();
		const form = $("#form-contact-us");

		if (name.length > 0 && email.length > 0 && contact.length > 0 && desp.length) {
			if (regex.test(email)) {
				if(contact.length == 10) {
					const formData = {
						name: name,
						email: email,
						mobile: contact,
						description: desp
					}
					
					$.ajax({
						url: "/support/contact-us/",
						type: "POST",
						dataType: "json",
						data: JSON.stringify(formData),
						success: function() {
							$("#contact-name").val("");
							$("#contact-email").val("");
							$("#contact-mobile").val("");
							$("#contact-description").val("");
							$("#error-contact").addClass("hidden")						
							$("#success-contact").removeClass("hidden");
						},
						contentType: "application/json"
					});
				} else {
					$("#success-contact").addClass("hidden");
					$("#error-contact").removeClass("hidden");
					$("#error-contact-message").html("Invalid phone number");
				}
			} else {
				$("#success-contact").addClass("hidden");
				$("#error-contact").removeClass("hidden");
				$("#error-contact-message").html("Invalid email id");
			}
		} else {
			$("#success-contact").addClass("hidden");
			$("#error-contact").removeClass("hidden");
			$("#error-contact-message").html("Fields cannot be empty");
		}
    });

	// click on user login form button
    $("#btn-error-close").on('click', function() {
		$("#error-contact").addClass("hidden");
	});
});