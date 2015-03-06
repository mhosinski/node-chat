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
				addUserToList(user, false);
    });
    socket.on('user disconnected', function(user) {
			$('#messages').append($('<li>').text(user + ' has left the room'));
			$('#' + user).remove();
		});
		socket.on('user typing', function(data) {
        $('#messages').append(
            $('<li id="' + data + '-typing" class="typing">').text(data+ ' is typing...')
        );
    });
    socket.on('cease typing', function(data) {
        $('#' + data).remove();
    });
		socket.on('userlist', function(data) {
				// TO DO: Should build document fragment instead of adding one at a time.
				for (var i = data.length - 1; i >= 0; i--) {
					addUserToList(data[i], true);
				}
		});
		socket.on('messagelist', function(data) {
				// TO DO: Should create a fragment instead of attaching elements one at a time.
				for (var i = 0, j = data.length; i < j; i++) {
					$('#messages').prepend($('<li>').text(data[i]));
				}
		});
    socket.emit('set nickname', nickname);


    $(document)
				.keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                $('#submit').click();
                typing = false;
                $('#m').focus();
            }
        })
        .ready(function() {
            $('#messages').append($('<li>').text(nickname + ' has joined the room'));
						addUserToList(nickname, false);
            $('#m').focus().on('keyup', function() {
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

		function addUserToList(name, prepend) {
			if (prepend) {
				$('#users').prepend($('<li>').text(name).attr('id', name));
			} else {
				$('#users').append($('<li>').text(name).attr('id', name));
			}
		}


})();
