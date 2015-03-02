(function() {
	var nickname = prompt('Enter a nickname', 'Guest'),
		typing = false,		
		socket = io();
	
	$('#submit').on('click', function() {	
		if ($('#m').val()) {	
			socket.emit('chat message', nickname, $('#m').val());
			$('#messages').append(
				$('<li>').text(nickname + ': ' + $('#m').val())
			);		
			$('#m').val('');
		}
		return false;		
	});
	socket.on('chat message', function(name, msg) {
		$('#' + name + '-typing').remove();	
		$('#messages').append($('<li>').text(name + ': ' + msg));		
	});
	socket.on('user connected', function(user) {
		$('#messages').append($('<li>').text(user + ' has joined the room'));	
		$('#users').append($('<li>').text(user));	
	});
	socket.on('user typing', function(data) {					
		$('#messages').append(
			$('<li id="' + data + '-typing" class="typing">').text(data+ ' is typing...')
		);
	});
	socket.on('cease typing', function(data) {
		$('#' + data).remove();	
	});
	socket.emit('set nickname', nickname);	

	$(document).keypress(function(e) {
					if (e.which == 13) {
						e.preventDefault();
						$('#submit').click();
						typing = false;
						$('#m').focus();
					}	
				})
				.ready(function() {
					$('#messages').append($('<li>').text(nickname + ' has joined the room'));
					$('#users').append($('<li>').text(nickname));	
					$('#m').focus()
						   .on('keyup', function() {
							   if ($(this).val().length) {
								   if (typing === false) {	
									   socket.emit('user typing', nickname);	
								   }
								   typing = true;
							   } else {
								   typing = false;
								   socket.emit('cease typing', nickname + '-typing');
							   }
						   });
				});
})();
