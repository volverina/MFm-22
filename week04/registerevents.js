AFRAME.registerComponent('registerevents', {
	init: function () {
		var marker = this.el;
		marker.addEventListener('markerFound', function() {
			console.log('markerFound', marker.id); });
		marker.addEventListener('markerLost', function() {
			console.log('markerLost', marker.id); });
	}
});
