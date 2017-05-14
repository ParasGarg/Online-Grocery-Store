$(function () {
	$("#slider-range").slider({
		range: true,
		min: 0,
		max: 500,
		values: [75, 300],
		slide: function (event, ui) {
			$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
		}
	});

	$(function () {
		$(".controlgroup").controlgroup()
		$(".controlgroup-vertical").controlgroup({
			"direction": "vertical"
		});
	});

	$("#amount").val("$" + $("#slider-range").slider("values", 0) +" - $" + $("#slider-range").slider("values", 1));
	$("#category").val("$" + $("#slider-range").slider("values", 0) +" - $" + $("#slider-range").slider("values", 1));
});

function view(id) {
	window.location.href = `/product/id/${id}`;
}