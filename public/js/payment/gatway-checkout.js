$(document).ready(function() {

	// click on user profile form button
    $("#btn-saved-card").on('click', function() {

		const card = $('input[name="savedCard"]:checked').val();
		const form = $("#form-saved-card");

		if (card === undefined) {
			alert("Please select card");
		} else {
			form.submit();
		}
    });
});