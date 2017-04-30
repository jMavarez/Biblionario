$(document).ready(function() {
    const rq = require('load-json-file');
    let data;
    let correct;

	startSound('background', true);

    $('.options').click(function(){
		$this = $(this);
		// console.log(chosen==answer ? 'True' : 'False');

		//if correct answer
		$('.options').addClass('disabled');
        console.log($this.val() == correct);
        
		if($this.val() == correct){
			//Play Right
			startSound('rightsound', false);
			$this.fadeToggle().fadeToggle().addClass('disabled correct');
		}
		else{
			//Play Wrong
			startSound('wrongsound', false);
			$this.fadeToggle().fadeToggle().addClass('disabled wrong');
			$('.options').each(function(){
				$this = $(this);
				if($this.val() == correct){
					$this.fadeToggle().fadeToggle().addClass('disabled correct');
				}
			});

			// gameOver();
		}
	});

    $('#fifty').click(function() {
		$(this).addClass('disabled');
		fifty();
	});

    rq('questions.json').then(json => {
        data = json;
    });

    require('electron').ipcRenderer.on('send-question', function (event, message) {
        console.log(message);
        var args = message.split('-');
        var question = getQuestion(args[0], args[1], args[2]);
        correct = question.correct;

        $('.options').removeClass('correct wrong disabled');
		$('.options span').html('').fadeIn();

        $('.question p').html(question.question);

        $('.option-a span').html(question.options[0]);
        $('.option-a').val(0);
		$('.option-b span').html(question.options[1]);
        $('.option-b').val(1);
		$('.option-c span').html(question.options[2]);
        $('.option-c').val(2);
		$('.option-d span').html(question.options[3]);
        $('.option-d').val(3);
    });

    function getQuestion(i, j, k) {
        return data[i].rounds[j].questions[k];
    }

    function fifty(){
        var second_opt = false;
        $('.options span').fadeOut();

        $('.options').each(function(){
            $this = $(this);

            if($this.val() == correct){
                $this.find('span').fadeToggle();
            }
            else if(!second_opt || Math.floor(Math.random()*1)){
                $this.find('span').fadeToggle();
                second_opt = true;
            }
        });
    }
});



    startSound = function(id, loop) {
        soundHandle = document.getElementById(id);
        if(loop)
            soundHandle.setAttribute('loop', loop);
        soundHandle.play();
    }