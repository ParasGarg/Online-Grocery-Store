
function isNumber(value, tagId) {
	const numbericRegex = "/^\d+$/;";

	if (numbericRegex.test(value)) {
		return true;
	} else {
		$(`#success-${tagId}`).addClass("hidden");
		$(`#error-${tagId}`).removeClass("hidden");
		$(`#${tagId}`).val("");
		$(`#error-${tagId}-message`).html("Only numeric value is allowed");

		return false;
	}
}